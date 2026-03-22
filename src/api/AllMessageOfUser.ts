
interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;

}
export async function getAllMessagesOfUser(
    sender:any,
    sendToUser: any ,
    page : any
): Promise<ChatMessage[]> {
    const kq :ChatMessage[] = [] ; 
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(
        `http://localhost:8080/chat/users/dm/messages?sender=${sender}&sendToUser=${sendToUser}&page=${page}&size=20`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Fetch message failed");
    }

    const data = await response.json();
    for(const i of data){
        kq.push({
            sender:i.sender , 
            content:i.content ,
            timestamp:i.timestamp,
        })
    }
    return kq; 
}