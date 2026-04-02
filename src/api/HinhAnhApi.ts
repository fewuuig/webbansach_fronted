import React from "react";
import { request } from "./Request";
import BookModel from "../model/HinhAnhModel";
import HinhAnhModel from "../model/HinhAnhModel";
async function layAnhCuaMotSach(params:string):Promise<HinhAnhModel[]>{
    const ketQua: HinhAnhModel[] = [];

    // gọi phương thức request
   const respone = await fetch(params , {
        method : 'GET' ,
   }) ;

    // lấy ra json sách
    const responeData = await respone.json(); // kiểm tra xem nó cóa phải là một mảng không , nếuk hông thì nó sẽ báo lỗi ngay lập tức hoặc gây lỗi , cách này giúp an toàn  

    for (const key in responeData) {
        ketQua.push({
            maHinhAnh :responeData[key].maHinhAnh ,
            tenHinhAnh : responeData[key].tenHinhAnh ,
            icon : responeData[key].icon ,
            link : responeData[key].link ,
            duLieuAnh :  responeData[key].duLieuAnh ,
        });
    }

    return ketQua;
}

// lấy toàn bộ ảnh của một quyển sách 
export async function layToanBoAnh(maSach: number , soLuong : number): Promise<HinhAnhModel[]> {
    // xác định endpoint 
    const duongDan: string = `http://localhost:8080/image/book/${maSach}/${soLuong}`;

    return layAnhCuaMotSach(duongDan) ; 
 
}
export async function layAnhDauTienCuaMotQuyenSach(maSach : number, soLuong : number): Promise<HinhAnhModel[]> {
    const duongDan: string = `http://localhost:8080/image/book/${maSach}/${soLuong}`;
    return layAnhCuaMotSach(duongDan) ; 
}