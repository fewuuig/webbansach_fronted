import React, { useEffect, useState } from "react";
import statModel from "../../../model/StatModel";
import { connectWebSocket } from "../../../ws/connectWebSocket";
import "./StatToday.css" ; 
import { getStatToday } from "../../../api/statsApi";
import { error } from "console";
interface stat {
    orders: number,
    books: number,
    revenue: number,
}
const StatToday: React.FC = () => {
    const [statToday, setStatToday] = useState<stat | null>(null);
    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        connectWebSocket(token, () => { }, setStatToday)
    }, []);
    useEffect(()=>{
        getStatToday().then(
            data =>{
                setStatToday(data) ; 
            }
        ).catch(error=>{
            console.log(error) ; 
        })
    })
 return (
        <div className="dashboard">

            <h2 className="dashboard-title">📊 Thống kê hôm nay</h2>

            <div className="stat-container">

                <div className="stat-card orders">
                    <div className="stat-icon">🧾</div>
                    <div className="stat-info">
                        <p className="stat-label">Đơn bán</p>
                        <p className="stat-value">
                            {statToday?.orders ?? 0}
                        </p>
                    </div>
                </div>

                <div className="stat-card books">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <p className="stat-label">Sách bán</p>
                        <p className="stat-value">
                            {statToday?.books ?? 0}
                        </p>
                    </div>
                </div>

                <div className="stat-card revenue">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <p className="stat-label">Doanh thu</p>
                        <p className="stat-value">
                            {(statToday?.revenue ?? 0).toLocaleString()} đ
                        </p>
                    </div>
                </div>

            </div>

        </div>
    );
}
export default StatToday;