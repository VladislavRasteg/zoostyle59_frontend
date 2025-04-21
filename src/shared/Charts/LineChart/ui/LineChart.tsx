import s from "./LineChart.module.scss"
import { LineChart as RechartsLineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, } from 'recharts';

interface ILineChart {
    chartData: Record<string | number, string | number>[];
    XDataKey: string;
    XThicFormatter: (value: string, index?: number) => string
    LineDataKey: string;
}

export const LineChart = ({ chartData, XDataKey, LineDataKey, XThicFormatter }: ILineChart) => {
    return (
        <div className={s.mainChartContainer}>
            <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="var(--border_secondary)" strokeWidth={0.8} />
                    <XAxis dataKey={XDataKey} tickFormatter={XThicFormatter} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey={LineDataKey} stroke="var(--chart_color_primary)" strokeOpacity={0.8} strokeWidth={1.2} fillOpacity={1} dot={false} />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    )
}