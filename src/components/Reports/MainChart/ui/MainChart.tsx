import { FC, useContext, useEffect, useState } from "react"
import { Context } from "../../../.."
import { getMainReport } from "../../../../http/reportsAPI"
import { AreaChart , Area, CartesianGrid, XAxis, Legend, YAxis, Tooltip, ResponsiveContainer,  } from 'recharts';
import { iMainReport } from "../types";
import s from "./MainChart.module.scss"
import { classNames } from "../../../../shared/lib/classNames/classNames";

export const MainChart: FC<iMainReport> = ({chart_data}) => {
    return(
        <div className={s.mainChartContainer}>
            <div className={s.chart_legend}>
                <div className={s.chart_legend_element}>
                    <div className={classNames(s.chart_legend_line, {}, [s.first])}></div>
                    Записи
                </div>
                <div className={s.chart_legend_element}>
                    <div className={classNames(s.chart_legend_line, {}, [s.second])}></div>
                    Выручка
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart  data={chart_data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="20%" stopColor="var(--chart_color_primary)" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="var(--chart_color_primary)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="20%" stopColor="var(--chart_color_secondary)" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="var(--chart_color_secondary)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>

                    <CartesianGrid stroke="var(--border_secondary)"  strokeWidth={0.8} />
                    <XAxis height={25} dataKey="date" tickMargin={5} tick={{ fill: 'var(--chart_secondary_color)' }} tickLine={{ stroke: 'none' }} axisLine={{stroke: 'none'}} />
                    <YAxis width={30} yAxisId="left" tick={{ fill: 'var(--chart_secondary_color)' }} tickLine={{ stroke: 'none' }} axisLine={{stroke: 'none'}} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--chart_secondary_color)' }} tickLine={{ stroke: 'none' }} axisLine={{stroke: 'none'}} />
                    {
                        chart_data?.length &&
                        <Area animationEasing="ease-in-out" yAxisId="left" type="monotone" dataKey="count" stroke="var(--chart_color_primary)" strokeOpacity={0.8} strokeWidth={1.2} fillOpacity={1} fill="url(#colorUv)"  />
                    }
                    {
                        chart_data?.length &&
                        <Area animationEasing="ease-in-out" yAxisId="right" type="monotone" dataKey="total" stroke="var(--chart_color_secondary)" strokeOpacity={0.8} strokeWidth={1.2} fillOpacity={1} fill="url(#colorPv)" />
                    }
                    
                    <Tooltip />
                </AreaChart >
            </ResponsiveContainer>
        </div>
    )
}