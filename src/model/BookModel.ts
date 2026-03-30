class BookModel {
    maSach: number ;
    tenSach?: string; // có thể bị null 
    giaBan?: number;
    giaNiemYet?: number;
    moTa?: string;
    soLuong: number;
    tenTacGia?: string;
    trungBinhXepHang?: number;
    isbn : string ; 

    constructor( isbn : string, maSach: number  ,tenSach: string , giaBan: number ,giaNiemYet: number ,moTa: string ,soLuong: number ,tenTacGia: string ,trungBinhXepHang: number ,){
        this.maSach = maSach ; 
        this.tenSach = tenSach ; 
        this. giaBan= giaBan ; 
        this.giaNiemYet = giaNiemYet ;  
        this.moTa = moTa ;  
        this.soLuong = soLuong ; 
        this.tenTacGia =tenTacGia ; 
        this.trungBinhXepHang = trungBinhXepHang ; 
        this.isbn= isbn ;
    }

}
export default BookModel; 