import dotenv from "dotenv"

import status from "http-status"
import AppError from "../app/errorHelpers/AppError"
dotenv.config()
interface EnvConfig {
    PORT:string,
    DATABASE_URL:string,
    BETTER_AUTH_SECRET:string,
    BETTER_AUTH_URL:string,

}
const loadEnv=():EnvConfig=>{
      const requirmentVariables=[
        "PORT",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL"
      ]
       requirmentVariables.forEach((variable)=>{
        if(!process.env[variable]){
            // throw new Error(`Missing required environment variable: ${variable}`)
            throw new AppError(status.INTERNAL_SERVER_ERROR,`Missing required environment variable: ${variable}`)
        }})
        return {
            PORT:process.env.PORT as string,
            DATABASE_URL:process.env.DATABASE_URL as string,
            BETTER_AUTH_SECRET:process.env.BETTER_AUTH_SECRET as string,
            BETTER_AUTH_URL:process.env.BETTER_AUTH_URL as string
        }
}
export const envVars=loadEnv()