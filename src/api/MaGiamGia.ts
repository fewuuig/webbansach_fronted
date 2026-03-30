export interface MaGiamGiaCuaUserResponeDTO {
    maGiamNguoiDung: number;
    maGiam: number;
    daDung: number;
    tenMaGiamGia: string;
    soMaDaDung: number;
    soLuong: number;
    ngayHetHan: string;
    ngayBatDau: string;
    loaiMaGiamGia: string;
    giamToiDa: number;
    donGiaTu: number;
    trangThaiMaGiamGia: string;
    doiTuongApDungMa: string;
}

export interface MaGiamGiaUserResponeDTO {
    maNguoiDung: number;
    maGiamGiaCuaUserResponeDTOS: MaGiamGiaCuaUserResponeDTO[];
}

// API lấy voucher user
export async function layVoucherCuaUser(): Promise<MaGiamGiaUserResponeDTO > {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch("http://localhost:8080/vouchers/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error("Lỗi API:", response.status);
            throw new Error("Lỗi khi lấy voucher")
        }

        const data: MaGiamGiaUserResponeDTO = await response.json();

        return data;

    } catch (error) {
        console.error("Lỗi fetch voucher:", error);
        throw new Error("Lỗi khi lấy voucher") ;
    }

}
export async function layTatCaVoucher(): Promise<MaGiamGiaCuaUserResponeDTO[]> {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch("http://localhost:8080/vouchers/all", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error("Lỗi API:", response.status);
            throw new Error("Lỗi khi lấy danh sách voucher");
        }

        const data: MaGiamGiaCuaUserResponeDTO[] = await response.json();

        return data;

    } catch (error) {
        console.error("Lỗi fetch tất cả voucher:", error);
        throw new Error("Lỗi khi lấy danh sách voucher");
    }
}