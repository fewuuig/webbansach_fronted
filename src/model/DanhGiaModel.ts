class DanhGiaModel{
    maDanhGia : number ;
    nhanXet?:string ;
    diemXepHang : number ; 
    anhDaiDien :string ; 

    constructor(maDanhGia : number , nhanXet : string , diemXepHang : number , anhDaiDien : string){
        this.maDanhGia = maDanhGia ; 
        this.nhanXet = nhanXet ; 
        this.diemXepHang = diemXepHang ; 
        this.anhDaiDien = anhDaiDien ; 
    }

}
export default DanhGiaModel ; 