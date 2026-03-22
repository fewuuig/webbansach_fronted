import { promises } from "dns";

interface chat{
    tenDangNhap : string  ; 
    anhDaiDien : string
}
export async function getDanhSachUserChat(): Promise<chat[]> {
    const ketQua:chat[] = [] ; 
    const accessToken = localStorage.getItem("accessToken") ; 
    const respone = await fetch("http://localhost:8080/chat/list-users" , {
        method : 'GET' , 
        headers : {
            'Authorization' : 'Bearer ' + accessToken   , 
        }
    }) ; 
    if(respone.ok){
       const data = await respone.json() ; 
       for(const key of data){
        ketQua.push({
            tenDangNhap : key.tenDangNhap , 
            anhDaiDien : key.anhDaiDien
        }) ; 
       }
    }else throw new Error("khoong theer laays danh sach nguoiwf dungf chat leen ") ; 
    return ketQua;
}