import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Filter, Search } from "react-bootstrap-icons";
import { jwtDecode } from "jwt-decode";
import { NavLink } from "react-router-dom";
import UserProfile from "../user/Profile";
import { useAppSettings } from "../../context/AppSettingsContext";
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

interface JwtPayload {
    isAdmin?: boolean;
}

const navbarText = {
    vi: {
        home: "Trang chủ",
        category: "Thể loại",
        all: "Tất cả",
        novel: "Tiểu thuyết",
        economy: "Kinh tế",
        it: "CNTT",
        comic: "Truyện tranh",
        skills: "Tâm lý - Kỹ năng",
        wishlist: "Yêu thích",
        chat: "Chat",
        stats: "Thống kê",
        orderManagement: "Quản lý đơn hàng",
        settings: "Thiết lập",
        addBook: "Thêm sách",
        editBook: "Sửa sách",
        voucher: "Mã giảm giá",
        disableAccount: "Khóa tài khoản",
        filterBooks: "Lọc sách",
        minPrice: "Giá từ...",
        maxPrice: "Giá đến...",
        author: "Tác giả",
        chooseCategory: "-- Thể loại --",
        apply: "Áp dụng",
        search: "Tìm sách..."
    },
    en: {
        home: "Home",
        category: "Categories",
        all: "All",
        novel: "Novel",
        economy: "Economy",
        it: "IT",
        comic: "Comics",
        skills: "Psychology - Skills",
        wishlist: "Wishlist",
        chat: "Chat",
        stats: "Statistics",
        orderManagement: "Order Management",
        settings: "Settings",
        addBook: "Add Book",
        editBook: "Edit Book",
        voucher: "Voucher",
        disableAccount: "Disable Account",
        filterBooks: "Filter Books",
        minPrice: "Min price...",
        maxPrice: "Max price...",
        author: "Author",
        chooseCategory: "-- Category --",
        apply: "Apply",
        search: "Search books..."
    }
} as const;

const Navbar: React.FC<NavbarProps> = (props) => {
    const { language } = useAppSettings();
    const text = navbarText[language];
    const accessToken = localStorage.getItem("accessToken");
    let isAdmin = false;

    if (accessToken) {
        try {
            const decodedToken = jwtDecode<JwtPayload>(accessToken);
            isAdmin = !!decodedToken.isAdmin;
        } catch {
            isAdmin = false;
        }
    }

    const tmpTuKhoaTimKiem = useRef(props.tuKhoaTimKiem);
    const [showFilter, setShowFilter] = useState(false);
    const [tempFilter, setTempFilter] = useState<FilterType>(props.filter);
    const filterRef = useRef<HTMLDivElement>(null);

    const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        tmpTuKhoaTimKiem.current = e.target.value;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.setTuKhoaTimKiem(tmpTuKhoaTimKiem.current);
    };

    useEffect(() => {
        if (showFilter) {
            setTempFilter(props.filter);
        }
    }, [showFilter, props.filter]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
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
                <NavLink className="navbar-brand" to="/">
                    BookStore
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                {text.home}
                            </NavLink>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="/" onClick={(e) => e.preventDefault()} data-bs-toggle="dropdown">
                                {text.category}
                            </a>
                            <ul className="dropdown-menu">
                                <li><NavLink className="dropdown-item" to="/0">{text.all}</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/1">{text.novel}</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/2">{text.economy}</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/3">{text.it}</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/4">{text.comic}</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/5">{text.skills}</NavLink></li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/danh-sach-yeu-thich">
                                {text.wishlist}
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/chat/users">
                                {text.chat}
                            </NavLink>
                        </li>

                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/stats">
                                        {text.stats}
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/don-hang">
                                        {text.orderManagement}
                                    </NavLink>
                                </li>

                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="/" onClick={(e) => e.preventDefault()} data-bs-toggle="dropdown">
                                        {text.settings}
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><NavLink className="dropdown-item" to="/admin/them-sach">{text.addBook}</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/book/update">{text.editBook}</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/vouchers/add-voucher">{text.voucher}</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/account/disable">{text.disableAccount}</NavLink></li>
                                    </ul>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        <div className="position-relative" ref={filterRef}>
                            <div className="p-2 rounded filter-icon" onClick={() => setShowFilter(!showFilter)}>
                                <Filter size={20} />
                            </div>

                            {showFilter && (
                                <div
                                    className="card p-3 shadow position-absolute"
                                    style={{ top: "110%", right: 0, width: "260px", zIndex: 1000 }}
                                >
                                    <h6>{text.filterBooks}</h6>

                                    <input
                                        type="number"
                                        placeholder={text.minPrice}
                                        className="form-control mb-2"
                                        value={tempFilter.giaMin}
                                        onChange={(e) => setTempFilter({ ...tempFilter, giaMin: e.target.value })}
                                    />

                                    <input
                                        type="number"
                                        placeholder={text.maxPrice}
                                        className="form-control mb-2"
                                        value={tempFilter.giaMax}
                                        onChange={(e) => setTempFilter({ ...tempFilter, giaMax: e.target.value })}
                                    />

                                    <input
                                        type="text"
                                        placeholder={text.author}
                                        className="form-control mb-2"
                                        value={tempFilter.tacGia}
                                        onChange={(e) => setTempFilter({ ...tempFilter, tacGia: e.target.value })}
                                    />

                                    <select
                                        className="form-select mb-2"
                                        value={tempFilter.theLoai}
                                        onChange={(e) => setTempFilter({ ...tempFilter, theLoai: e.target.value })}
                                    >
                                        <option value="">{text.chooseCategory}</option>
                                        <option value="1">{text.novel}</option>
                                        <option value="2">{text.economy}</option>
                                        <option value="3">{text.it}</option>
                                        <option value="4">{text.comic}</option>
                                        <option value="5">{text.skills}</option>
                                    </select>

                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={() => {
                                            props.setFilter(tempFilter);
                                            setShowFilter(false);
                                        }}
                                    >
                                        {text.apply}
                                    </button>
                                </div>
                            )}
                        </div>

                        <form className="d-flex" onSubmit={handleSubmit}>
                            <input
                                className="form-control me-2"
                                defaultValue={props.tuKhoaTimKiem}
                                placeholder={text.search}
                                onChange={onSearchInputChange}
                            />
                            <button className="btn btn-outline-success" type="submit">
                                <Search />
                            </button>
                        </form>

                        <NavLink className="nav-link position-relative" to="/cart">
                            <i className="fas fa-shopping-cart fs-5"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge bg-danger"></span>
                        </NavLink>

                        <UserProfile />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
