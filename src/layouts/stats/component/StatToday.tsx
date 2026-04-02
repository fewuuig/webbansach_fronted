import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Line, Bar } from "react-chartjs-2";
import "./StatToday.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { connectWebSocket } from "../../../ws/connectWebSocket";
import statOnceWeek, { getStatToday } from "../../../api/statsApi";
// Đăng ký các thành phần cho ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);
interface stat {
    orders: number,
    books: number,
    revenue: number,
}
interface statWeek {
    date : string , 
    revenue : number 
}
const StatToday: React.FC = () => {
    const [statToday, setStatToday] = useState<stat | null>(null);
    const [statWeek, setStatWeek] = useState<statWeek[]>([]);
    const[soNgay,setSoNgay] = useState<number>(7) ;
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
    },[])
    useEffect(() => {
        statOnceWeek(soNgay).then((data) => {
            setStatWeek(data);
        }).catch(error => {
            console.log(error);
        });
    }, [soNgay, statToday]);

    // Thống kê doanh số theo tháng (biểu đồ cột)
    const [statYear, setStatYear] = useState<statWeek[]>([]);
    useEffect(() => {
        statOnceWeek(360).then((data) => {
            setStatYear(data);
        }).catch(error => {
            console.log(error);
        });
    }, [statToday]);

    // Xử lý dữ liệu doanh số theo tháng
    // Tạo object { 'yyyy/MM': tổng doanh thu }
    const monthMap: { [month: string]: number } = {};
    statYear.forEach(item => {
        const [year, month] = item.date.split("/");
        const key = `${month}/${year}`; // MM/yyyy
        monthMap[key] = (monthMap[key] || 0) + item.revenue;
    });
    // Sắp xếp theo thời gian tăng dần
    const sortedMonths = Object.keys(monthMap).sort((a, b) => {
        const [ma, ya] = a.split("/");
        const [mb, yb] = b.split("/");
        return new Date(`${ya}-${ma}-01`).getTime() - new Date(`${yb}-${mb}-01`).getTime();
    });
    const barLabels = sortedMonths;
    const barData = sortedMonths.map(m => monthMap[m]);
    const barChartData = {
        labels: barLabels,
        datasets: [
            {
                label: "Doanh số theo tháng (VNĐ)",
                data: barData,
                backgroundColor: "#4fc3f7",
                borderRadius: 6,
                barPercentage: 0.5, // Thu nhỏ cột
                categoryPercentage: 0.5,
            },
        ],
    };
    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Thống kê doanh số theo tháng" },
        },
        scales: {
            x: { title: { display: true, text: "Tháng" } },
            y: { title: { display: true, text: "Doanh số (VNĐ)" }, beginAtZero: true },
        },
    };
    // Chuẩn bị dữ liệu cho biểu đồ doanh số 7 ngày qua
    // date là string định dạng yyyy/MM/dd
    const weekLabels = statWeek.map((item) => {
        // Tách yyyy/MM/dd thành dd/MM
        const [year, month, day] = item.date.split("/");
        return `${day}/${month}`;
        // Nếu muốn đầy đủ năm: return `${day}/${month}/${year}`;
    });
    const weekRevenue = statWeek.map((item) => item.revenue);

    const data = {
        labels: weekLabels,
        datasets: [
            {
                label: "Doanh số (VNĐ)",
                data: weekRevenue,
                fill: false,
                borderColor: "#3498db",
                backgroundColor: "#3498db",
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Biểu đồ doanh số",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: `${soNgay} ngày qua`,
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Doanh số (VNĐ)",
                },
                beginAtZero: true,
            },
        },
    };

    // Tóm tắt sự thay đổi doanh số
    let summary = "";
    let diff = 0;
    let trendComment = "";
    if (statWeek.length >= 2) {
        // Chú ý: statWeek[0] là ngày gần nhất, statWeek[statWeek.length - 1] là ngày xa nhất
        const newest = statWeek[0].revenue;
        const oldest = statWeek[statWeek.length - 1].revenue;
        diff = newest - oldest;
        const percent = oldest !== 0 ? (diff / oldest) * 100 : 0;
        if (diff > 0) {
            summary = `Doanh số tăng ${diff.toLocaleString()} đ (${percent.toFixed(1)}%) so với ${soNgay} ngày trước.`;
            trendComment = "Xu hướng: Doanh số 7 ngày qua đang tăng trưởng tích cực.";
        } else if (diff < 0) {
            summary = `Doanh số giảm ${Math.abs(diff).toLocaleString()} đ (${Math.abs(percent).toFixed(1)}%) so với ${soNgay} ngày trước.`;
            trendComment = "Xu hướng: Doanh số 7 ngày qua có dấu hiệu giảm, cần chú ý các yếu tố ảnh hưởng.";
        } else {
            summary = `Doanh số không thay đổi so với ${soNgay} ngày trước.`;
            trendComment = "Xu hướng: Doanh số 7 ngày qua ổn định.";
        }
    }

    // Đánh giá tháng cao/thấp nhất
    let monthComment = "";
    if (barLabels.length > 0 && barData.length > 0) {
        const maxVal = Math.max(...barData);
        const minVal = Math.min(...barData);
        const maxIdx = barData.indexOf(maxVal);
        const minIdx = barData.indexOf(minVal);
        monthComment = `
            <div style='display:flex; flex-direction:column; align-items:center; gap:8px;'>
                <span style='color:#219653; font-weight:600; font-size:17px;'>
                    <span style='font-size:20px;'>⬆️</span> Tháng cao nhất: <span style='color:#1565c0;'>${barLabels[maxIdx]}</span> <span style='background:#e3f6e8; color:#219653; border-radius:6px; padding:2px 10px; margin-left:6px; font-weight:700;'>${maxVal.toLocaleString()} đ</span>
                </span>
                <span style='color:#d32f2f; font-weight:600; font-size:17px;'>
                    <span style='font-size:20px;'>⬇️</span> Tháng thấp nhất: <span style='color:#1565c0;'>${barLabels[minIdx]}</span> <span style='background:#fdeaea; color:#d32f2f; border-radius:6px; padding:2px 10px; margin-left:6px; font-weight:700;'>${minVal.toLocaleString()} đ</span>
                </span>
            </div>
        `;
    }
    return (
        <div className="dashboard" style={{ background: "#f4f8fb", minHeight: "100vh", padding: 0 }}>
            <h2 className="dashboard-title" style={{ textAlign: "center", margin: "32px 0 12px 0", fontSize: 32, color: "#2d3a4a", letterSpacing: 1 }}>📊 Thống kê hôm nay</h2>
            {/* Tóm tắt sự thay đổi doanh số */}
            {summary && (
                <div style={{margin: "12px auto 16px auto", padding: 16, background: "#eaf6fd", borderRadius: 12, color: diff > 0 ? '#219653' : diff < 0 ? '#d32f2f' : '#333', fontWeight: 500, maxWidth: 600, fontSize: 18, boxShadow: "0 2px 8px rgba(52,152,219,0.08)"}}>
                    {summary}
                </div>
            )}
            <div className="stat-container fade-in" style={{ display: "flex", justifyContent: "center", gap: 32, margin: "32px 0 24px 0" }}>
                <div className="stat-card orders fade-in" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: 28, minWidth: 180, textAlign: "center" }}>
                    <div className="stat-icon" style={{ fontSize: 36, marginBottom: 8 }}>🧾</div>
                    <div className="stat-info">
                        <p className="stat-label" style={{ color: "#888", fontWeight: 500 }}>Đơn bán</p>
                        <p className="stat-value" style={{ fontSize: 28, color: "#2d3a4a", fontWeight: 700 }}>
                            <CountUp end={statToday?.orders ?? 0} duration={1.2} separator="," />
                        </p>
                    </div>
                </div>
                <div className="stat-card books fade-in" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: 28, minWidth: 180, textAlign: "center" }}>
                    <div className="stat-icon" style={{ fontSize: 36, marginBottom: 8 }}>📚</div>
                    <div className="stat-info">
                        <p className="stat-label" style={{ color: "#888", fontWeight: 500 }}>Sách bán</p>
                        <p className="stat-value" style={{ fontSize: 28, color: "#2d3a4a", fontWeight: 700 }}>
                            <CountUp end={statToday?.books ?? 0} duration={1.2} separator="," />
                        </p>
                    </div>
                </div>
                <div className="stat-card revenue fade-in" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: 28, minWidth: 180, textAlign: "center" }}>
                    <div className="stat-icon" style={{ fontSize: 36, marginBottom: 8 }}>💰</div>
                    <div className="stat-info">
                        <p className="stat-label" style={{ color: "#888", fontWeight: 500 }}>Doanh thu</p>
                        <p className="stat-value" style={{ fontSize: 28, color: "#2d3a4a", fontWeight: 700 }}>
                            <CountUp end={statToday?.revenue ?? 0} duration={1.2} separator="," /> đ
                        </p>
                    </div>
                </div>
            </div>
            {/* Nút chọn số ngày thống kê */}
            <div style={{ margin: "24px auto 8px auto", display: "flex", gap: 12, justifyContent: "center" }}>
                {[7, 15, 30].map((n) => (
                    <button
                        key={n}
                        onClick={() => setSoNgay(n)}
                        style={{
                            padding: "8px 22px",
                            borderRadius: 8,
                            border: n === soNgay ? "2px solid #3498db" : "1px solid #ccc",
                            background: n === soNgay ? "#eaf6fd" : "#fff",
                            color: n === soNgay ? "#3498db" : "#333",
                            fontWeight: n === soNgay ? 700 : 400,
                            cursor: "pointer",
                            fontSize: 16,
                            boxShadow: n === soNgay ? "0 2px 8px rgba(52,152,219,0.08)" : "none"
                        }}
                    >
                        {n} ngày
                    </button>
                ))}
            </div>
            {/* Hai biểu đồ cạnh nhau */}
            <div style={{ display: "flex", gap: 32, marginTop: 32, justifyContent: "center", alignItems: "flex-start" }} className="fade-in">
                <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 16px rgba(52,152,219,0.10)", width: "50%", minWidth: 320, maxWidth: 600, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Line data={data} options={options} />
                    {/* Đánh giá xu hướng doanh số 7 ngày qua */}
                    {trendComment && (
                        <div style={{ marginTop: 18, background: "#f6fafd", borderRadius: 8, padding: 12, color: diff > 0 ? '#219653' : diff < 0 ? '#d32f2f' : '#333', fontWeight: 500, width: "100%", textAlign: "center", fontSize: 16, boxShadow: "0 1px 4px rgba(52,152,219,0.06)" }}>
                            {trendComment}
                        </div>
                    )}
                </div>
                <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 16px rgba(52,152,219,0.10)", width: "50%", minWidth: 320, maxWidth: 600, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Bar data={barChartData} options={barOptions} />
                    {/* Đánh giá tháng cao/thấp nhất */}
                    {monthComment && (
                        <div style={{ marginTop: 18, background: "#f6fafd", borderRadius: 8, padding: 12, color: "#2d3a4a", fontWeight: 500, width: "100%", textAlign: "center", fontSize: 16, boxShadow: "0 1px 4px rgba(52,152,219,0.06)" }}
                            dangerouslySetInnerHTML={{ __html: monthComment }} />
                    )}
                </div>
            </div>
        </div>
    );
}
export default StatToday;