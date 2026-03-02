interface HinhThucThanhToan {
    maHinhThucThanhToan : number , 
    moTa : string , 
    tenHinhThucThanhToan : string 
}
export async function layTatCaHinhThucThanhToan(): Promise<HinhThucThanhToan[]> {
    const accessToken = localStorage.getItem("accessToken");
    console.log("có  : " + accessToken) ; 
    const ketQua: HinhThucThanhToan[] = [];
    const respone = await fetch('http://localhost:8080/thanh-toan/lay-hinh-thuc-thanh-toan', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }

    });
    if (!respone.ok) {
        throw new Error("Lấy hình thức thanh toán không thành công");
    } else {
        const responeData = await respone.json();
        for (const i of responeData) {
            ketQua.push({
                maHinhThucThanhToan: i.maHinhThucThanhToan,
                moTa: i.moTa,
                tenHinhThucThanhToan: i.tenHinhThucThanhToan
            });
        }
    }
    return ketQua;
}