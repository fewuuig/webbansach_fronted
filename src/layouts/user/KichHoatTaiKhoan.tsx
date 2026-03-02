import { METHODS } from "http";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const KichHoatTaiKhoan: React.FC = () => {
    const [daKichHoat, setDaKichHoat] = useState<boolean>(false);
    const [thongBao, setThongBao] = useState<string>("");
    const {email , "ma-kich-hoat" : maKichHoat } = useParams() ;
    useEffect(() => {

        if (email && maKichHoat) {
            kichHoat(email, maKichHoat)
        }
    }, [email , maKichHoat]);
    const kichHoat = async (email: string, maKichHoat: string) => {
        console.log(email, maKichHoat);
        try {
            const url = `http://localhost:8080/tai-khoan/kich-hoat?email=${email}&ma-kich-hoat=${maKichHoat}`;
            const respone = await fetch(url, { method: "GET" });
            if (respone.ok) {
                setDaKichHoat(true);
                setThongBao("Đăng ký tài khoản thành công");
            } else {
                setThongBao(await respone.text());
            }
        } catch (error) {
            setThongBao(":Đăng ký thất bại");
        }
    }

    return (
        <div>
            <h4>trạng thái</h4>
            {
                daKichHoat ? (<p>đăng ký tài khoản thành công</p>) : (<p>{thongBao}</p>)
            }
        </div>
    );
}
export default KichHoatTaiKhoan; 