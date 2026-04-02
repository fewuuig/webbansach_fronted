class HinhAnhModel {
    maHinhAnh: number;
    tenHinhAnh?: string;
    icon?: boolean;
    link?: string;
    duLieuAnh?: string;
    

    constructor(maHinhAnh: number , tenHinhAnh: string , icon: boolean , link: string , duLieuAnh: string ,) {
        this.maHinhAnh = maHinhAnh ; 
        this.tenHinhAnh = tenHinhAnh ; 
        this.icon = icon ; 
        this.link =link ; 
        this.duLieuAnh = duLieuAnh ; 
    }
}
export default HinhAnhModel; 