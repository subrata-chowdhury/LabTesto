'use client'
import React, { useEffect, useState } from 'react';
import fetcher from '@/lib/fetcher';
import Dropdown from '@/components/Dropdown';
import Input from '@/components/Inputs/Input';

type CartItem = {
    product: {
        test: { name: string };
        lab: { name: string, location: { address: string } };
        price: number;
    };
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

    useEffect(() => {
        const fetchCart = async () => {
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

        fetchCart();
    }, []);

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
            <h1 className="text-2xl font-bold mb-4">Cart Items</h1>
            <ul className="space-y-4 flex-1 max-h-[70vh] overflow-y-scroll">
                {cart.items.map((item, index) => (
                    <li key={index} className="p-4 bg-white rounded shadow-md flex justify-between items-center">
                        <div className='flex flex-col gap-4 justify-between h-full'>
                            <div>
                                <div className="text-2xl font-semibold">{item.product.test.name}</div>
                                <div className='text-sm'>{item.product.lab.name}, {item.product.lab.location.address}</div>
                            </div>
                            <div className='mt-auto font-medium text-xl'>₹{(item.product.price || 0) * item.quantity}</div>
                        </div>
                        <div className='flex flex-col gap-2 text-sm'>
                            <Input
                                type='number'
                                label='Quantity'
                                value={String(item.quantity)}
                                inputStyle={{ padding: '4px 8px' }}
                                onChange={async (val) => {
                                    setCart({
                                        ...cart,
                                        items: cart.items.map((cartItem, i) => i === index ? { ...cartItem, quantity: Number(val) } : cartItem)
                                    })
                                }} />
                            <button className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                            <button className="bg-blue-500 text-white px-2 py-1 rounded">Order</button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className='p-4 flex bg-white'>
                <button className="bg-blue-500 text-white px-5 py-2 ms-auto rounded-sm">Order All</button>
            </div>
        </div>
    );
};

export default CartPage;