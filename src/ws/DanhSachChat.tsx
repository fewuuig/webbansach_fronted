import React, { use, useEffect, useState } from "react";
import { getDanhSachUserChat } from "../api/DanhSachChat";
import { error } from "console";
import ChatProp from "./component/ChatProp";
import "./AnhVaTenClick.css" ; 
interface chat {
    tenDangNhap: string;
    anhDaiDien: string;
}
const DanhSachChat: React.FC = () => {
    const [danhSachChat, setDanhSachChat] = useState<chat[]>([]);
    useEffect(() => {
        getDanhSachUserChat().then(
            data => {
                setDanhSachChat(data);
            }
        ).catch(error => {
            console.log(error);
        })
    }, []);
    return (
        <div>
            {
                danhSachChat.map(chat => (
                    <div>
                        <ChatProp tenDangNhap={chat.tenDangNhap} anhDaiDien={chat.anhDaiDien}/>
                    </div>
                ))
            }
        </div>
    );
}
export default DanhSachChat; 