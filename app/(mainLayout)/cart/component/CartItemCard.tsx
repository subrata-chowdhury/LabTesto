import Minus from "@/assets/reactIcon/Minus";
import Plus from "@/assets/reactIcon/Plus";
import fetcher from "@/lib/fetcher";
import Link from "next/link";
import { CartItem } from "./CartPage";

export default function CartItemCard({ item, onQuantityChange, onRemove, onOrder, onPatientClick }: { item: CartItem, onQuantityChange: (quantity: number) => void, onRemove?: () => void, onOrder: () => void, onPatientClick: (index: number) => void }) {
    return (
        <li className="bg-white rounded shadow-md flex flex-col">
            <div className='p-4 flex justify-between items-center'>
                <div className='flex flex-col gap-4 justify-between h-full'>
                    <Link href={'/tests/' + item.product.test._id}>
                        <div className="text-2xl font-semibold">{item.product.test.name}</div>
                        <div className='text-sm'>{item.product.lab.name}, {item.product.lab.location.address.pin}</div>
                    </Link>
                    <div className='mt-auto font-medium text-xl'>₹{(item.product.price || 0) * item.quantity}</div>
                </div>
                <div className='flex flex-col gap-2 text-sm'>
                    <div className='flex gap-2 justify-center items-center'>
                        <button className='text-lg py-1 px-1 rounded-md cursor-pointer hover:bg-gray-100 border-2' disabled={item.quantity <= 1} onClick={async () => await onQuantityChange(item.quantity - 1)}>
                            <Minus size={18} fill='black' />
                        </button>
                        <input type='text' min={1} value={item.quantity} className='w-12 text-center' onChange={async (e) => {
                            let number = Number(e.target.value.trim());
                            if (number < 1) number = 1;
                            if (number > 50) number = 50;
                            await onQuantityChange(number);
                        }} />
                        <button className='text-lg py-1 px-1 rounded-md cursor-pointer hover:bg-gray-100 border-2' onClick={async () => await onQuantityChange(item.quantity + 1)}>
                            <Plus size={18} fill='black' />
                        </button>
                    </div>
                    {onRemove && <button
                        className="border-[#3986ba] border-2 text-[#3986ba] px-2 py-1 rounded"
                        onClick={async () => {
                            const res = await fetcher.delete<{ test: string, lab: string }, { message: string } | string>("/cart", {
                                test: item.product.test._id,
                                lab: item.product.lab._id
                            })
                            if (res.status === 200) onRemove()
                        }}>Remove</button>}
                    <button
                        className="bg-[#3986ba] text-white px-2 py-1 rounded"
                        onClick={async () => {
                            onOrder()
                        }}>Order</button>
                </div>
            </div>
            <div className='bg-[rgba(57,134,186,0.05)] p-1 text-xs'>
                {
                    Array(item.quantity).fill(0).map((_, i) => (
                        <div
                            key={i}
                            className='bg-[rgba(57,134,186,0.2)] px-3 py-1 rounded-full cursor-pointer inline-flex m-1'
                            onClick={() => onPatientClick(i)}>
                            {item?.patientDetails[i]?.name?.split(' ').map(e => e.charAt(0)).join('') || 'Add +'}
                        </div>
                    ))
                }
            </div>
        </li>
    )
}