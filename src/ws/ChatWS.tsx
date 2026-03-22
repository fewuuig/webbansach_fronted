
import React, { useEffect, useMemo, useRef, useState } from "react";
import { connectWebSocket, sendMessageToUser } from "./connectWebSocket";
import { jwtDecode } from "jwt-decode";
import "./Chat.css";
import { useParams } from "react-router-dom";
import { getAllMessagesOfUser } from "../api/AllMessageOfUser";

interface ChatMessage {
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
  const bottomRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("accessToken");

  // 🔥 decode sender
  const sender = useMemo(() => {
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.sub;
  }, [token]);

  // 🔥 util: sort + dedupe
  const normalizeMessages = (list: ChatMessage[]) => {
    const map = new Map<string, ChatMessage>();

    list.forEach((m) => {
      const key = m.timestamp + m.sender + m.content;
      map.set(key, m);
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    );
  };

  // 🔥 websocket
  useEffect(() => {
    if (!token) return;

    connectWebSocket(
      token,
      (message: ChatMessage) => {
        setMessages((prev) => normalizeMessages([...prev, message]));

        // auto scroll xuống
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      },
      () => {}
    );
  }, [token]);

  // 🔥 load message (pagination)
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

        // 🔥 giữ vị trí scroll (không giật)
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

  // 🔥 auto load khi scroll lên top
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

  // 🔥 gửi tin nhắn
  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      sender: sender!,
      content: input,
      timestamp: new Date().toISOString(),
    };

    // 🔥 optimistic UI
    setMessages((prev) => normalizeMessages([...prev, newMsg]));

    sendMessageToUser(input, sendToUser, sender);
    setInput("");

    // scroll xuống luôn
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">Chat with seller</div>

        <div className="chat-messages" ref={chatRef}>
          {/* 🔼 load thêm */}
          <div style={{ textAlign: "center", margin: "10px" }}>
            <button onClick={() => setPage((prev) => prev + 1)}>
              {loadingMore ? "Đang tải..." : "↑ Xem thêm tin nhắn"}
            </button>
          </div>

          {messages.map((msg, index) => (
            <div
              key={index}
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

          <div ref={bottomRef} />
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

