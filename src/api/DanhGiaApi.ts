import React from "react";
import { request } from "./Request";
import DanhGiaModel from "../model/DanhGiaModel";
async function layDanhGia(param: string): Promise<DanhGiaModel[]> {
    const ketQua: DanhGiaModel[] = [];
    const accessToken = localStorage.getItem("accessToken");
    const respone = await fetch(param, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    if (respone.ok) {
        const responeData = await respone.json();
        for (const dg of responeData) {
            ketQua.push({
                maDanhGia: dg.maDanhGia,
                nhanXet: dg.nhanXet,
                diemXepHang: dg.diemXepHang,
                anhDaiDien: dg.anhDaiDien,
            });
        }

    }

    return ketQua;
}
export async function layToanBoDanhGiaCuaMotQuyenSach(maSach: number): Promise<DanhGiaModel[]> {
    const duongDan: string = `http://localhost:8080/danh-gia/${maSach}/danhSachDanhGia`;

    return layDanhGia(duongDan);


}