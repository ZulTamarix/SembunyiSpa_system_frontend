
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import Card from "../ui/Card";

type ReportPieChartProps = {
    title: string;
    data: any[];
    xKey: string;
    yKey: string;
    spinner: boolean;
};

const COLORS = [
    "#c9a84c",
    "#7a6455",
    "#a88b72",
    "#d4c5a9",
    "#8c9b83",
    "#b7a0c9",
    "#e6a57e",
];

const Chart_pie = ({ title, data, xKey, yKey, spinner }: ReportPieChartProps) => {

    return (
        <Card>
            {spinner ? (
                <div className="w-full h-75 flex flex-col items-center justify-center gap-3 bg-white">
                    <div className="w-8 h-8 border-4 border-border border-t-secondary rounded-full animate-spin" />
                    <p className="text-sm text-title">Loading chart...</p>
                </div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold text-secondary mb-4">
                        {title}
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey={yKey}
                                nameKey={xKey}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                paddingAngle={2}
                                label={({ percent }) =>
                                    `${((percent ?? 0) * 100).toFixed(0)}%`
                                }
                                
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={entry.id ?? index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </>
            )}
        </Card>
    );
};

export default Chart_pie;
