interface diaChiGiaoHang {
    maDiaChi: number,
    tinhOrCity: string,
    quanOrHuyen: string,
    phuongOrXa: string,
    soNha: string
}
export async function layDiaChiGiaoHangCuaNguoiDung(): Promise<diaChiGiaoHang[]> {
    const accessToken = localStorage.getItem("accessToken");
    const ketQua: diaChiGiaoHang[] = [];
    const respone = await fetch('http://localhost:8080/dia-chi/dia-chi-giao-hang', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }

    });
    if (!respone.ok) {
        throw new Error("Lấy địa chỉ giao hàng không thành công");
    } else {
        const responeData = await respone.json();
        for (const i of responeData) {
            ketQua.push({
                maDiaChi: i.maDiaChi,
                tinhOrCity: i.tinhOrCity,
                quanOrHuyen: i.quanOrHuyen,
                phuongOrXa: i.phuongOrXa,
                soNha: i.soNha
            });
        }
    }
    return ketQua;
}