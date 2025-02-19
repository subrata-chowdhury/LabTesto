'use client'
import React, { useEffect, useState } from 'react';
import fetcher from '@/lib/fetcher';
// import Input from '@/components/Inputs/Input';
// import Model from '@/components/Model';
import Link from 'next/link';
import PatientDetailsPopup, { PatientDetails } from '../components/popups/PatientDetailsPopup';
import { useRouter } from 'next/navigation';
import Plus from '@/assets/reactIcon/Plus';
import Minus from '@/assets/reactIcon/Minus';
import { toast } from 'react-toastify';
import { User } from '../profile/page';
import Model from '@/components/Model';
import CheckBox from '@/components/Inputs/CheckBox';

type CartItem = {
    product: {
        test: { name: string, _id: string };
        lab: { name: string, _id: string, location: { address: string } };
        price: number;
    };
    patientDetails: PatientDetails[];
    quantity: number;
};

type Cart = {
    items: CartItem[];
    user: string;
    createdAt: Date;
    updatedAt: Date;
};

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPatientPopup, setShowPatientPopup] = useState<{ cartIndex: number, patientIndex: number } | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<{
        pin: number;
        city: string;
        district: string;
        other?: string;
        phone: string;
    }>({
        pin: 0,
        city: '',
        district: '',
        other: '',
        phone: ''
    })
    const navigate = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    async function fetchCart() {
        try {
            const response = await fetcher.get<Cart>('/cart');
            if (response.status !== 200) {
                throw new Error('Failed to fetch cart');
            }
            if (response.body) {
                setCart(response.body); // Assuming you want the first cart
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
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
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

    async function order(products: { product: { test: string, lab: string }, quantity: number }[]) {
        const res = await fetcher.post<{ product: { test: string, lab: string }, quantity: number }[], { message: string }>(`/orders`, products);
        if (res.status === 200) {
            // await fetcher.delete('/cart');
            // fetchCart();
            toast.success('Your orders has been placed')
            navigate.push('/order');
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    if (!cart) {
        return <div className="flex justify-center items-center h-screen">No items in the cart</div>;
    }

    return (
        <div className="flex-1 flex flex-col p-4 bg-gray-100 min-h-screen">
            <Locations selectedAddress={selectedAddress} onChange={address => setSelectedAddress(address)} />
            {(cart && cart.items?.length > 0) ? <>
                <h1 className="text-2xl font-bold mb-4">Cart Items</h1>
                <ul className="space-y-4 flex-1 max-h-[70vh] overflow-y-scroll pb-5">
                    {cart.items.map((item, index) => (
                        <li key={index} className="bg-white rounded shadow-md flex flex-col">
                            <div className='p-4 flex justify-between items-center'>
                                <div className='flex flex-col gap-4 justify-between h-full'>
                                    <Link href={'/tests/' + item.product.test._id}>
                                        <div className="text-2xl font-semibold">{item.product.test.name}</div>
                                        <div className='text-sm'>{item.product.lab.name}, {item.product.lab.location.address}</div>
                                    </Link>
                                    <div className='mt-auto font-medium text-xl'>₹{(item.product.price || 0) * item.quantity}</div>
                                </div>
                                <div className='flex flex-col gap-2 text-sm'>
                                    <div className='flex gap-2 justify-center items-center'>
                                        <button className='text-lg py-1 px-1 rounded-md cursor-pointer hover:bg-gray-100 border-2' disabled={item.quantity <= 1} onClick={async () => await changeQuantity(item.product.test._id, item.product.lab._id, item.quantity - 1)}>
                                            <Minus size={18} fill='black' />
                                        </button>
                                        <input type='text' min={1} value={item.quantity} className='w-12 text-center' onChange={async (e) => {
                                            let number = Number(e.target.value.trim());
                                            if (number < 1) number = 1;
                                            if (number > 50) number = 50;
                                            await changeQuantity(item.product.test._id, item.product.lab._id, number);
                                        }} />
                                        <button className='text-lg py-1 px-1 rounded-md cursor-pointer hover:bg-gray-100 border-2' onClick={async () => await changeQuantity(item.product.test._id, item.product.lab._id, item.quantity + 1)}>
                                            <Plus size={18} fill='black' />
                                        </button>
                                    </div>
                                    <button
                                        className="border-orange-500 border-2 text-orange-500 px-2 py-1 rounded"
                                        onClick={async () => {
                                            const res = await fetcher.delete<{ test: string, lab: string }, { message: string } | string>("/cart", {
                                                test: item.product.test._id,
                                                lab: item.product.lab._id
                                            })
                                            if (res.status === 200) fetchCart()
                                        }}>Remove</button>
                                    <button
                                        className="bg-orange-500 text-white px-2 py-1 rounded"
                                        onClick={async () => {
                                            // verify patient details
                                            if (item.patientDetails.length < item.quantity) {
                                                setShowPatientPopup({ cartIndex: index, patientIndex: item.patientDetails.length });
                                                return;
                                            }

                                            await order([{
                                                product: {
                                                    test: item.product.test._id,
                                                    lab: item.product.lab._id
                                                },
                                                quantity: item.quantity
                                            }])
                                        }}>Order</button>
                                </div>
                            </div>
                            <div className='bg-orange-50 p-1 text-xs'>
                                {
                                    Array(item.quantity).fill(0).map((_, i) => (
                                        <div
                                            key={i}
                                            className='bg-orange-200 px-3 py-1 rounded-full cursor-pointer inline-flex m-1'
                                            onClick={() =>
                                                setShowPatientPopup({ cartIndex: index, patientIndex: i })}>
                                            {cart.items[index]?.patientDetails[i]?.name?.split(' ').map(e => e.charAt(0)).join('') || 'Add +'}
                                        </div>
                                    ))
                                }
                            </div>
                        </li>
                    ))}
                </ul>
                <div className='p-4 flex justify-between items-center bg-white'>
                    <div>Total: <div className="text-2xl font-semibold">₹{cart.items.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0).toFixed(2)}</div> <div className='text-gray-500'>+ ₹0 Delivery Charges</div></div>
                    <button className="bg-orange-500 text-white px-5 py-2 rounded-sm" onClick={async () => {
                        // verification
                        if (cart?.items?.length <= 0) toast.warning("Cart is empty");

                        for (let index = 0; index < cart.items.length; index++) {
                            if (cart.items[index].patientDetails.length < cart.items[index].quantity) {
                                setShowPatientPopup({ cartIndex: index, patientIndex: cart.items[index].patientDetails.length });
                                return;
                            }
                        }

                        await order(cart.items.map(item => ({
                            product: {
                                test: item.product.test._id,
                                lab: item.product.lab._id
                            },
                            quantity: item.quantity
                        })))
                    }}>Order All</button>
                </div>
            </> : <div className='flex justify-center items-center h-screen'>Cart is Empty</div>}
            {(showPatientPopup?.cartIndex != null) &&
                <PatientDetailsPopup
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
                            setCart({ ...cart });
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
                            setCart({ ...cart });
                        });
                        setShowPatientPopup(null);
                    }} />}
        </div>
    );
};

export default CartPage;

function Locations({ selectedAddress, onChange }: { selectedAddress: Address, onChange: (address: Address) => void }) {
    const [user, setUser] = useState<User>({
        name: '',
        email: '',
        password: '',
        verified: false,
        patientDetails: [],
        address: [],
        createdAt: new Date(),
        updatedAt: new Date()
    })
    const [showAddressesPopup, setShowAddressesPopup] = useState(false)

    useEffect(() => {
        fetchUser();
    }, [])

    async function fetchUser() {
        const res = await fetcher.get<User>('/user');
        if (res.status === 200 && res.body) {
            setUser(res.body);
            onChange(res.body.address[0])
        }
    }

    return (
        <>
            <div className='w-full flex justify-between items-center py-3 px-4 bg-white rounded shadow mb-5'>
                <div>
                    <div className='font-medium'><span className='font-normal'>Deliver to:</span> {selectedAddress.city}, {selectedAddress.pin}</div>
                    <div className='text-sm text-gray-600'>{selectedAddress.other} | {selectedAddress.phone}</div>
                </div>
                <div>
                    <div className='px-3 py-1 rounded cursor-pointer text-orange-500 font-medium border-2 border-orange-500' onClick={() => setShowAddressesPopup(true)}>Change</div>
                </div>
            </div>
            {showAddressesPopup && <Model heading='Addresses' onClose={() => setShowAddressesPopup(false)}>
                <div className='px-7 py-4 pt-6 min-w-80'>
                    <div className='grid grid-cols-1 gap-2 sm:gap-4 text-sm pb-4'>
                        {user.address.map((address, index) => (
                            <div key={index} className='bg-white p-3 flex gap-3 rounded-md border-2 border-gray-200 cursor-pointer' onClick={() => { onChange(address); setShowAddressesPopup(false) }}>
                                <CheckBox value={(address.pin === selectedAddress.pin && address.city === selectedAddress.city && address.district === selectedAddress.district && address.other === selectedAddress.other && address.phone === selectedAddress.phone)} onChange={() => { }} />
                                <div>
                                    <div className='font-medium'>{address.city}, {address.pin}</div>
                                    <div className='text-sm text-gray-600'>{address.other} | {address.phone}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Model>}
        </>
    )
}

type Address = {
    pin: number;
    city: string;
    district: string;
    other?: string;
    phone: string;
}