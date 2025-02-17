'use client'
import React, { useEffect, useState } from 'react';
import fetcher from '@/lib/fetcher';
import Input from '@/components/Inputs/Input';
// import Model from '@/components/Model';
import Link from 'next/link';
import PatientDetailsPopup, { PatientDetails } from '../components/popups/PatientDetailsPopup';

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

    async function updateCart(item: { product: { test: string, lab: string }, patientDetails?: PatientDetails[], quantity: number }, onSuccess: () => void) {
        try {
            const response = await fetcher.put<{ product: { test: string, lab: string }, patientDetails?: PatientDetails[], quantity: number }, { message: string }>('/cart', item);
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
            {(cart && cart.items?.length > 0) ? <>
                <h1 className="text-2xl font-bold mb-4">Cart Items</h1>
                <ul className="space-y-4 flex-1 max-h-[70vh] overflow-y-scroll">
                    {cart.items.map((item, index) => (
                        <li key={index} className="bg-white rounded drop-shadow-md flex flex-col">
                            <div className='p-4 flex justify-between items-center'>
                                <div className='flex flex-col gap-4 justify-between h-full'>
                                    <Link href={'/tests/' + item.product.test._id}>
                                        <div className="text-2xl font-semibold">{item.product.test.name}</div>
                                        <div className='text-sm'>{item.product.lab.name}, {item.product.lab.location.address}</div>
                                    </Link>
                                    <div className='mt-auto font-medium text-xl'>₹{(item.product.price || 0) * item.quantity}</div>
                                </div>
                                <div className='flex flex-col gap-2 text-sm'>
                                    <Input
                                        type='number'
                                        label='Quantity'
                                        value={String(item.quantity)}
                                        inputStyle={{ padding: '4px 8px', maxWidth: 150 }}
                                        onChange={async (val) => {
                                            const updatedItem = {
                                                product: {
                                                    test: item.product.test._id,
                                                    lab: item.product.lab._id
                                                },
                                                quantity: Number(val)
                                            };
                                            await updateCart(updatedItem, fetchCart)
                                        }} />
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
                                            const res = await fetcher.post<{ product: { test: string, lab: string }, quantity: number }[], { message: string }>(`/orders`, [{
                                                product: {
                                                    test: item.product.test._id,
                                                    lab: item.product.lab._id
                                                },
                                                quantity: item.quantity
                                            }]);
                                            if (res.status === 200) {
                                                // await fetcher.delete<{ test: string, lab: string }, { message: string } | string>("/cart", {
                                                //     test: item.product.test._id,
                                                //     lab: item.product.lab._id
                                                // });
                                                fetchCart();
                                            }
                                        }}>Order</button>
                                </div>
                            </div>
                            <div className='bg-orange-50 flex gap-2 p-2 text-xs'>
                                {
                                    Array(item.quantity).fill(0).map((_, i) => (
                                        <div
                                            key={i}
                                            className='bg-orange-200 px-3 py-1 rounded-full cursor-pointer'
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
                        const res = await fetcher.post<{ product: { test: string, lab: string }, quantity: number }[], { message: string }>(`/orders`, cart.items.map(item => ({
                            product: {
                                test: item.product.test._id,
                                lab: item.product.lab._id
                            },
                            quantity: item.quantity
                        })));
                        if (res.status === 200) {
                            // await fetcher.delete('/cart');
                            fetchCart();
                        }
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
                    }} />}
        </div>
    );
};

export default CartPage;