export interface iMainReport {
    chart_data: Array<iMainReportChartData> | undefined;
}   

export interface iMainReportChartData {
    date: string;
    count: number;
    total: number;
}
  