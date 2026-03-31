/* eslint-disable @typescript-eslint/no-explicit-any */


import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';

 const createMovie= async (payload: any) => {
  const {
    movieName,
    type,
    categories,
    price,
    poster,
    trailerUrl,
    videoUrl,
    rating,
    duration,
    publishedYear,
    story,
    
    cast,
    directors,
    producers,
    bookings,
    reviews,
    
  } = payload;
const findMovie=await prisma.movie.findFirst({where:{movieName:payload.movieName}})
if(findMovie){
    throw new AppError(status.BAD_REQUEST, "Movie already exist")
}
  const movie = await prisma.movie.create({
    data: {
      movieName,
      type,
      categories,
      price,

      poster,
      trailerUrl,
      videoUrl,

      rating,
      duration,
      publishedYear,
      story,
    

     

      

      cast: {
        create: cast,
      },

      directors: {
        create: directors,
      },

      producers: {
        create: producers,
      },
      bookings: {
        create: bookings,
      },
      reviews: {
        create: reviews,
      },
    },
    include: {
      
      cast: true,
      directors: true,
      producers: true,
      bookings: true,
      reviews: true,
    },
  });

  return movie;
};



// const createMovie=async(payload:any)=>{return await prisma.movie.create({data:payload})}



const getAllMovie=async (query: any) => {
  const {
    search,
    category,
    type,
    year,        // exact year
    yearFrom,    // range start
    yearTo,      // range end
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const pg = Math.max(1, Number(page));
  const lim = Math.min(100, Number(limit));

  const where: any = {};

 
  if (category) {
    const categoryArray = String(category)
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    if (categoryArray.length > 0) {
      where.categories = {
        hasSome: categoryArray,
      };
    }
  }


  if (type) {
    where.type = String(type);
  }

  
  if (year) {
    where.publishedYear = Number(year);
  }

  if (yearFrom || yearTo) {
    where.publishedYear = {
      ...(yearFrom && { gte: Number(yearFrom) }),
      ...(yearTo && { lte: Number(yearTo) }),
    };
  }

  
  if (search) {
    const q = String(search).trim();

    const isYearSearch = !isNaN(Number(q));

    where.OR = [
      {
        movieName: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        story: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        categories: {
          has: q,
        },
      },

    
      ...(isYearSearch
        ? [
            {
              publishedYear: Number(q),
            },
          ]
        : []),
    ];
  }

  /* ------------------ QUERY ------------------ */
  const [data, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      skip: (pg - 1) * lim,
      take: lim,
      orderBy: {
        [sortBy]: sortOrder === "asc" ? "asc" : "desc",
      },
      include: {
        cast: true,
        directors: true,
        producers: true,
        bookings: true,
        reviews: true,
      },
    }),

    prisma.movie.count({ where }),
  ]);

  return {
    meta: {
      page: pg,
      limit: lim,
      total,
      totalPages: Math.ceil(total / lim),
    },
    data,
  };}
const getMovieById=async(id:string)=>{return await prisma.movie.findUnique({where:{id},include:{cast:true,directors:true,producers:true,bookings:true,reviews:true}


})}
const deleteMovieById=async(id:string)=>{return await prisma.movie.delete({where:{id}})}
export const movieService={
    createMovie,
    getAllMovie,
    getMovieById,
    deleteMovieById
}