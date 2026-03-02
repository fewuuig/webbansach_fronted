import React from "react";
import { request } from "./Request";
import BookModel from "../model/HinhAnhModel";
import HinhAnhModel from "../model/HinhAnhModel";
async function layAnhCuaMotSach(params:string):Promise<HinhAnhModel[]>{
    const ketQua: HinhAnhModel[] = [];

    // gọi phương thức request
    const respone = await request(params);

    // lấy ra json sách
    const responeData = respone._embedded.hinhAnhs; // kiểm tra xem nó cóa phải là một mảng không , nếuk hông thì nó sẽ báo lỗi ngay lập tức hoặc gây lỗi , cách này giúp an toàn  

    for (const key in responeData) {
        ketQua.push({
            maHinhAnh :responeData[key].maHinhAnh ,
            tenHinhAnh : responeData[key].tenHinhAnh ,
            laIcon : responeData[key].laIcon ,
            duongDan : responeData[key].duongDan ,
            duLieuAnh :  responeData[key].duLieuAnh ,
        });
    }


    return ketQua;
}

// lấy toàn bộ ảnh của một quyển sách 
export async function layToanBoAnh(maSach: number): Promise<HinhAnhModel[]> {
    // xác định endpoint 
    const duongDan: string = `http://localhost:8080/sach/${maSach}/danhSachHinhAnh`;

    return layAnhCuaMotSach(duongDan) ; 
 
}
export async function layAnhDauTienCuaMotQuyenSach(maSach : number): Promise<HinhAnhModel[]> {
    const duongDan: string = `http://localhost:8080/sach/${maSach}/danhSachHinhAnh?sort=maHinhAnh,asc&page=0size=1`;
    return layAnhCuaMotSach(duongDan) ; 
}