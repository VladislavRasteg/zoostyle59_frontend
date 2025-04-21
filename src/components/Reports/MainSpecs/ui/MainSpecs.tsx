import React from "react";
import s from "./MainSpecs.module.scss"
import { StatisticsBlock } from "./StatisticsBlock/ui/StatisticsBlock";

interface MainSpecsProps {
    data: any; 
}

export const MainSpecs = ({data}:MainSpecsProps) => {
  
  return(
    <div className={s.main_specs_row}>
      <StatisticsBlock name="Записи" data={data?.appointments_count} percent={data?.periods_appointments_count_diff} />
      <StatisticsBlock name="Выручка" data={data?.revenue} percent={data?.periods_revenue_diff} type="money" />
      <StatisticsBlock name="Новые клиенты" data={data?.new_clients} percent={data?.periods_new_clients_diff} />
      <StatisticsBlock name="Запись через виджет" data={data?.widget_appointments_percent | 0} percent={data?.periods_widget_appointments_percent_diff0} type="percents" />
    </div>
 )
}
