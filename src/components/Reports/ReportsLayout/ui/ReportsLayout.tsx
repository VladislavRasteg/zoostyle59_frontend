import { useContext, useEffect, useState } from "react"
import { Context } from "../../../.."
import { getMainReport } from "../../../../http/reportsAPI"
import { iReportsLayout } from "../types";
import s from "./ReportsLayout.module.scss"
import { MainChart } from "../../MainChart";
import { MainSpecs } from "../../MainSpecs/ui/MainSpecs";
import { DatePicker } from "@arco-design/web-react";
import { Form } from "react-bootstrap";
import moment from "moment";


export const ReportsLayout = () => {
    
    const {user} = useContext(Context);

    const [reportsData, setReportsData] = useState<iReportsLayout>()

    const [startDate, setStartDate] = useState<string>(moment().subtract(1, 'months').format("YYYY-MM-DD"))
    const [endDate, setEndDate] = useState<string>(moment().format("YYYY-MM-DD"))

    useEffect(() => {
        if(moment(endDate, "YYYY-MM-DD") > moment(startDate, "YYYY-MM-DD")){
            getMainReport(user.currentBranch?.id, startDate, endDate)
            .then((data) => {
                setReportsData(data?.data)
            })
        }
    }, [startDate, endDate])

    return(
        <div className={s.reports_layout}>
            <div className={s.report_header}>
                <p className={s.report_name}>Основные показатели</p>
                <div className={s.report_period}>
                        <div className={s.input_wrapper}>
                            <p className={s.input_title}>с</p>
                            <Form.Control placeholder={'Укажите дату'} style={{
                                height: 42,
                                background: "#EDF3FC",
                                color: "#435875",
                                border: "1px solid #D1D6E1",
                                borderRadius: 8
                            }} value={startDate} onChange={(event) => setStartDate(event.target.value)} type={'date'}/>

                        </div>
                        <div className={s.input_wrapper}>
                            <p className={s.input_title}>по</p>
                            <Form.Control placeholder={'Укажите дату'} style={{
                                height: 42,
                                background: "#EDF3FC",
                                color: "#435875",
                                border: "1px solid #D1D6E1",
                                borderRadius: 8
                            }} value={endDate} onChange={(event) => setEndDate(event.target.value)} type={'date'}/>
                        </div>
                </div>
            </div>
            <MainSpecs data={reportsData?.specs_data}/>
            <MainChart chart_data={reportsData?.chart_data} />
        </div>
    )
}