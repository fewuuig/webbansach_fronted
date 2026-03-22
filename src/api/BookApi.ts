import React from "react";
import BookModel from "../model/BookModel";
import { promises } from "dns";
import { request } from "./Request";
import DanhSachSanPham from "../layouts/product/DanhSachSanPham";
import { error } from "console";
import { json } from "stream/consumers";
interface SachTraVe {
    ketQua: BookModel[];
    soSachTrenMotTrang: number;
    tongTrang: number;

}
export async function laySachVer2(param: string): Promise<SachTraVe> {
    const ketQua: BookModel[] = [];
    const accessToken = localStorage.getItem("accessToken");
    const respone = await fetch(param, {
        method: 'GET',
        headers: {
           
        }

    });
    if (!respone.ok) {
        throw new Error("Lỗi trong quá trình lấy sách từ DB lên đẻt phân trang");
    }
    const data = await respone.json();

    const dataBook = data.content;
    const soSachTrenMotTrang = data.size;
    const tongTrang = data.totalPages;
    for (const i of dataBook) {
        ketQua.push({
            maSach: i.maSach,
            tenSach: i.tenSach,
            giaBan: i.giaBan,
            giaNiemYet: i.giaNiemYet,
            moTa: i.moTa,
            soLuong: i.soLuong,
            tenTacGia: i.tenTacGia,
            trungBinhXepHang: i.trungBinhXepHang,

        })
    }

    return { ketQua, soSachTrenMotTrang, tongTrang };
}
async function laySach(params: string): Promise<SachTraVe> {
    const ketQua: BookModel[] = [];
    const respone = await request(params);

    // lấy ra json sách
    const responeData = respone._embedded.saches; // kiểm tra xem nó cóa phải là một mảng không , nếuk hông thì nó sẽ báo lỗi ngay lập tức hoặc gây lỗi , cách này giúp an toàn  
    const soSachTrenMotTrang: number = respone.page.size;
    const tongTrang: number = respone.page.totalPages;
    for (const key in responeData) {
        ketQua.push({
            maSach: responeData[key].maSach,
            tenSach: responeData[key].tenSach,
            giaBan: responeData[key].giaBan,
            giaNiemYet: responeData[key].giaNiemYet,
            moTa: responeData[key].moTa,
            soLuong: responeData[key].soLuong,
            tenTacGia: responeData[key].tenTacGia,
            trungBinhXepHang: responeData[key].trungBinhXepHang,
        });
    }


    return { ketQua: ketQua, tongTrang: tongTrang, soSachTrenMotTrang: soSachTrenMotTrang };
}

export async function layToanBoSach(trangHienTai: number): Promise<SachTraVe> {


    // xác định endpoint 
    const duongDan: string = `http://localhost:8080/books/page-size?page=${trangHienTai}&size=8`;

    return laySachVer2(duongDan);
}
export async function lay3SachMoiNhat(): Promise<SachTraVe> {


    // xác định endpoint 
    const duongDan: string = 'http://localhost:8080/sach?sort=maSach,desc&page=0&size=3';

    return laySach(duongDan);
}
export async function timKiemSachTheoTen(tuKhoaTimKiem: String, trangHienTai: number, maTheLoai: number): Promise<SachTraVe> {
    let duongDan: string = `http://localhost:8080/sach?sort=maSach,desc&page=0&size=5`;
    if (tuKhoaTimKiem !== '' && maTheLoai == 0) {
        duongDan = `http://localhost:8080/sach/search/findByTenSachContaining?tenSach=${tuKhoaTimKiem}&page=${trangHienTai}&size=8&sort=desc`;
        return laySach(duongDan) ; 

    } else if (tuKhoaTimKiem === '' && maTheLoai > 0) {
        duongDan = `http://localhost:8080/books/category-page-size?maTheLoai=${maTheLoai}&page=${trangHienTai}&size=8`;
    } else if (tuKhoaTimKiem !== '' && maTheLoai > 0) {
        duongDan = `http://localhost:8080/sach/search/findByTenSachContainingAndDanhSachTheLoai_MaTheLoai?tenSach=${tuKhoaTimKiem}&maTheLoai=${maTheLoai}&page=${trangHienTai}&size=8&sort=maSach,desc`;
    }
    return laySachVer2(duongDan);

}

export async function layChiTietMotQuyenSach(maSach: number): Promise<BookModel | null> {
    const duongDan = `http://localhost:8080/books/${maSach}`;
    try {
        const respone = await fetch(duongDan);
        if (!respone.ok) {
            throw new Error("gặp lỗi khi lấy d liệu");
        }

        const sachData = await respone.json();
        if (sachData) {
            return {
                maSach: sachData.maSach,
                tenSach: sachData.tenSach,
                giaBan: sachData.giaBan,
                giaNiemYet: sachData.giaNiemYet,
                moTa: sachData.moTa,
                soLuong: sachData.soLuong,
                tenTacGia: sachData.tenTacGia,
                trungBinhXepHang: sachData.trungBinhXepHang,
            }
        } else {
            throw new Error("sách không tồn tại");
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}