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
                stompClient.subscribe("/user/queue/chat", message => {
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
    return stompClient;
}

export const sendMessageToUser = (content, sendToUser, sender) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/chat/users/dm",
            body: JSON.stringify({
                content: content,
                sendToUser: sendToUser,
                sender: sender,

            })
        })
    }

}