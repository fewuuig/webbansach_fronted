import React, { useEffect, useState } from "react";
import "./SachpropCss.css";
import BookModel from "../../../model/BookModel";
import HinhAnhModel from "../../../model/HinhAnhModel";
import { layToanBoAnh } from "../../../api/HinhAnhApi";
import { Link, NavLink } from "react-router-dom";
import starRating from "../../utils/Rating";
import dinhDangSo from "../../utils/DinhDangSo";
import { error } from "node:console";
import { Check } from "react-bootstrap-icons";


interface SachProps {
    sach: BookModel;
}
const SachProps: React.FC<SachProps> = (props) => {
    const maSach: number = props.sach.maSach;
    const [danhSachHinhAnh, setDanhSachHinhAnh] = useState<HinhAnhModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);
    const [hienSoLuong, setHienSoLuong] = useState<boolean>(false)
    const [soLuong, setSoLuong] = useState<number>(1);
    const [wishLove, setWishLove] = useState(false);
    const toiDa =  props.sach.soLuong ;
    useEffect(() => {
        layToanBoAnh(maSach).then(
            hinhAnhData => {
                setDanhSachHinhAnh(hinhAnhData);
                setDangTaiDuLieu(false)
            }
        ).catch(
            error => {
                setDangTaiDuLieu(false)
                setBaoLoi(error.message);
            }
        );
    }, [] // chi gọi một lần 
    )
    const check = async () => {
        const accessToken = localStorage.getItem("accessToken");
        const respone = await fetch(`http://localhost:8080/wish-love/check?maSach=${props.sach.maSach}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        if (respone.ok) {
            const data = await respone.json();
            setWishLove(data);
        }
    }
    useEffect(() => {
        check();
    }, []);
    const handleAddToCart = async () => {
        const accessToken = localStorage.getItem("accessToken");
        await fetch("http://localhost:8080/cart/add-to-cart", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(
                {
                    maSach: props.sach.maSach,
                    soLuong: soLuong

                }
            )

        }).then(
            (respone) => {
                if (respone.ok) {
                    alert("đã thêm sách vào giỏ hàng của bạn");
                }
            }
        ).then((error) => {
            console.log(error);

        })
    }
    const handleAddToWishLove = async () => {
        const accessToken = localStorage.getItem("accessToken");
        console.log(accessToken);
        await fetch('http://localhost:8080/wish-love/add-to-wish-love', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`

            },
            body: JSON.stringify(
                { maSach: props.sach.maSach }
            )
        }).then((respone)=>{
            if(respone.ok){
                setWishLove(!wishLove) ; 
            }
        })
        
        .then(error => {
            console.log(error);
        })
    }
    if (dangTaiDuLieu) {
        return (
            <div><h1>dang tai du lieu</h1></div>
        );
    }
    if (baoLoi) {
        return (
            <div><h1>gap loi</h1></div>
        );
    }

   return (
  <div className="col-md-3 mt-3">
    <div className="card book-card h-100 shadow-sm">

      {/* IMAGE */}
      <NavLink to={`/sach/${props.sach.maSach}`} className="book-img-wrapper">
        {danhSachHinhAnh[0]?.duLieuAnh && (
          <img
            src={danhSachHinhAnh[0].duLieuAnh}
            alt={props.sach.moTa}
            className="card-img-top book-img"
          />
        )}
      </NavLink>

      {/* BODY */}
      <div className="card-body d-flex flex-column">
        <div className="mb-1">
          {starRating(props.sach.trungBinhXepHang || 0)}
        </div>

        <NavLink
          to={`/sach/${props.sach.maSach}`}
          className="book-title"
        >
          {props.sach.tenSach}
        </NavLink>

        {/* PRICE */}
        <div className="price-box mt-2">
          <del className="text-muted small">
            {dinhDangSo(props.sach.giaNiemYet)}đ
          </del>
          <div className="text-danger fw-bold fs-5">
            {dinhDangSo(props.sach.giaBan)}đ
          </div>
        </div>

        {/* ACTION */}
        <div className="mt-auto d-flex gap-2">
          <button
            className={`btn btn-outline-danger flex-fill ${
              wishLove ? "active" : ""
            }`}
            onClick={handleAddToWishLove}
          >
            <i className="fas fa-heart"></i>
          </button>

          <button
            className="btn btn-danger flex-fill"
            onClick={() => setHienSoLuong(!hienSoLuong)}
          >
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>

        {/* QUANTITY */}
        {hienSoLuong && (
          <div className="quantity-box mt-2 d-flex align-items-center justify-content-between">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setSoLuong(Math.max(1, soLuong - 1))}
            >
              −
            </button>

            <span className="fw-bold">{soLuong}</span>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setSoLuong(Math.min(toiDa , soLuong + 1))}
            >
              +
            </button>

            <button
              className="btn btn-success btn-sm"
              onClick={handleAddToCart}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
export default SachProps; 