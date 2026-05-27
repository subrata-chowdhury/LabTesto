// app/admin/components/dashboard-charts/MonthlyPriceBarChart.tsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function MonthlyPriceBarChart({
  financeData,
}: {
  financeData?: { date: Date | string; totalPrice: number; expenses: number }[];
}) {
  return (
    <div className="bg-white dark:bg-[#111] p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-white/[0.02] w-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-500/20">
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
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary dark:text-white leading-tight">
            Financial Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Price vs Expenses ({new Date().getFullYear()})
          </p>
        </div>
      </div>

      {/* Changed flex-1 and min-h to a strict explicit height to fix the blank Recharts issue */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={financeData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                if (!date) return "";
                const d = new Date(date);
                return isNaN(d.getTime())
                  ? ""
                  : d.toLocaleString("default", { month: "short" });
              }}
              tick={{ fontSize: 12, fill: "currentColor", opacity: 0.7 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "currentColor", opacity: 0.7 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                `₹${value >= 1000 ? (value / 1000).toFixed(0) + "k" : value}`
              }
            />
            <Tooltip
              cursor={{ fill: "rgba(156, 163, 175, 0.1)" }}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(17, 17, 17, 0.9)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              formatter={(value, name) => {
                const numericValue =
                  typeof value === "number" ? value : Number(value);
                return [`₹${numericValue.toLocaleString()}`, String(name)];
              }}
              labelFormatter={(label) => {
                if (!label) return "";
                const d = new Date(String(label));
                return isNaN(d.getTime()) ? String(label) : d.toDateString();
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 13, paddingTop: "20px" }}
            />
            <CartesianGrid
              vertical={false}
              stroke="currentColor"
              strokeOpacity={0.05}
            />
            <Bar
              dataKey="totalPrice"
              name="Total Revenue"
              fill="#3b82f6"
              barSize={12}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#f97316"
              barSize={12}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
