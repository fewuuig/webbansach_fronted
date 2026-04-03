import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './layouts/header-footer/Navbar';
import Footer from './layouts/header-footer/Footter';
import HomePage from './layouts/homepage/HomePage';
import ChiTietSanPham from './layouts/product/ChiTietSanPham';
import DangKyNguoiDung from './layouts/user/DangKyNguoiDung';
import KichHoatTaiKhoan from './layouts/user/KichHoatTaiKhoan';
import DangNhap from './layouts/user/DangNhap';
import SachForm_Admin from './layouts/admin/SachForm';
import Logout from './layouts/user/Logout';
import Cart from './layouts/cart/Cart';
import DanhSachYeuThich from './layouts/cart/DanhSachYeuThich';
import CheckOut from './layouts/cart/CheckOut';
import ThemDiaChiGiaoHang from './layouts/cart/ThemDiaChiGiaoHang';
import DonHang from './layouts/order/DonHang';
import ChiTietDon from './layouts/cart/component/ChiTietDonHang';
import ChatWS from './ws/ChatWS';
import DanhSachChat from './ws/DanhSachChat';
import StatDashboard from './layouts/stats/StatDashboard';
import CheckUsername from './layouts/user/CheckUsername';
import CheckPassword from './layouts/user/Checkpassword';
import DisableAccount from './layouts/admin/account/DisableAccount';
import UpdateBook from './layouts/admin/book/UpdateBook';
import ThemMaGiamGia from './layouts/admin/voucher/ThemMaGiamGia';
import TrangCaNhan from './layouts/user/TrangCaNhan'; 

function App() {
  const [tuKhoaTimKiem, setTuKhoatimKiem] = useState('');
  
  const [filter, setFilter] = useState({
    giaMin: "",
    giaMax: "",
    theLoai: "",
    tacGia: ""
  });

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar 
          tuKhoaTimKiem={tuKhoaTimKiem} 
          setTuKhoaTimKiem={setTuKhoatimKiem} 
          filter={filter} 
          setFilter={setFilter} 
        />

        <Routes>

          {/* TRANG CHỦ */}
          <Route path='/' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} setTuKhoaTimKiem={setTuKhoatimKiem} filter={filter}/>} />
          <Route path='/:maTheLoai' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} setTuKhoaTimKiem={setTuKhoatimKiem} filter={filter} />} />
          <Route path='/sach/:maSach' element={<ChiTietSanPham />}></Route>



          {/* HỆ THỐNG TÀI KHOẢN */}
          <Route path='/dang-ky' element={<DangKyNguoiDung />} />
          <Route path='/dang-nhap' element={<DangNhap />} />
          <Route path='/account/loggin' element={<CheckUsername />} />
          <Route path='/account/password' element={<CheckPassword />} />
          <Route path='/kich-hoat/:email/:ma-kich-hoat' element={<KichHoatTaiKhoan />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/account/disable' element={<DisableAccount />} />
          <Route path='/user/profile' element={<TrangCaNhan />} />
          <Route path='/user/settings' element={<TrangCaNhan />} />
          <Route path='/user/address' element={<TrangCaNhan />} />
          <Route path='/user/orders' element={<TrangCaNhan />} />
          <Route path='/account/username' element={<TrangCaNhan />} /> 

          {/* GIỎ HÀNG & THANH TOÁN */}
          <Route path='/cart' element={<Cart />} />
          <Route path='/danh-sach-yeu-thich' element={<DanhSachYeuThich />} />
          <Route path='/checkout' element={<CheckOut />} />
          <Route path='/them-dia-chi-giao-hang' element={<ThemDiaChiGiaoHang />} />
          <Route path='/don-hang' element={<DonHang />} />
          <Route path='/checkout/chi-tiet-don' element={<ChiTietDon />} />

          {/* QUẢN TRỊ & THỐNG KÊ */}
          <Route path='/admin/them-sach' element={<SachForm_Admin />} />
          <Route path='/stats' element={<StatDashboard />} />
          <Route path='/book/update' element={<UpdateBook/>} />
          <Route path='/vouchers/add-voucher' element={<ThemMaGiamGia/>} />

          {/* CHAT */}
          <Route path='/chat/users' element={<DanhSachChat />} />
          <Route path='/chat/users/:username' element={<ChatWS />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
export default App;