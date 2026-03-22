interface stat {
    orders: number,
    books: number,
    revenue: number,
}
export async function getStatToday(): Promise<stat> {
    const accessToken = localStorage.getItem("accessToken");
    const respone = await fetch('http://localhost:8080/stats/statToday',
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