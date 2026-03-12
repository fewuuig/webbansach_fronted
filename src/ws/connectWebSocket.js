import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;
export const connectWebSocket = (token, setMessage, setStat) => {
    const socket = new SockJS("http://localhost:8080/ws");

    stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: "Bearer " + token
            },
            debug: function(str) {
                console.log(str)
            },
            onConnect: () => {
                console.log("websocket conected");
                stompClient.subscribe("/user/queue/support", message => {
                    const body = JSON.parse(message.body);
                    setMessage(body);
                });
                stompClient.subscribe("/topic/stats", stat => {
                    const body = JSON.parse(stat.body)
                    setStat(body)
                })
            },
            onStompError: (frame) => {
                console.log(frame.headers["message"]);
            }
        }

    );
    stompClient.activate();
}
export const sendMessageToSupporter = (content) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/chat.send-to-supporter",
            body: JSON.stringify({
                content: content
            })
        })
    }
}
export const sendMessageToUser = (content, sendToUser) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/chat.send-to-user",
            body: JSON.stringify({
                content: content,
                sendToUser: sendToUser
            })
        })
    }

}