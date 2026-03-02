import React, { FormEvent, useState } from "react";
const ThemDiaChiGiaoHang: React.FC = () => {
    const [quanOrHuyen, setQuanOrHuyen] = useState("");
        const [phuongOrXa, setPhuongOrXa] = useState("");
        const [soNha, setSoNha] = useState("");
        const [tinhOrCity , setTinhOrCity] = useState("") ; 
    const handleThemDiaChi =async  (e: FormEvent) => {
        e.preventDefault() ; 
        const accessToken = localStorage.getItem("accessToken");
        await fetch('http://localhost:8080/dia-chi/them-dia-chi-giao-hang', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(
                {
                    tinhOrCity: tinhOrCity,
                    quanOrHuyen: quanOrHuyen,
                    phuongOrXa: phuongOrXa,
                    soNha: soNha
                }
            )
        })

    }
    return (
        <div className="container">
            <form action="" onSubmit={handleThemDiaChi}>
                <div>
                    <label htmlFor="tinhOrCity">Tỉnh/T.Phố</label>
                    <input type="text" id="tinhOrCity" value={tinhOrCity} required onChange={e=>(setTinhOrCity( e.target.value))} />
                </div>
                 <div>
                    <label htmlFor="quanOrHuyen">Quận/Huyện</label>
                    <input type="text" id="quanOrHuyen" value={quanOrHuyen} required onChange={e=>(setQuanOrHuyen( e.target.value))} />
                </div>
                <div>
                    <label htmlFor="phuongOrXa">Phường/xã</label>
                    <input type="text" id="phuongOrXa" value={phuongOrXa} required onChange={e=>(setPhuongOrXa( e.target.value))} />
                </div>
                 <div>
                    <label htmlFor="soNha">Số nhà</label>
                    <input type="text" id="soNha" value={soNha} required onChange={e=>(setSoNha( e.target.value))} />

                </div>
                <button className="btn btn-success">Thêm</button>
            </form>
        </div>
    );
}
export default ThemDiaChiGiaoHang ; 