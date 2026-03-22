import React, { ChangeEvent, useRef } from "react";
import { Search } from "react-bootstrap-icons";
import { Link, NavLink } from "react-router-dom";
import UserProfile from "../user/Profile";
interface Navbar {
    tuKhoaTimKiem: string;
    setTuKhoaTimKiem: (tuKhoa: string) => void;
}
const Navbar: React.FC<Navbar> = (props) => {
    let tmpTuKhoaTimKiem = useRef("");
    const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // props.setTuKhoaTimKiem(e.target.value) ;  vuieets theo cái này là gõ đén đâu render đén đấy (gõ đén đâu tìm kiếm đến đấy )
        tmpTuKhoaTimKiem.current = e.target.value;
    }

    const handleSearch = () => {
        // props.setTuKhoaTimKiem(props.tuKhoaTimKiem) ;
        props.setTuKhoaTimKiem(tmpTuKhoaTimKiem.current);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.setTuKhoaTimKiem(tmpTuKhoaTimKiem.current);
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">

                <a className="navbar-brand" href="#">BookStore</a>

                <button className="navbar-toggler" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">

                    {/* MENU BÊN TRÁI - XÓA 'me-auto' ĐỂ TRÁNH XUNG ĐỘT */}
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link active" to="/">Trang chủ</NavLink>
                        </li>
                        {/* ... (các thẻ li dropdown giữ nguyên) ... */}
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                Thể loại
                            </a>
                            <ul className="dropdown-menu " style={{ backgroundColor: "hsl(0, 0%, 80%)" }}>
                                <li><NavLink className="dropdown-item" to="/0">Tất cả</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/1">Thể loại 1</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/2">Thể loại 2</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/3">Thể loại 3</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/4">Thể loại 4</NavLink></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                Quy định
                            </a>
                            <ul className="dropdown-menu" style={{ backgroundColor: "hsl(0, 0%, 80%)" }}>
                                <li><a className="dropdown-item" href="#">Quy định 1</a></li>
                                <li><a className="dropdown-item" href="#">Quy định 2</a></li>
                                <li><a className="dropdown-item" href="#">Quy định 3</a></li>
                                <li><a className="dropdown-item" href="#">Quy định 4</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/danh-sach-yeu-thich">Danh sách yêu thích</NavLink>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Liên hệ</a>
                        </li>
                        <li>
                            <NavLink className="nav-link" to="/chat/users">Chat</NavLink>
                        </li>

                         <li>
                            <NavLink className="nav-link" to="/stats">Thống kê</NavLink>
                        </li>

                    </ul>

                    {/* KHỐI BÊN PHẢI - GIỮ NGUYÊN HOẶC BỎ ms-auto CŨNG ĐƯỢC VÌ ĐÃ CÓ justify-content-between */}
                    <div className="d-flex align-items-center gap-3">

                        {/* SEARCH */}
                        <form className="d-flex" onSubmit={handleSubmit}>
                            <input
                                className="form-control me-2"
                                placeholder="Tìm sách..."
                                onChange={onSearchInputChange}
                            />
                            <button
                                className="btn btn-outline-success"
                                type="submit" onClick={handleSearch}
                            >
                                <Search />
                            </button>
                        </form>

                        {/* GIỎ HÀNG */}
                        <NavLink className="nav-link position-relative" to="/cart">
                            <i className="fas fa-shopping-cart fs-5"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                3
                            </span>
                        </NavLink>

                        {/* USER */}
                        {/* <NavLink className="nav-link" to="/UserProfile">
                            <i className="fas fa-user fs-5"></i>
                        </NavLink> */}
                        
                        <UserProfile />
                    </div>
                </div>
            </div>
        </nav>


    );
}
export default Navbar;

