interface stat {
    orders: number,
    books: number,
    revenue: number,
}
interface statWeek {
    date : string , 
    revenue : number 
}
export async function getStatToday(): Promise<stat> {
    const accessToken = localStorage.getItem("accessToken");
    const respone = await fetch('http://localhost:8080/stats/stat-today',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )
    if (respone.ok) {
        const data = await respone.json();
        return ({ orders: data.orders, books: data.books, revenue: data.revenue })
    } else {
        throw new Error("API k call đc doanh số hôm nay ");
    }
}
export default async function statOnceWeek(soNgay : number): Promise<statWeek[]> {
    const kq: statWeek[] = [];
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:8080/stats/once-week/${soNgay}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if (response.ok) {
        const data = await response.json();
        for (const item of data) {
            kq.push({ date: item.date, revenue: item.revenue });
        }
        return kq;
    } else {
        throw new Error("API k call đc doanh số tuần");
    }
}