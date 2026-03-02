interface HinhThucGiaoHang{
      maHinhThucGiaoHang : number, 
      moTa : string , 
      tenHinhThucGiaoHang : string
}
export async function layTatCaHinhThucGiaoHang(): Promise<HinhThucGiaoHang[]> {
    const accessToken = localStorage.getItem("accessToken");
    console.log("có  : " + accessToken) ; 
    const ketQua: HinhThucGiaoHang[] = [];
    const respone = await fetch('http://localhost:8080/giao-hang/hinh-thuc-giao-hang', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }

    });
    if (!respone.ok) {
        throw new Error("Lấy hình thức vận chuyển không thành công");
    } else {
        const responeData = await respone.json();
        for (const i of responeData) {
            ketQua.push({
                maHinhThucGiaoHang: i.maHinhThucGiaoHang,
                moTa: i.moTa,
                tenHinhThucGiaoHang: i.tenHinhThucGiaoHang
            });
        }
    }
    return ketQua;
}