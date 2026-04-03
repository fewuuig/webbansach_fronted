import React, { useEffect, useState } from "react";
import { layToanBoAnh } from "../../../api/HinhAnhApi";
import SachProps from "../../product/components/SachProps";
import { lay3SachMoiNhat } from "../../../api/BookApi";
import BookModel from "../../../model/BookModel";
import { error } from "console";
import CarousellItem from "./CarousellItem";
import "./Carousel.css";

const Carousell: React.FC = () => {
  const [danhSachSanPham, setDanhSachSanPham] = useState<BookModel[]>([]);
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
  const [baoLoi, setBaoLoi] = useState(null)
  useEffect(() => {
    lay3SachMoiNhat().then(
      sachData => {
        setDanhSachSanPham(sachData);
        setDangTaiDuLieu(false);
      }
    ).catch(
      (error) => {
        setBaoLoi(error.message);
        setDangTaiDuLieu(true);
      }
    )
  },[]);
  console.log(danhSachSanPham);
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
    <div className="container">
      <div className="carousel-wrapper"> 
        <div id="carouselExampleDark" className="carousel slide carousel-fade">
          
          <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="5000">
              <CarousellItem key={0} sach={danhSachSanPham[0]} />
            </div>
            <div className="carousel-item " data-bs-interval="5000">
              <CarousellItem key={1} sach={danhSachSanPham[1]} />
            </div>
            <div className="carousel-item " data-bs-interval="5000">
              <CarousellItem key={2} sach={danhSachSanPham[2]} />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Carousell;