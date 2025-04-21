import React, { FC } from "react";
import s from "./StatisticsBlock.module.scss"
import { classNames } from "../../../../../../shared/lib/classNames/classNames";
import { numberWithSpaces } from "../../../../../../utils/numberWithSpaces";
import { ReactComponent as PositiveArrow } from "./assets/arrow_positive.svg"
import { ReactComponent as NegativeIcon } from "./assets/arrow_negative.svg"

interface StatisticsBlockProps {
    name: string;
    data: string | number;
    percent?: number;
    type?: "number" | "money" | "percents";
}

export const StatisticsBlock: FC<StatisticsBlockProps> = ({name, data, percent = 0, type="number"}) => {
  
  return(
    <div className={classNames(s.statistics_block, {}, [])}>
      <div className={s.top_row}>
        <p className={s.name}>{name}</p>
        {
          (percent != 0) && 
            <div className={s.percent_wrapper}>
              {percent > 0 ? <PositiveArrow /> : <NegativeIcon />}
              <p className={classNames(s.percent, {[s.low]: percent < 0})}>
                {Math.abs(percent)}%
              </p>
            </div>
        }
      </div>
      <div className={s.data_wrapper}>
        { data !== undefined &&
          (
            type === "money" ?
            <p className={s.data}>{numberWithSpaces(data)} <span>₽</span></p>
            : 
            type === "percents" ?
            <p className={s.data}>{data}<span>%</span></p>
            :
            <p className={s.data}>{data}</p>
          )
        }
      </div>
    </div>
 )
}
