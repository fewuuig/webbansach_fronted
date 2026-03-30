interface ThongTinTaiKhoan{
  ten : string , 
  hoDem : string , 
  gioiTinh :string , 
  anhDaiDien : string ,
  email : string,
  tenDangNhap: string,
  soDienThoai : string
}
export async function layThongTinCaNhan():Promise<ThongTinTaiKhoan|null> {
    let ketQua : ThongTinTaiKhoan|null = null ; 
     const accessToken = localStorage.getItem("accessToken")
    const respone = await fetch(`http://localhost:8080/profile/info`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    if (respone.ok) {
        const responeData =await respone.json() ; 
        ketQua = responeData ; 
    }
    return ketQua;
}
export async function layThongTinCaNhan1User(userOther : string):Promise<ThongTinTaiKhoan|null> {
    let ketQua : ThongTinTaiKhoan|null = null ; 
     const accessToken = localStorage.getItem("accessToken")
    const respone = await fetch(`http://localhost:8080/profile/info/user-other?userOther=${userOther}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    if (respone.ok) {
        const responeData =await respone.json() ; 
        ketQua = responeData ; 
    }
    return ketQua;
}