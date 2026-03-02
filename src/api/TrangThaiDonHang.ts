export enum TrangThaiGiaoHang {
    CHO_XAC_NHAN = "CHO_XAC_NHAN",
    DA_XAC_NHAN = "DA_XAC_NHAN",
    DANG_GIAO = "DANG_GIAO",
    DA_GIAO = "DA_GIAO"
}
interface SachTrongDonDTOS {
    maSach: number,
    soLuong: number,
    giaBan: number,
    tongGia: number,
    tenSach: string
}

interface donHang {
    maDonHang: number,
    chiPhiGiaoHang: number,
    diaChiNhanHang: string,
    trangThai: TrangThaiGiaoHang , 
    sachTrongDonDTOS : SachTrongDonDTOS[] , 
}
export async function layDonHangTheoTrangThai(trangThai: string): Promise<donHang[]> {
    const ketQua: donHang[] = [];
    const accessToken = localStorage.getItem("accessToken")
    const respone = await fetch(`http://localhost:8080/don-hang/trang-thai?trangThai=${trangThai}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }

    })
    if (respone.ok) {
        const responeData = await respone.json();
        for (const i of responeData) {
            ketQua.push({
                maDonHang: i.maDonHang,
                chiPhiGiaoHang: i.chiPhiGiaoHang,
                diaChiNhanHang: i.diaChiNhanHang,
                trangThai: i.trangThai , 
                sachTrongDonDTOS:i.sachTrongDonDTOS

            });
        }
    } else throw new Error("Không lấy đc đơn hàng ở DB lên");
    return ketQua;
}