import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { bearer, emailOTP} from "better-auth/plugins";
import { sendEmail } from "../utiles/email";





export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword:{
        enabled: true
    },
    user:{
    additionalFields:{
        role:{
            type:"string",
            required:true,
            defaultValue:Role.USER
        },
        status:{
            type:"string",
            required:true,
            defaultValue:UserStatus.ACTIVE
        },
       
        isDeleted:{
            type:"boolean",
            required:true,
            defaultValue:false
        },
        deletedAt:{
            type:"date",
            required:false,
            defaultValue:null
        }
    }
  },
  plugins:[
     bearer(),
     emailOTP({
        overrideDefaultEmailVerification:true,
        async sendVerificationOTP({email,otp,type}){
             if(type==="forget-password"){
            const user= await prisma.user.findUnique({
                where:{
                    email
                }
            })
            if(user){
                sendEmail({
                        to:email,
                        subject:"Password Reset otp",
                        templateName:"otp",
                        templateData:{
                            name:user.name,
                            otp
                        }
                    })
            }
        }
      },
    expiresIn:5*60,
    otpLength:6
    
    })
  ],
  session:{
    expiresIn:60 * 60 * 24 ,
    updateAge:60 * 60 * 24 ,
    cookieCache:{
        enabled:true,
        maxAge:60 * 60 * 24 ,

    }
  },
});


