import React from "react";
export async function request(params:string) {
    const respone =await fetch(params) ; 
    if(!respone.ok){
        throw new Error("không thể truy cập ") ; 
    }
    return respone.json() ; 
}