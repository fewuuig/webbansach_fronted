import React, { useEffect, useState } from "react";
import { layThongTinCaNhan1User } from "../../../api/ThongTinCaNhanApi";

interface ThongTinTaiKhoan {
    ten: string;
    hoDem: string;
    gioiTinh: string;
    anhDaiDien: string;
    email: string;
    tenDangNhap: string;
    soDienThoai: string;
}

const DisableAccount: React.FC = () => {
    const accessToken = localStorage.getItem("accessToken");

    const [username, setUsername] = useState<string>("");
    const [message, setMessage] = useState("");
    const [profileUser, setProfileUser] = useState<ThongTinTaiKhoan | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    const [isExist, setIsExist] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(false);

    // 🔥 REALTIME CHECK USERNAME (DEBOUNCE 500ms)
    useEffect(() => {
        if (!username.trim()) {
            setIsExist(null);
            setChecking(false);
            return;
        }

        setChecking(true);

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/tai-khoan/check-username?username=${username}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!res.ok) {
                    setIsExist(null);
                    setChecking(false);
                    return;
                }

                const result = await res.json();
                const exists = typeof result === "boolean" ? result : result.exists;

                setIsExist(exists);
            } catch (err) {
                setIsExist(null);
            } finally {
                setChecking(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    // Tìm user
    const handleSearchUser = async () => {
        if (!username.trim()) {
            setMessage("Vui lòng nhập tên tài khoản!");
            return;
        }

        if (isExist === false) {
            setMessage("Tài khoản không tồn tại!");
            setProfileUser(null);
            return;
        }

        try {
            const data = await layThongTinCaNhan1User(username);
            setProfileUser(data);
            setConfirmed(false);
            setMessage("");
        } catch (error) {
            setProfileUser(null);
            setMessage("Không tìm thấy user!");
        }
    };

    // Disable
    const handleDisable = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/tai-khoan/disable",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tenDangNhap: username
                    })
                }
            );

            if (response.ok) {
                setMessage("Khóa tài khoản thành công!");
                setProfileUser(null);
                setUsername("");
                setConfirmed(false);
                setIsExist(null);
            } else {
                const err = await response.json();
                setMessage(err.error);
            }
        } catch (error) {
            setMessage("Không thể kết nối server!");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow" style={{ maxWidth: "500px", margin: "auto" }}>
                <h5 className="mb-3 text-center">Khóa tài khoản</h5>

                {/* INPUT + REALTIME CHECK */}
                <div className="mb-3">
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className={`form-control ${
                                isExist === false ? "is-invalid" : isExist ? "is-valid" : ""
                            }`}
                            placeholder="Nhập tên tài khoản..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSearchUser}
                            disabled={isExist !== true}
                        >
                            Tìm
                        </button>
                    </div>

                    {/* 🔥 MESSAGE NGAY DƯỚI INPUT */}
                    {checking && (
                        <div className="text-secondary mt-1">
                            Đang kiểm tra...
                        </div>
                    )}

                    {!checking && isExist === false && (
                        <div className="text-danger mt-1">
                            Tài khoản không tồn tại!
                        </div>
                    )}

                    {!checking && isExist === true && (
                        <div className="text-success mt-1">
                            Tài khoản hợp lệ
                        </div>
                    )}
                </div>

                {/* PROFILE USER */}
                {profileUser && (
                    <div className="card p-3 mb-3 bg-light">
                        <p><b>Họ tên:</b> {profileUser.hoDem} {profileUser.ten}</p>
                        <p><b>Email:</b> {profileUser.email}</p>
                        <p><b>SĐT:</b> {profileUser.soDienThoai}</p>
                        <p><b>Giới tính:</b> {profileUser.gioiTinh}</p>

                        {!confirmed ? (
                            <button
                                className="btn btn-warning w-100"
                                onClick={() => setConfirmed(true)}
                            >
                                Xác nhận khóa tài khoản
                            </button>
                        ) : (
                            <button
                                className="btn btn-danger w-100"
                                onClick={handleDisable}
                            >
                                Vô hiệu hóa tài khoản
                            </button>
                        )}
                    </div>
                )}

                {/* MESSAGE */}
                {message && (
                    <div className="text-center mt-2">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisableAccount;