import { Star, StarFill, StarHalf, Stars } from "react-bootstrap-icons";

function starRating(rating : number){
    const stars  =[] ;  
    let flag = true ; 
    const starDynamic = 5-rating ; 
    for(let i =1 ; i<=5 ; i++){
        if(i<=rating){
            stars.push(<StarFill/>) ; 
        }else
        if(starDynamic !=0 && starDynamic%2 !=0 && flag){
            stars.push(<StarHalf/>)
            flag = false ;
        }else if(i>rating){
            stars.push(<Star/>)
        }
    }
    return stars ;
}
export default starRating ;