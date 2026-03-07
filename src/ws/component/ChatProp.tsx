import React from "react";
import { NavLink } from "react-router-dom";
interface props {
    tenDangNhap: string;
    anhDaiDien: string;
}
const ChatProp: React.FC<props> = (props: props) => {
    return (
       <NavLink to={`/chat/users/${props.tenDangNhap}`}>
         <div className="chat-item">
            <img className="avatar" src={props.anhDaiDien} alt="Avatar" />
            <p className="username">{props.tenDangNhap}</p>
        </div>
       </NavLink>
    );
}
export default ChatProp; 