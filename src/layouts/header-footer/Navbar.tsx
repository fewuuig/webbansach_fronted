import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Filter, Search } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import UserProfile from "../user/Profile";
import "./navbar.css";

interface FilterType {
    giaMin: string;
    giaMax: string;
    theLoai: string;
    tacGia: string;
}

interface NavbarProps {
    tuKhoaTimKiem: string;
    setTuKhoaTimKiem: (tuKhoa: string) => void;

    filter: FilterType;
    setFilter: (filter: FilterType) => void;
}

const Navbar: React.FC<NavbarProps> = (props) => {
    // ================= SEARCH =================
    const tmpTuKhoaTimKiem = useRef("");

    const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        tmpTuKhoaTimKiem.current = e.target.value;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.setTuKhoaTimKiem(tmpTuKhoaTimKiem.current);
    };

    // ================= FILTER =================
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // 🔥 State tạm (quan trọng)
    const [tempFilter, setTempFilter] = useState<FilterType>(props.filter);

    // Khi mở filter → sync dữ liệu từ props
    useEffect(() => {
        if (showFilter) {
            setTempFilter(props.filter);
        }
    }, [showFilter, props.filter]);

    // Click ngoài → đóng filter
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(event.target as Node)
            ) {
                setShowFilter(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">

                <NavLink className="navbar-brand" to="/">BookStore</NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">

                    {/* LEFT MENU */}
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Trang chủ</a>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                Thể loại
                            </a>
                            <ul className="dropdown-menu">
                                <li><NavLink className="dropdown-item" to="/0">Tất cả</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/1">Tiểu thuyết</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/2">Kinh tế</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/3">CNTT</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/4">Truyện tranh</NavLink></li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/danh-sach-yeu-thich">Yêu thích</NavLink>
                        </li>

                        <li>
                            <NavLink className="nav-link" to="/chat/users">Chat</NavLink>
                        </li>

                        <li>
                            <NavLink className="nav-link" to="/stats">Thống kê</NavLink>
                        </li>
                         <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                Thiết lập
                            </a>
                            <ul className="dropdown-menu">
                                <li><NavLink className="dropdown-item" to="/admin/them-sach">Thêm sách</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/book/update">Sửa sách</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/vouchers/add-voucher">Mã giảm giá</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/account/disable">Disable account</NavLink></li>
                            </ul>
                        </li>
                    </ul>

         
                    <div className="d-flex align-items-center gap-3">

                        <div className="position-relative" ref={filterRef}>
                            <div
                                className="p-2 rounded filter-icon"
                                onClick={() => setShowFilter(!showFilter)}
                            >
                                <Filter size={20} />
                            </div>

                            {showFilter && (
                                <div
                                    className="card p-3 shadow position-absolute"
                                    style={{
                                        top: "110%",
                                        right: 0,
                                        width: "260px",
                                        zIndex: 1000
                                    }}
                                >
                                    <h6>Lọc sách</h6>

                                    <input
                                        type="number"
                                        placeholder="Giá từ..."
                                        className="form-control mb-2"
                                        value={tempFilter.giaMin}
                                        onChange={(e) =>
                                            setTempFilter({
                                                ...tempFilter,
                                                giaMin: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        type="number"
                                        placeholder="Đến giá..."
                                        className="form-control mb-2"
                                        value={tempFilter.giaMax}
                                        onChange={(e) =>
                                            setTempFilter({
                                                ...tempFilter,
                                                giaMax: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        type="text"
                                        placeholder="Tác giả"
                                        className="form-control mb-2"
                                        value={tempFilter.tacGia}
                                        onChange={(e) =>
                                            setTempFilter({
                                                ...tempFilter,
                                                tacGia: e.target.value
                                            })
                                        }
                                    />

                                    <select
                                        className="form-select mb-2"
                                        value={tempFilter.theLoai}
                                        onChange={(e) =>
                                            setTempFilter({
                                                ...tempFilter,
                                                theLoai: e.target.value
                                            })
                                        }
                                    >
                                        <option value="">-- Thể loại --</option>
                                        <option value="1">Tiểu thuyết</option>
                                        <option value="2">Kinh tế</option>
                                        <option value="3">CNTT</option>
                                        <option value="4">Truyện tranh</option>
                                    </select>

                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={() => {
                                            props.setFilter(tempFilter); 
                                            setShowFilter(false);
                                        }}
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* SEARCH */}
                        <form className="d-flex" onSubmit={handleSubmit}>
                            <input
                                className="form-control me-2"
                                placeholder="Tìm sách..."
                                onChange={onSearchInputChange}
                            />
                            <button className="btn btn-outline-success" type="submit">
                                <Search />
                            </button>
                        </form>

                        {/* CART */}
                        <NavLink className="nav-link position-relative" to="/cart">
                            <i className="fas fa-shopping-cart fs-5"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
                                3
                            </span>
                        </NavLink>

                        {/* USER */}
                        <UserProfile />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;