import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

export default function MonthlyPriceBarChart({ financeData }: { financeData?: { date: Date, totalPrice: number, expenses: number }[] }) {
    return (
        <div className='mt-5 bg-white dark:bg-black p-5 px-6 pr-10 rounded-lg border-2 border-gray-300/50 dark:border-white/20 w-fit'>
            <div className='text-lg font-semibold mb-3'>Total Price vs Expenses of {new Date().getFullYear()} (monthly)</div>
            <div className="w-full overflow-x-auto">
                <BarChart width={730} height={250} data={financeData}>
                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleString('default', { month: 'short' })} tick={{ fontSize: 12, fill: 'black' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} label={{ value: 'Amounts (₹)', angle: -90, position: 'insideLeft', fontSize: 14, dy: 50, fill: 'black' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} formatter={(value, name) => [value, name]} labelFormatter={(label) => new Date(label).toDateString()} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 14 }} />
                    <CartesianGrid vertical={false} />
                    <Bar dataKey="totalPrice" name="Total Price" fill="#1A73E8" barSize={10} radius={[10, 10, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#FF8042" barSize={10} radius={[10, 10, 0, 0]} />
                </BarChart>
            </div>
        </div>
    )
}