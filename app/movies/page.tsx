"use client";
import { gql, useQuery } from "@apollo/client";
import { ThreeDots } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { getFormattedDate } from "../util/utilityFunction";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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

      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
  {data?.topMovies?.map((movie: any) => (
    <div
      key={movie.id}
      className="rounded-lg shadow-md relative"
      style={{ width: "300px", height: "600px" }} // Setting a fixed size for the movie card
    >
      <Link href={`/movies/${movie.id}`}>
        <img
          src={movie.posterPath1}
          alt={movie.title}
          width={300}
          height={600}
          className="object-cover w-full h-full"
        />
      </Link>
      <div className="absolute inset-0 flex flex-col items-center justify-end">
        <div className="p-4 bg-black bg-opacity-60 w-full text-white text-center">
          <h2 className="text-lg font-semibold line-clamp-2" style={{ fontSize: "25px" }}>
            {movie.title}
          </h2>
          <h2 className="text-lg font-semibold line-clamp-2" style={{ fontSize: "12px" }}>
            {getFormattedDate(movie.releaseDate)}
          </h2>
          <button
            type="button"
            className="bg-green-700 hover:bg-green-800 text-white font-medium rounded-full px-5 py-2.5 my-3"
            onClick={() => {
              router.push(`/movies/${movie.id}/book`);
            }}
          >
            BOOK TICKETS
          </button>
        </div>
      </div>
    </div>
  ))}
</div> */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {data?.topMovies?.map((movie: any) => (
          <div
            key={movie.id}
            className="rounded-lg shadow-md relative"
            style={{ width: "300px", height: "600px" }}
          >
            <Link href={`/movies/${movie.id}`}>
              <img
                src={movie.posterPath1}
                alt={movie.title}
                width={300}
                height={600}
                className="object-cover w-full h-full"
              />
            </Link>
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end">
              {/* Move the button outside of the link */}
              <button
                type="button"
                className="bg-green-700 hover:bg-green-800 text-white font-medium rounded-full px-5 py-2.5 my-3"
                onClick={() => {
                  router.push(`/movies/${movie.id}/book`);
                }}
              >
                BOOK TICKETS
              </button>

              <div className="p-4 bg-black bg-opacity-60 w-full text-white text-center">
                <h2
                  className="text-lg font-semibold line-clamp-2"
                  style={{ fontSize: "25px" }}
                >
                  {movie.title}
                </h2>
                <h2
                  className="text-lg font-semibold line-clamp-2"
                  style={{ fontSize: "12px" }}
                >
                  {getFormattedDate(movie.releaseDate)}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Toaster />
    </div>
  );
}
