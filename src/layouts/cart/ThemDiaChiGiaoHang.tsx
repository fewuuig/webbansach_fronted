import React, { FormEvent, useState } from "react";
import "./ThemDiaChi.css" ;
const ThemDiaChiGiaoHang: React.FC = () => {
    const [quanOrHuyen, setQuanOrHuyen] = useState("");
    const [phuongOrXa, setPhuongOrXa] = useState("");
    const [soNha, setSoNha] = useState("");
    const [tinhOrCity, setTinhOrCity] = useState("");
    const handleThemDiaChi = async (e: FormEvent) => {
        e.preventDefault();
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
        <div className="address-container">
            <div className="address-card">

                <h4 className="address-title">Thêm địa chỉ giao hàng</h4>

                <form onSubmit={handleThemDiaChi} className="address-form">

                    <div className="form-group">
                        <label>Tỉnh / Thành phố</label>
                        <input
                            type="text"
                            value={tinhOrCity}
                            required
                            onChange={e => setTinhOrCity(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Quận / Huyện</label>
                        <input
                            type="text"
                            value={quanOrHuyen}
                            required
                            onChange={e => setQuanOrHuyen(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phường / Xã</label>
                        <input
                            type="text"
                            value={phuongOrXa}
                            required
                            onChange={e => setPhuongOrXa(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Số nhà</label>
                        <input
                            type="text"
                            value={soNha}
                            required
                            onChange={e => setSoNha(e.target.value)}
                        />
                    </div>

                    <button className="btn-submit">
                        + Thêm địa chỉ
                    </button>

                </form>
            </div>
        </div>
    );
}
export default ThemDiaChiGiaoHang; 