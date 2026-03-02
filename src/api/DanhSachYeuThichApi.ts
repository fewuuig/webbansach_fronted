interface SachYeuThich{
    tenSach : string , 
    maSach : number
}
export async function laySachTrongDanhSachYeuThich():Promise<SachYeuThich[]> {
    const ketQua : SachYeuThich[] = [] ; 
    const accessToken = localStorage.getItem("accessToken") ; 
    const  response = await fetch('http://localhost:8080/wish-love/danh-sach-yeu-thich' , {
        method: 'GET' , 
        headers : {
            'Content-type' : 'application/json' , 
            'Authorization' : `Bearer ${accessToken}` 
        }
    })
    if(response.ok){
        const data =await response.json() ;
        for(const i  of data){
            ketQua.push({
                tenSach : i.tenSach , 
                maSach : i.maSach
            });
        } 
    }else {
        throw new Error("khồng lấy đc sách yêu thích từ DB lên") ; 
    }
    return ketQua ; 
}