// app/admin/components/dashboard-charts/DonutChart.tsx
import { Cell, Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f97316"];

const DonutChart = ({ data }: { data: { name: string; value: number }[] }) => {
  const totalUsers = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col mb-auto bg-white dark:bg-[#111] p-6 lg:p-8 border border-gray-100 dark:border-white/5 rounded-3xl shadow-lg shadow-black/5 dark:shadow-white/2 justify-center items-center h-full w-full">
      <div className="w-full flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500 border border-green-100 dark:border-green-500/20">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary dark:text-white leading-tight">
            User Demographics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Distribution across roles
          </p>
        </div>
      </div>

      <div className="relative flex justify-center items-center w-full h-55">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-2xl font-bold text-center text-primary dark:text-white z-0 flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-widest mb-1">
            Total
          </span>
          {totalUsers.toLocaleString()}
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                backgroundColor: "rgba(17, 17, 17, 0.9)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              itemStyle={{ color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full mb-auto grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
        {data.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 py-2 px-1 rounded-xl"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {entry.name}
              </span>
            </div>
            <span className="text-sm font-bold text-primary dark:text-white">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
