import React, { useEffect, useState } from "react";
import { getDanhSachUserChat } from "../api/DanhSachChat";
import ChatProp from "./component/ChatProp";
import "./AnhVaTenClick.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface Chat {
  tenDangNhap: string;
  anhDaiDien: string;
}

interface JwtPayload {
  isAdmin: boolean;
}

const DanhSachChat: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = chưa check
  const [danhSachChat, setDanhSachChat] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const decodedToken:any = jwtDecode(accessToken) ; 
        if (!decodedToken.isAdmin) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        const data = await getDanhSachUserChat();
        setDanhSachChat(data);
      } catch (err) {
        console.error("Token hoặc API lỗi", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const navigate = useNavigate();
  if (loading) return <div>Đang tải...</div>;
  if (!isAdmin) navigate("/chat/users/viet_mai"); // Không phải admin thì 

  return (
    <div>
      {danhSachChat.map((chat, index) => (
        <div key={index}>
          <ChatProp tenDangNhap={chat.tenDangNhap} anhDaiDien={chat.anhDaiDien} />
        </div>
      ))}
    </div>
  );
};

export default DanhSachChat;