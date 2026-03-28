
import { Request, Response } from "express"
import { movieService } from "./movie.service"
import { catchAsync } from "../../shared/catchAsynce"
import { sendResponce } from "../../shared/sendResponce"
import httpStatus from "http-status";
import { safeParseJSON } from "../../utiles/safeParse";

const createMovie=async(req:Request,res:Response)=>{
    try{
        const body = req.body;

    const payload = {
      movieName: body.movieName,
      type: body.type,
      categories: safeParseJSON(body.categories) || [],
      price: Number(body.price) || 0,
    
      poster: body.poster,
      trailerUrl: body.trailerUrl,
      videoUrl: body.videoUrl,
      rating: Number(body.rating) || 0,
      duration: Number(body.duration),
      publishedYear: body.publishedYear
    ? Number(body.publishedYear)
    : null,

      story: body.story,
     

     
      cast: safeParseJSON(body.cast) || [],
      directors: safeParseJSON(body.directors) || [],
      producers: safeParseJSON(body.producers) || [],
      booking: safeParseJSON(body.booking) || [],
      reviews: safeParseJSON(body.reviews) || [],
      
    };
        const movie=await movieService.createMovie(payload)
        res.status(200).json(movie)
    }catch(err){
        console.log(err)
        res.status(400).json(err)}}

const getAllMovie=async(req:Request,res:Response)=>{
    try{
        const movie=await movieService.getAllMovie(req.query)
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