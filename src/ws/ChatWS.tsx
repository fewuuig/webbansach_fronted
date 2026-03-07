import React, { useEffect, useRef, useState } from "react";
import { connectWebSocket, sendMessageToSupporter, sendMessageToUser } from "./connectWebSocket";
import { jwtDecode } from "jwt-decode";
import "./Chat.css" ; 
import { useParams } from "react-router-dom";
interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
}
interface payloadJwt {
  isAdmin ?: boolean ; 
  isUser ?: boolean ; 
  isStaff ?:boolean ; 
}
const ChatWS : React.FC = ()=> {
  const {username} = useParams() ; 
  const sendToUser = username?.toString() ; 
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    
    connectWebSocket(token ,( message:ChatMessage) => {
      setMessages(prev => [...prev , message])
    } );
  }, []);

  const role = token ?  jwtDecode(token) as payloadJwt : null ;  
  const decodeJwt = token ? jwtDecode(token)  : "" ; 
   const handleSend = () => {
    if(input==="") return ; 
    if(role?.isUser) sendMessageToSupporter( input );
    else if(role?.isStaff && sendToUser) sendMessageToUser(input , sendToUser) ; 
    setInput("");
  };
  return (
    <div className="chat-container">
    <div className="chat-box">
      <div className="chat-header">Chat with seller</div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender === decodeJwt.sub ? "own" : ""
            }`}
          >
            <div className="message-content">
              <span className="sender">{msg.sender}</span>
              <div className="bubble">{msg.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={handleSend}>Gửi</button>
      </div>
    </div>
    {/* <div ref={messagesEndRef} /> */}
  </div>
  
  );

}

export default ChatWS;