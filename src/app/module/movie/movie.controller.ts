import { Request, Response } from "express"
import { movieService } from "./movie.service"
import { catchAsync } from "../../shared/catchAsynce"
import { sendResponce } from "../../shared/sendResponce"
import httpStatus from "http-status";

const createMovie=async(req:Request,res:Response)=>{
    try{
        const movie=await movieService.createMovie(req.body)
        res.status(200).json(movie)
    }catch(err){
        console.log(err)
        res.status(400).json(err)}}

const getAllMovie=async(req:Request,res:Response)=>{
    try{
        const movie=await movieService.getAllMovie()
        res.status(200).json(movie)
    }catch(err){
        console.log(err)
        res.status(400).json(err)}
}
const getMovieById=catchAsync(async(req:Request,res:Response)=>{
    const movie=await movieService.getMovieById(req.params.id as string)
    sendResponce(res,{httpStatuscode:httpStatus.OK,success:true,data:movie,message:"get single movie by id"})
    
})
const deleteMovieById=async(req:Request,res:Response)=>{
    try {
        const movie=await movieService.deleteMovieById(req.params.id as string)
        res.status(200).json(movie)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)}
    }

export const movieController={
    createMovie,
    getAllMovie,
    getMovieById,
    deleteMovieById
}