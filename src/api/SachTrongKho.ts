import { authFetch } from "./authFetch";

interface ViewCart {
    maGioHangSach: number,
    maSach: number,
    soLuong: number,
    tenSach: string,
    giaBan: number,
    tongGia: number
}
export async function viewCart(): Promise<ViewCart[]> {
    const ketQua: ViewCart[] = [];
    const accessToken = localStorage.getItem("accessToken");
    const respone = await authFetch('http://localhost:8080/cart/view-cart',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )
    if (respone.ok) {
        const responeData =await respone.json();
        for (const item of responeData) {
            ketQua.push({
                maGioHangSach:item.maGioHangSach,
                maSach : item.maSach , 
                soLuong : item.soLuong,
                tenSach : item.tenSach,
                giaBan : item.giaBan,
                tongGia : item.tongGia
            }) ; 
        }
    }else {
        throw new Error("API k call đc sách trong kho về ") ; 
    }
    return ketQua ; 
}
export async function layDanhSachSanPhamDatHang(danhSachSanPhamChon : number[]): Promise<ViewCart[]> {
    const ketQua: ViewCart[] = [];
    const accessToken = localStorage.getItem("accessToken");
    const respone = await authFetch(`http://localhost:8080/cart/sach-dat-tu-gio-hang?danhSachSanPhamDatHangTuGio=${danhSachSanPhamChon.join(",")}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )
    if (respone.ok) {
        const responeData =await respone.json();
        for (const item of responeData) {
            ketQua.push({
                maGioHangSach:item.maGioHangSach,
                maSach : item.maSach , 
                soLuong : item.soLuong,
                tenSach : item.tenSach,
                giaBan : item.giaBan,
                tongGia : item.tongGia
            }) ; 
        }
    }else {
        throw new Error("API k call đc sách trong kho về ") ; 
    }
    return ketQua ; 
}