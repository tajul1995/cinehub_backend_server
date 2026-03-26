import { auth } from "../../lib/auth";
import { LoginPayload, RegisterUserPayload } from "./auth.interface";



const registerUser=async(payload:RegisterUserPayload)=>{
    const data= await auth.api.signUpEmail({
        body:{
            name:payload.name,
            email:payload.email,
            password:payload.password
        }
    })
    if(!data.user){
        throw new Error("User not found")
    }
    return data.user
}
const loginUser= async(payload:LoginPayload)=>{
    const data=await auth.api.signInEmail({
        body:{
            email:payload.email,
            password:payload.password
        }
    })
    if(data.user.status==="DELETED"){
        throw new Error("User is deleted")
    }
    if(data.user.status==="BLOCKED"){
        throw new Error("User is blocked")
    }
    return data.user
}
export const authService={
    registerUser,
    loginUser
}