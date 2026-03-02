interface ThongTinTaiKhoan{
  ten : string , 
  hoDem : string , 
  gioiTinh :string , 
  anhDaiDien : string ,
  email : string
}
export async function layThongTinCaNhan():Promise<ThongTinTaiKhoan|null> {
    let ketQua : ThongTinTaiKhoan|null = null ; 
     const accessToken = localStorage.getItem("accessToken")
    const respone = await fetch(`http://localhost:8080/tai-khoan/lay-thong-tin`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }

    })
    if (respone.ok) {
        const responeData =await respone.json() ; 
        ketQua = responeData ; 
    } else throw new Error("Không lấy đc thoong tin nguwoif dungf DB lên");
    return ketQua;
}