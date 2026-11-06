
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Label, Tooltip, Line, LineChart } from "recharts";
import Card from "../ui/Card";

type ReportLineChartProps = {
    title: string;
    data: any[];
    xKey: string;
    yKey: string;
    xLabel: string;
    yLabel?: string;
    spinner: boolean;
};

const Chart_line = ({ title, data, xKey, yKey, xLabel, yLabel, spinner }: ReportLineChartProps) => {

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
                        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 15 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />

                            <XAxis 
                                dataKey={xKey} 
                                tickFormatter={(value) => 
                                    yKey === 'total'
                                        ? (value.length > 5 ? `${value.substring(0, 5)}...` : value)
                                        : 
                                    yKey === 'price'
                                        ? (String(value).length > 2 ? String(value).slice(-2) : value)
                                        : value
                            }>
                                <Label value={xLabel} position="insideBottom" offset={-15}/>
                            </XAxis>

                            <YAxis
                                allowDecimals={false}
                                domain={[
                                    0,
                                    (dataMax: number) => Math.ceil(dataMax * 1.2),
                                ]}
                            >
                                <Label value={yLabel} angle={-90} position="insideLeft" style={{ textAnchor: "middle" }}/>
                            </YAxis>

                            <Tooltip />

                            {/* <Line type="monotone" dataKey={yKey} stroke="#c9a84c" strokeWidth={3} dot={{ fill: "#c9a84c", r: 5 }} activeDot={{ r: 7 }}/> */}
                            <Line type="linear" dataKey={yKey} stroke="#c9a84c" strokeWidth={3} dot={{ fill: "#c9a84c", r: 5 }} activeDot={{ r: 7 }}/>
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )}
        </Card>
    );
};

export default Chart_line;
