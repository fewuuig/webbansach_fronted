
import React, { useEffect, useMemo, useRef, useState } from "react";
import { connectWebSocket, sendMessageToUser } from "./connectWebSocket";
import { jwtDecode } from "jwt-decode";
import "./Chat.css";
import { useParams } from "react-router-dom";
import { getAllMessagesOfUser } from "../api/AllMessageOfUser";

interface ChatMessage {
  id?: string;
  sender: string;
  content: string;
  timestamp: string;
}

const ChatWS: React.FC = () => {
  const { username } = useParams();
  const sendToUser = username?.toString();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("accessToken");

  // decode sender
  const sender = useMemo(() => {
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.sub;
  }, [token]);

  // key unique
  const getKey = (m: ChatMessage) => {
    return m.id || `${m.timestamp}_${m.sender}_${m.content}`;
  };

  // normalize: dedupe + sort
  const normalizeMessages = (list: ChatMessage[]) => {
    const map = new Map<string, ChatMessage>();

    list.forEach((m) => {
      map.set(getKey(m), m);
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    );
  };

  // 🔥 websocket (KHÔNG scroll nữa)
  useEffect(() => {
    if (!token) return;

    connectWebSocket(
      token,
      (message: ChatMessage) => {
        setMessages((prev) => {
          return normalizeMessages([...prev, message]);
        });
      },
      () => {}
    );
  }, [token]);

  // load message (pagination)
  useEffect(() => {
    if (!sender || !sendToUser) return;

    setLoadingMore(true);

    const div = chatRef.current;
    const oldHeight = div?.scrollHeight || 0;

    getAllMessagesOfUser(sender, sendToUser, page)
      .then((data) => {
        setMessages((prev) => {
          const merged =
            page === 1 ? data : [...data, ...prev];

          return normalizeMessages(merged);
        });

        // giữ vị trí scroll (khi load thêm)
        setTimeout(() => {
          if (div) {
            const newHeight = div.scrollHeight;
            div.scrollTop = newHeight - oldHeight;
          }
        }, 0);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingMore(false));
  }, [sendToUser, sender, page]);

  // auto load khi scroll lên top
  useEffect(() => {
    const div = chatRef.current;
    if (!div) return;

    const handleScroll = () => {
      if (div.scrollTop === 0 && !loadingMore) {
        setPage((prev) => prev + 1);
      }
    };

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [loadingMore]);

  // gửi tin nhắn (chờ websocket trả về)
  const handleSend = () => {
    if (!input.trim() || !sender) return;

    sendMessageToUser(input, sendToUser, sender);
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">Chat with seller</div>

        <div className="chat-messages" ref={chatRef}>
          <div style={{ textAlign: "center", margin: "10px" }}>
            <button onClick={() => setPage((prev) => prev + 1)}>
              {loadingMore ? "Đang tải..." : "↑ Xem thêm tin nhắn"}
            </button>
          </div>

          {messages.map((msg) => (
            <div
              key={getKey(msg)}
              className={`chat-message ${
                msg.sender === sender ? "own" : ""
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
    </div>
  );
};

export default ChatWS;
