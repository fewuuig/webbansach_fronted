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
    const respone = await fetch(param, {
        method: 'GET',
    });
    if (!respone.ok) {
        throw new Error("không có sản phẩm nào");
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
            isbn : i.isbn,
            hinhAnhDTOS: i.hinhAnhDTOS || []

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
            isbn : responeData[key].isbn , 
            hinhAnhDTOS: responeData[key].hinhAnhDTOS || []
        });
    }


    return { ketQua: ketQua, tongTrang: tongTrang, soSachTrenMotTrang: soSachTrenMotTrang };
}
export async function layBookFilter(
    priceFrom: string,
    priceTo: string,
    maTheLoai: string,
    tenTacGia: string,
    page: number,
    size: number = 8
): Promise<SachTraVe> {
    const priceFromNumber = priceFrom ? Number(priceFrom) : null;
    const priceToNumber = priceTo ? Number(priceTo) : null;
    const maTheLoaiNumber = maTheLoai ? Number(maTheLoai) : null;

    // check NaN
    if (priceFromNumber !== null && isNaN(priceFromNumber)) {
        throw new Error("priceFrom không hợp lệ");
    }

    if (priceToNumber !== null && isNaN(priceToNumber)) {
        throw new Error("priceTo không hợp lệ");
    }

    if (maTheLoaiNumber !== null && isNaN(maTheLoaiNumber)) {
        throw new Error("maTheLoai không hợp lệ");
    }


    const params = new URLSearchParams();

    if (priceFromNumber !== null) params.append("priceFrom", priceFromNumber.toString());
    if (priceToNumber !== null) params.append("priceTo", priceToNumber.toString());
    if (maTheLoaiNumber !== null) params.append("ma_the_loai", maTheLoaiNumber.toString());
    if (tenTacGia) params.append("ten_tac_gia", tenTacGia);

    params.append("page", page.toString());
    params.append("size", size.toString());

    const url = `http://localhost:8080/book/search/filter?${params.toString()}`;
    console.log("mã thể loại là : "+ maTheLoai) ; 

    return laySachVer2(url);
}
export async function layToanBoSach(trangHienTai: number): Promise<SachTraVe> {


    const duongDan: string = `http://localhost:8080/books/page-size?page=${trangHienTai}&size=8`;

    return laySachVer2(duongDan);
}
export async function layToanBoSachCategoryNotPage(categoryId: number): Promise<BookModel[]> {
    const accessToken = localStorage.getItem("accessToken");
    const kq: BookModel[] = [];
    const respone = await fetch(`http://localhost:8080/book/category/${categoryId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    if (respone.ok) {
        const responeData = await respone.json();
        for (const key in responeData) {
            kq.push({
                maSach: responeData[key].maSach,
                tenSach: responeData[key].tenSach,
                giaBan: responeData[key].giaBan,
                giaNiemYet: responeData[key].giaNiemYet,
                moTa: responeData[key].moTa,
                soLuong: responeData[key].soLuong,
                tenTacGia: responeData[key].tenTacGia,
                trungBinhXepHang: responeData[key].trungBinhXepHang,
                isbn : responeData[key].isbn,
                hinhAnhDTOS: responeData[key].hinhAnhDTOS || []
            });
        }
    }
    return kq;
}
export async function lay3SachMoiNhat(): Promise<BookModel[]> {
    const response = await fetch('http://localhost:8080/book/book-new-carousel', {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error("Lỗi khi gọi API sách mới");
    }

    const data = await response.json();

    // nếu backend trả về array
    return data.map((item: any) => ({
        maSach: item.maSach,
        tenSach: item.tenSach,
        giaBan: item.giaBan,
        giaNiemYet: item.giaNiemYet,
        moTa: item.moTa,
        soLuong: item.soLuong,
        tenTacGia: item.tenTacGia,
        trungBinhXepHang: item.trungBinhXepHang,
        isbn : item.isbn
    }));
}
export async function timKiemSachTheoTen(tuKhoaTimKiem: String, trangHienTai: number, maTheLoai: number): Promise<SachTraVe> {
    let duongDan: string = `http://localhost:8080/sach?sort=maSach,desc&page=0&size=5`;
    if (tuKhoaTimKiem !== '' && maTheLoai == 0) {
        duongDan = `http://localhost:8080/sach/search/findByTenSachContaining?tenSach=${tuKhoaTimKiem}&page=${trangHienTai}&size=8&sort=desc`;
        return laySach(duongDan);

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
                isbn : sachData.isbn,
                hinhAnhDTOS: sachData.hinhAnhDTOS || []
            }
        } else {
            throw new Error("sách không tồn tại");
        }
    } catch (error) {
        console.error(error);
        return null;
    }

}
export async function layBookDeletde(maTheLoai : number): Promise<BookModel[]> {
    const kq: BookModel[] = [];
    const accessToken = localStorage.getItem("accessToken");
    const respone = await fetch(`http://localhost:8080/book/book-deleted/${maTheLoai}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    if (respone.ok) {
        const responeData = await respone.json();
        for (const key in responeData) {
            kq.push({
                maSach: responeData[key].maSach,
                tenSach: responeData[key].tenSach,
                giaBan: responeData[key].giaBan,
                giaNiemYet: responeData[key].giaNiemYet,
                moTa: responeData[key].moTa,
                soLuong: responeData[key].soLuong,
                tenTacGia: responeData[key].tenTacGia,
                trungBinhXepHang: responeData[key].trungBinhXepHang,
                isbn : responeData[key].isbn ,
                hinhAnhDTOS: responeData[key].hinhAnhDTOS || []
            });
        }
    }
    return kq ; 


}