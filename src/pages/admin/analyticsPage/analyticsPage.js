import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { API_BASE } from "../../../config/config";
import CountUp from "react-countup";
import { Statistic } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Spin, Table, Tag } from "antd";

let costcenterVsManpower = [];
export default function AnalyticsPage() {
    const chartSetting = {
        xAxis: [
            {
                label: "rainfall (mm)",
            },
        ],
        width: 500,
        height: 400,
    };
    const dataset = [
        {
            london: 59,
            paris: 57,
            newYork: 86,
            seoul: 21,
            month: "Jan",
        },
        {
            london: 50,
            paris: 52,
            newYork: 78,
            seoul: 28,
            month: "Fev",
        },
        {
            london: 47,
            paris: 53,
            newYork: 106,
            seoul: 41,
            month: "Mar",
        },
        {
            london: 54,
            paris: 56,
            newYork: 92,
            seoul: 73,
            month: "Apr",
        },
        {
            london: 57,
            paris: 69,
            newYork: 92,
            seoul: 99,
            month: "May",
        },
        {
            london: 60,
            paris: 63,
            newYork: 103,
            seoul: 144,
            month: "June",
        },
        {
            london: 59,
            paris: 60,
            newYork: 105,
            seoul: 319,
            month: "July",
        },
        {
            london: 65,
            paris: 60,
            newYork: 106,
            seoul: 249,
            month: "Aug",
        },
        {
            london: 51,
            paris: 51,
            newYork: 95,
            seoul: 131,
            month: "Sept",
        },
        {
            london: 60,
            paris: 65,
            newYork: 97,
            seoul: 55,
            month: "Oct",
        },
        {
            london: 67,
            paris: 64,
            newYork: 76,
            seoul: 48,
            month: "Nov",
        },
        {
            london: 61,
            paris: 70,
            newYork: 103,
            seoul: 25,
            month: "Dec",
        },
    ];
    const formatter = (value) => <CountUp end={value} separator="," />;

    const [isLoading, setIsLoading] = useState(true);
    const [analytics, setAnalytics] = useState({});
    async function getAnalytics() {
        let response = await axios.get(`${API_BASE}/Analytics`);
        console.log(response.data);
        setAnalytics(response.data);
        costcenterVsManpower = [];
        for (var i of response.data["costcenterVsManpower"]) {
            costcenterVsManpower.push({
                id: i["costCenterId"],
                value: i["totalManPower"],
                label: i["costCenterId"].toString(),
            });
        }
        console.log(costcenterVsManpower);

        if (response.status === 200 || response.status === 201) {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //   const valueFormatter = (value: number | null) => `${value}mm`;
    return (
        <div className="p-10">
            <div className="font-semibold text-lg pb-10"> Analytics </div>

            {isLoading === true ? (
                <div>
                    <Spin
                        indicator={
                            <LoadingOutlined
                                style={{
                                    fontSize: 25,
                                }}
                                spin
                            />
                        }
                    />
                </div>
            ) : (
                <div>
                    {/* CARDS */}
                    <div className="flex justify-evenly pb-14">
                        <Statistic
                            title="Approved Users"
                            value={analytics["approvedUsers"]}
                            formatter={formatter}
                            className="border border-zinc-300 text-center px-14 py-5 shadow-lg hover:shadow-xl rounded-xl"
                        />
                        <Statistic
                            title="Man Power"
                            value={analytics["manPower"]}
                            precision={2}
                            formatter={formatter}
                            className="border border-zinc-300 text-center px-14 py-5 shadow-lg hover:shadow-xl rounded-xl"
                        />
                        <Statistic
                            title="Cost Centers"
                            value={analytics["costCenter"]}
                            precision={2}
                            formatter={formatter}
                            className="border border-zinc-300 text-center px-14 py-5 shadow-lg hover:shadow-xl rounded-xl"
                        />
                        <Statistic
                            title="Locations"
                            value={analytics["locations"]}
                            precision={2}
                            formatter={formatter}
                            className="border border-zinc-300 text-center px-14 py-5 shadow-lg hover:shadow-xl rounded-xl"
                        />
                        <Statistic
                            title="Service Type"
                            value={analytics["serviceType"]}
                            precision={2}
                            formatter={formatter}
                            className="border border-zinc-300 text-center px-14 py-5 shadow-lg hover:shadow-xl rounded-xl"
                        />
                    </div>

                    {/* DATA VIZ */}
                    <div className="grid grid-cols-2 gap-2 justify-left">
                        <div className="flex flex-col justify-center pb-10 w-fit pl-20">
                            <div className="text-center pb-5 text-base">
                                Location vs Requests
                            </div>
                            <LineChart
                                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                                series={[
                                    {
                                        data: [2, 5.5, 2, 8.5, 1.5, 5],
                                    },
                                ]}
                                width={500}
                                height={300}
                                // colors={["yellow"]}
                            />
                        </div>

                        <div className="flex flex-col justify-center pb-10 w-fit">
                            <div className="text-center pb-5 text-base">
                                Cost Center vs Man Power
                            </div>
                            <PieChart
                                series={[
                                    {
                                        data: costcenterVsManpower,

                                        // [
                                        //     {
                                        //         id: 0,
                                        //         value: 10,
                                        //         label: "series A",
                                        //     },
                                        //     {
                                        //         id: 1,
                                        //         value: 15,
                                        //         label: "series B",
                                        //     },
                                        //     {
                                        //         id: 2,
                                        //         value: 20,
                                        //         label: "series C",
                                        //     },
                                        // ],
                                    },
                                ]}
                                width={400}
                                height={200}
                            />
                        </div>
                        <div className="flex flex-col justify-center pb-10 w-fit pl-20">
                            <div className="text-center pb-5 text-base">
                                Location vs Requests
                            </div>
                            <BarChart
                                dataset={dataset}
                                yAxis={[
                                    { scaleType: "band", dataKey: "month" },
                                ]}
                                series={[
                                    {
                                        dataKey: "seoul",
                                        label: "Seoul rainfall",
                                    },
                                ]}
                                layout="horizontal"
                                grid={{ vertical: true }}
                                {...chartSetting}
                                // colors={["navy"]}
                            />
                        </div>
                        <div className="flex flex-col justify-center pb-10 w-fit">
                            <div className="text-center pb-5 text-base">
                                Location vs Requests
                            </div>
                            <BarChart
                                xAxis={[
                                    {
                                        scaleType: "band",
                                        data: ["group A", "group B", "group C"],
                                    },
                                ]}
                                series={[
                                    { data: [4, 3, 5] },
                                    { data: [1, 6, 3] },
                                    { data: [2, 5, 6] },
                                ]}
                                width={500}
                                height={300}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}