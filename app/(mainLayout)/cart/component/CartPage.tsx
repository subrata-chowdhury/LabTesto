'use client'
import React, { useEffect, useState } from 'react';
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

export type CartItem = {
    product: {
        test: { name: string, _id: string };
        lab: { name: string, _id: string, location: { address: Address }, prices: { test: string, offer: number }[] };
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
    const [error, setError] = useState<string | null>(null);
    const [showPatientPopup, setShowPatientPopup] = useState<{ cartIndex: number, patientIndex: number } | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>()
    const [showScheduleOrderTimesModel, setShowScheduleOrderTimesModel] = useState(false);
    const [sampleTakenDateTime, setSampleTakenDateTime] = useState<{ start: Date, end: Date } | null>(null);
    const [showConfirmPopup, setShowConfirmPopup] = useState<{ item: CartItem, index: number } | null>(null);
    const [patientDetails, setPatientDetails] = useState<PatientDetails[]>([]);
    const [isPatientDetailsRequired, setIsPatientDetailsRequired] = useState(true);
    const { setItemCount } = useItemCountContext();

    const navigate = useRouter();

    useEffect(() => {
        fetchCart();
        fetchUser();
    }, []);

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
                    const labPrice = item.product.lab.prices.find(price => price.test === item.product.test._id)?.offer;
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

    async function order(orderDetails: { items: { product: { test: string, lab: string }, quantity: number }[], address: Address, sampleTakenDateTime?: { start: Date, end: Date }, reportDeliverTime?: { start: Date, end: Date } }) {
        const res = await fetcher.post<{ items: { product: { test: string, lab: string }, quantity: number }[], address: Address, sampleTakenDateTime?: { start: Date, end: Date }, reportDeliverTime?: { start: Date, end: Date } }, { message: string }>(`/orders`, orderDetails);
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
        }
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
        if (selectedAddress.pin !== '722202') {
            toast.warning('We are currently serving only in Barjora, West Bengal');
            return false;
        }
        if (!sampleTakenDateTime) {
            toast.warning('Please select sample taken date and time');
            setShowScheduleOrderTimesModel(true);
            return false;
        }
        if (sampleTakenDateTime.start > sampleTakenDateTime.end) {
            toast.warning('Sample taken start time should be before end time');
            return false;
        }
        return true;
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Please Reload Your Page Or Click &nbsp;<button onClick={() => window.location.reload()}>Reload</button></div>;
    }

    if (!cart) {
        return <div className="flex justify-center items-center h-screen">No items in the cart</div>;
    }

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

                        await order({
                            items: cart.items.map(item => ({
                                product: {
                                    test: item.product.test._id,
                                    lab: item.product.lab._id
                                },
                                quantity: item.quantity,
                            })),
                            address: selectedAddress as Address,
                            sampleTakenDateTime: sampleTakenDateTime as { start: Date, end: Date }
                        })
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
                onClose={() => setShowScheduleOrderTimesModel(false)}
                onChange={(sampleTakenDateTime) => setSampleTakenDateTime(sampleTakenDateTime)}
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

                    await order({
                        items: [{
                            product: {
                                test: showConfirmPopup.item.product.test._id,
                                lab: showConfirmPopup.item.product.lab._id
                            },
                            quantity: showConfirmPopup.item.quantity,
                        }],
                        address: selectedAddress as Address,
                        sampleTakenDateTime: sampleTakenDateTime as { start: Date, end: Date }
                    })
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