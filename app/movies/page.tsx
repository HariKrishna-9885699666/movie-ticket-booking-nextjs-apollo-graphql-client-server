"use client";
import { gql, useQuery } from "@apollo/client";
import { ThreeDots } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { getFormattedDate } from "../util/utilityFunction";

const GET_TOP_MOVIES = gql`
  query {
    topMovies(limit: 100) {
      id
      title
      releaseDate
      posterPath1
    }
  }
`;

export default function Movies() {
  const { loading, error, data } = useQuery(GET_TOP_MOVIES);

  if (error) {
    toast.error("Error fetching movies. Please try again later.");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Top 100 Movies</h1>

      {loading && (
        <div className="flex items-center justify-center h-screen">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {data?.topMovies?.map((movie: any) => (
          <div
            key={movie.id}
            className="rounded-lg shadow-md overflow-hidden mb-10"
            style={{ width: "300px", height: "550px" }}
          >
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`} // Link to dynamic movie page
              className="rounded-lg shadow-md overflow-hidden mb-10"
              style={{ width: "300px", height: "550px" }}
            >
              <img
                src={movie.posterPath1}
                alt={movie.title}
                width={300} // Adjust width as needed
                height={500} // Adjust height as needed
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold line-clamp-2 text-center" style={{fontSize: '25px'}}>
                  {movie.title}
                </h2>
                <h2 className="text-lg font-semibold line-clamp-2 text-center" style={{fontSize: '12px'}}>
                  {getFormattedDate(movie.releaseDate)}
                </h2>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Toaster />
    </div>
  );
}
