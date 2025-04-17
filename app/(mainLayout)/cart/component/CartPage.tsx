'use client'
import React, { useEffect, useRef, useState } from 'react';
import fetcher from '@/lib/fetcher';
import PatientDetailsPopup, { PatientDetails } from '../../../components/popups/PatientDetailsPopup';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Loading, { CartLoader } from '../loading';
import { SelectLocation } from '@/app/(mainLayout)/cart/component/SelectLocation';
import CartItemCard from './CartItemCard';
import OrderTimeSelector from './OrderTimeSelector';
import ConfirmationModel from '@/app/components/popups/ConfirmationModel';
import { User } from '../../profile/page';
import CheckBox from '@/components/Inputs/CheckBox';
import { useItemCountContext } from '@/app/contexts/ItemCountContext';
import SpinLoader from '@/components/loader/SpinLoader';

export type CartItem = {
    product: {
        test: { name: string, _id: string, labsDetails: { [key: string]: { lab: string, offer: number } } };
        lab: { name: string, _id: string, location: { address: Address } };
        price: number;
    };
    patientDetails: PatientDetails[];
    quantity: number;
};

export type Cart = {
    items: CartItem[];
    user: string;
    createdAt: Date;
    updatedAt: Date;
};

type PageProps = {
    filterCartFunc?: (item: CartItem) => boolean;
    onFetchedCart?: () => void;
    showRemoveBtn?: boolean;
};

export const CartPage = ({ filterCartFunc = () => true, onFetchedCart = () => { }, showRemoveBtn = true }: PageProps) => {
    const [cart, setCart] = useState<Cart | null>(null);

    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showPatientPopup, setShowPatientPopup] = useState<{ cartIndex: number, patientIndex: number } | null>(null);
    const [showScheduleOrderTimesModel, setShowScheduleOrderTimesModel] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState<{ item: CartItem, index: number } | null>(null);

    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>()
    const [patientDetails, setPatientDetails] = useState<PatientDetails[]>([]);
    const [allocatedTimes, setAllocatedTimes] = useState<string[]>([])
    const [isPatientDetailsRequired, setIsPatientDetailsRequired] = useState(true);
    const orderItems = useRef<TempOrderDetails>(null);

    const { setItemCount } = useItemCountContext();

    const navigate = useRouter();

    useEffect(() => {
        fetchCart();
        fetchUser();
    }, []);

    useEffect(() => {
        if (selectedAddress?.pin)
            fetchAllocatedTimes(selectedAddress.pin)
    }, [selectedAddress?.pin])

    async function fetchUser() {
        const res = await fetcher.get<User>('/user');
        if (res.status === 200 && res.body) {
            setPatientDetails(res.body.patientDetails);
        }
    }

    async function fetchCart() {
        try {
            const response = await fetcher.get<Cart>('/cart');
            if (response.status !== 200) {
                throw new Error('Failed to fetch cart');
            }
            if (response.body) {
                response.body.items = response.body.items.filter(item => filterCartFunc(item));
                response.body.items.forEach(item => {
                    const labPrice = item.product.test.labsDetails[item.product.lab._id].offer;
                    if (labPrice) {
                        item.product.price = labPrice;
                    }
                });
                setItemCount(response.body.items.length || 0)
                setCart(response.body); // Assuming you want the first cart
                if (onFetchedCart) onFetchedCart()
            }
        } catch (err) {
            console.log(err)
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    async function fetchAllocatedTimes(pin: string) {
        try {
            const response = await fetcher.get<string[]>('/allocated-times?pin=' + pin);
            if (response.status === 200 && response.body) {
                setAllocatedTimes(response.body);
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function updateCart(item: { product: { test: string, lab: string }, patientDetails?: PatientDetails[], address?: { pin: number, city: string, district: string, other?: string }, quantity: number }, onSuccess: () => void) {
        try {
            const response = await fetcher.put<{ product: { test: string, lab: string }, patientDetails?: PatientDetails[], address?: { pin: number, city: string, district: string, other?: string }, quantity: number }, { message: string }>('/cart', item);
            if (response.status === 200 && response.body) onSuccess();
        } catch (err) {
            console.log(err)
            toast.error('Unable to update cart')
        }
    }

    async function changeQuantity(test: string, lab: string, quantity: number) {
        const updatedItem = {
            product: {
                test: test,
                lab: lab
            },
            quantity: quantity
        };
        await updateCart(updatedItem, fetchCart)
    }

    async function order(orderDetails: OrderDetails) {
        setShowLoading(true);
        const res = await fetcher.post<OrderDetails, { message: string }>(`/orders`, orderDetails);
        if (res.status === 200) {
            // await fetcher.delete('/cart');
            // fetchCart();
            toast.success('Your orders has been placed');
            await fetcher.get<{ items: number }>('/cart/count').then(res => {
                if (res.status === 200 && res.body) {
                    setItemCount(res.body.items || 0)
                };
            })
            navigate.push('/order');
        } else {
            toast.error(res.error || 'Unable to place the order currently')
        }
        setShowLoading(false);
    }

    function verify(): boolean {
        if (!selectedAddress) {
            toast.warning('Please select a valid address');
            return false;
        }
        if (!selectedAddress.pin || !selectedAddress.city || !selectedAddress.district || !selectedAddress.phone) {
            toast.warning('Please select a valid address');
            return false;
        }
        return true;
    }

    if (loading) return <Loading />;
    if (showLoading) return <SpinLoader />
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Please Reload Your Page Or Click &nbsp;<button onClick={() => window.location.reload()}>Reload</button></div>;
    if (!cart) return <div className="flex justify-center items-center h-screen">No items in the cart</div>;

    return (
        <div className="flex-1 flex flex-col p-4 bg-gray-100 dark:bg-[#0A192F] min-h-screen">
            <SelectLocation selectedAddress={selectedAddress} onChange={address => setSelectedAddress(address)} />
            <div className='w-full flex gap-4 justify-between items-center py-3 px-4 bg-white dark:bg-[#172A46] rounded shadow mb-5 font-medium'>
                <CheckBox label="Take the details at my location" value={!isPatientDetailsRequired} onChange={() => setIsPatientDetailsRequired(val => !val)} />
            </div>
            {/* <div className='w-full flex gap-4 justify-between items-center py-3 px-4 bg-white rounded shadow mb-5 text-sm'>
                {sampleTakenDateTime && <div>
                    <div className='font-medium'><span className='font-normal'>Start:</span> {sampleTakenDateTime.start.toDateString()}, {sampleTakenDateTime.start.toTimeString().split(' ')[0]}</div>
                    <div className='font-medium'><span className='font-normal'>End:</span> {sampleTakenDateTime.end.toDateString()}, {sampleTakenDateTime.end.toTimeString().split(' ')[0]}</div> */}
            {/* <div className='text-sm text-gray-600'>{selectedAddress.other} | {selectedAddress.phone}</div> */}
            {/* </div>}
                {!sampleTakenDateTime && <div className='font-medium text-base'><span className='font-normal'>Sample Taken Time:</span> Not Scheduled</div>}
                <div className='px-3 py-1 rounded cursor-pointer text-primary font-medium border-2 border-primary text-base' onClick={() => setShowScheduleOrderTimesModel(true)}>Schedule</div>
            </div> */}
            {loading && <CartLoader />}
            {!loading && cart.items?.length > 0 ? <>
                <h1 className="text-2xl font-bold mb-4">Cart Items</h1>
                <ul className="space-y-4 flex-1 pb-32">
                    {cart.items.map((item, index) => (
                        <CartItemCard
                            key={index}
                            item={item}
                            isPatientDetailsRequired={isPatientDetailsRequired}
                            onRemove={showRemoveBtn ? () => fetchCart() : undefined}
                            onQuantityChange={quantity => changeQuantity(item.product.test._id, item.product.lab._id, quantity)}
                            onOrder={() => {
                                if (!verify()) return;
                                setShowConfirmPopup({ item, index })
                            }}
                            onPatientClick={i => setShowPatientPopup({ cartIndex: index, patientIndex: i })}
                        />
                    ))}
                </ul>
                <div className='p-4 fixed bottom-0 left-0 w-screen flex justify-between items-center bg-white dark:bg-[#172A46]'>
                    <div>Total: <div className="text-2xl font-semibold">₹{cart.items.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0).toFixed(2)}</div> <div className='text-gray-500 dark:text-gray-300'>+ ₹0 Delivery Charges</div></div>
                    <button className="bg-primary text-white px-5 py-2 rounded-sm" onClick={async () => {
                        // verification
                        if (cart?.items?.length <= 0) toast.warning("Cart is empty");

                        if (isPatientDetailsRequired)
                            for (let index = 0; index < cart.items.length; index++) {
                                if (cart.items[index].patientDetails.length < cart.items[index].quantity) {
                                    setShowPatientPopup({ cartIndex: index, patientIndex: cart.items[index].patientDetails.length });
                                    return;
                                }
                            }

                        if (!verify()) return;
                        if (!selectedAddress) {
                            toast.warning('Please select a valid address');
                            return;
                        }
                        orderItems.current = {
                            items: cart.items.map(item => ({
                                product: {
                                    test: item.product.test._id,
                                    lab: item.product.lab._id
                                },
                                quantity: item.quantity,
                            })),
                            address: selectedAddress
                        };
                        setShowScheduleOrderTimesModel(true);
                    }}>Order All</button>
                </div>
            </> : <div className='flex justify-center items-center h-screen'>Cart is Empty</div>}
            {(showPatientPopup?.cartIndex != null) &&
                <PatientDetailsPopup
                    patients={patientDetails}
                    patientDetails={cart.items[showPatientPopup?.cartIndex || 0].patientDetails[showPatientPopup.patientIndex]}
                    onClose={() => setShowPatientPopup(null)}
                    onSave={async values => {
                        cart.items[showPatientPopup?.cartIndex || 0].patientDetails[showPatientPopup.patientIndex] = values;
                        updateCart({
                            product: {
                                test: cart.items[showPatientPopup?.cartIndex || 0].product.test._id,
                                lab: cart.items[showPatientPopup?.cartIndex || 0].product.lab._id
                            },
                            patientDetails: cart.items[showPatientPopup?.cartIndex || 0].patientDetails,
                            quantity: cart.items[showPatientPopup?.cartIndex || 0].quantity
                        }, () => {
                            fetchCart()
                            // setCart({ ...cart });
                        });
                        setShowPatientPopup(null);
                    }}
                    onRemove={() => {
                        cart.items[showPatientPopup?.cartIndex || 0].patientDetails.splice(showPatientPopup.patientIndex, 1);
                        updateCart({
                            product: {
                                test: cart.items[showPatientPopup?.cartIndex || 0].product.test._id,
                                lab: cart.items[showPatientPopup?.cartIndex || 0].product.lab._id
                            },
                            patientDetails: cart.items[showPatientPopup?.cartIndex || 0].patientDetails,
                            quantity: cart.items[showPatientPopup?.cartIndex || 0].quantity
                        }, () => {
                            fetchCart()
                            // setCart({ ...cart });
                        });
                        setShowPatientPopup(null);
                    }} />}
            {showScheduleOrderTimesModel && <OrderTimeSelector
                excludeTimes={allocatedTimes}
                onClose={() => setShowScheduleOrderTimesModel(false)}
                onChange={async (dateTime) => {
                    if (!verify()) return;
                    if (dateTime === null || dateTime.start === null || dateTime.end === null) {
                        toast.warning('Please select sample taken date and time');
                        setShowScheduleOrderTimesModel(true);
                        return false;
                    }
                    if (dateTime.start > dateTime.end) {
                        toast.warning('Sample taken start time should be before end time');
                        return false;
                    }
                    if (orderItems.current === null) {
                        toast.error('Unable to place the order currently')
                        return;
                    }
                    const orderDetails = {
                        ...orderItems.current,
                        sampleTakenDateTime: dateTime,
                    }
                    await order(orderDetails);
                }}
            />}
            {showConfirmPopup && <ConfirmationModel
                msg={
                    <div className='px-6 pt-6'>
                        Are you sure you want to order only this test?<br />
                        <div className='font-semibold'>{showConfirmPopup.item.product.test.name}</div>
                        from <span className='text-gray-500'>{showConfirmPopup.item.product.lab.name}</span>
                    </div>
                }
                onDecline={() => setShowConfirmPopup(null)}
                onApprove={async () => {
                    // verify patient details
                    if (isPatientDetailsRequired)
                        if (showConfirmPopup.item.patientDetails.length < showConfirmPopup.item.quantity) {
                            setShowPatientPopup({ cartIndex: showConfirmPopup.index, patientIndex: showConfirmPopup.item.patientDetails.length });
                            return;
                        }

                    if (!verify()) return;
                    if (!selectedAddress) {
                        toast.warning('Please select a valid address');
                        return;
                    }
                    orderItems.current = {
                        items: [{
                            product: {
                                test: showConfirmPopup.item.product.test._id,
                                lab: showConfirmPopup.item.product.lab._id
                            },
                            quantity: showConfirmPopup.item.quantity,
                        }],
                        address: selectedAddress
                    }
                    setShowScheduleOrderTimesModel(true);
                }} />}
        </div>
    );
};

type Address = {
    pin: string;
    city: string;
    district: string;
    other?: string;
    phone: string;
}

type TempOrderDetails = {
    items: {
        product: {
            test: string,
            lab: string
        },
        quantity: number
    }[],
    address: Address,
    sampleTakenDateTime?: {
        start: Date,
        end: Date
    },
    reportDeliverTime?: {
        start: Date,
        end: Date
    }
}

type OrderDetails = {
    items: {
        product: {
            test: string,
            lab: string
        },
        quantity: number
    }[],
    address: Address,
    sampleTakenDateTime: {
        start: Date,
        end: Date
    },
    reportDeliverTime?: {
        start: Date,
        end: Date
    }
}