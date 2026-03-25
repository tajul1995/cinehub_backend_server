import { Movie } from '../../../generated/prisma/browser';
import { prisma } from '../../lib/prisma';

const createMovie=async(Payload:Movie)=>{
    return await prisma.movie.create({
        data:Payload
    })

}
const getAllMovie=async()=>{return await prisma.movie.findMany({})}
const getMovieById=async(id:string)=>{return await prisma.movie.findUnique({where:{id}})}
const deleteMovieById=async(id:string)=>{return await prisma.movie.delete({where:{id}})}
export const movieService={
    createMovie,
    getAllMovie,
    getMovieById,
    deleteMovieById
}