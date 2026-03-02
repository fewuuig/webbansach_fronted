function dinhDangSo(tien : number | undefined){
    if(tien === undefined){
        return 0 ; 
    }
    if(isNaN(tien)){
        return 0 ; 
    }
    return tien.toLocaleString("vi-VN") ;
}
export default dinhDangSo ;