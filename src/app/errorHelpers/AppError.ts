class AppError extends Error {
   public statusCode: number;
    constructor( statusCode: number = 500,message: string,   stack='') {
        super(message);
        this.statusCode = statusCode;
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default AppError