import { Cell, Pie, PieChart, Tooltip } from "recharts";

const COLORS = ["#00C49F", "dodgerblue", "#FF8042"];

const DonutChart = ({ data }: { data: { name: string, value: number }[] }) => {
    return (
        <div className="flex flex-col mt-5 p-4 px-6 pt-3 bg-white border-2 rounded-lg justify-center items-center">
            <div className='text-lg font-semibold w-full mb-2 pb-2.5 border-b-2'>Users</div>
            <div className='relative flex justify-center items-center'>
                <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-2xl font-semibold text-center'>
                    <span className='text-sm text-gray-500 font-normal'>Total Users</span><br /> {data.reduce((acc, curr) => acc + curr.value, 0)}
                </div>
                <PieChart width={180} height={170}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        startAngle={0}
                        endAngle={360}
                        innerRadius={55}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        cornerRadius={5}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                </PieChart>
            </div>
            <div className='border-t-2 text-sm w-full grid grid-cols-2 gap-2 mt-2 pt-3'>
                {data.map((entry, index) => (
                    <div key={`cell-${index}`} className='flex items-center gap-2'>
                        <div className='w-3.5 h-3.5 rounded-full' style={{ backgroundColor: COLORS[index] }}></div>
                        <span style={{ color: COLORS[index] }}>{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonutChart;