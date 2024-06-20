// app/movie/[id].tsx
"use client";
import { gql, useQuery } from "@apollo/client";
import { ThreeDots } from "react-loader-spinner";
import toast from "react-hot-toast";
import Link from "next/link";
import { getFormattedDate } from "../../util/utilityFunction";

const GET_MOVIE_DETAILS = gql`
  query GetMovieDetails($movieId: Int!) {
    movie(id: $movieId) {
      id
      title
      budget
      originalCountry
      originalLanguage
      overview
      posterPath1
      backdropPath1
      productionCompanyName
      productionCompanyImagePath1
      releaseDate
      runTime
      spokenLanguages
      tagLine
      credits {
        name
        profilePath1
        characterName
        cast
      }
    }
  }
`;

interface Credit {
  name: string;
  profilePath1: string;
  cast: number;
  characterName: string;
}

interface Props {
  data: {
    movie: {
      credits: Credit[];
    };
  };
  type: string; // You can refine this type further based on your application
  filterValue: number;
}

const CreditsList: React.FC<Props> = ({ data, type, filterValue }) => (
  <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
    <h2 className="text-2xl font-bold mb-2 underline">{type}</h2>
    <ul className="list-none mb-4">
      {data.movie.credits
        .filter((credit) => credit.cast === filterValue)
        .map((credit, index) => (
          <li key={index} className="mb-4 flex items-center">
            <img
              src={credit.profilePath1 || "https://via.placeholder.com/64"}
              alt={credit.name}
              className="w-20 h-22 rounded-full mr-4"
            />
            <div>
              <span className="text-lg font-bold">{credit.characterName}</span>
              <p>{credit.name}</p>
            </div>
          </li>
        ))}
    </ul>
  </div>
);

export default function MovieDetails({
  params,
}: {
  params: { movieId: string };
}) {
  const movieId = Number(params.movieId);

  const { loading, error, data } = useQuery(GET_MOVIE_DETAILS, {
    variables: { movieId },
  });

  if (error) {
    toast.error("Error fetching movie details. Please try again later.");
  }

  if (loading)
    return (
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
    );

  return (
    <div
      className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 flex flex-wrap min-h-screen"
      style={{
        backgroundImage: `url("${data?.movie?.backdropPath1}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Back to Movies Button */}
      <div className="w-full mb-4">
        {" "}
        {/* Full width for button */}
        <Link
          href="/movies"
          className="text-blue-500 hover:underline text-black"
        >
          ← Back to Movies
        </Link>
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col items-center">
        <img
          src={data.movie.posterPath1}
          alt="Movie Poster"
          className="rounded-lg shadow-md w-full"
        />

        {/* Center the button */}
        <div className="w-full flex justify-center mt-4">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 underline"
          >
            <Link
              href={`/movies/${movieId}/book`}
              className="text-blue-500 hover:underline text-white"
            >
              Book Tickets
            </Link>
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-2/3 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-lg text-white">
        <h1 className="text-6xl font-bold mb-2">
          {data.movie.title} ({getFormattedDate(data.movie.releaseDate, "Y")})
        </h1>
        <p className="text-lg mb-4">{data.movie.overview}</p>
        <p className="text-lg mb-4">Tag line: {data.movie.tagLine}</p>
        <ul className="list-none mb-4">
          <li className="mb-2">
            <span className="text-lg font-bold">Director:</span> Director Name
          </li>
          <li className="mb-2">
            <span className="text-lg font-bold">Release Date:</span>{" "}
            {getFormattedDate(data.movie.releaseDate)}
          </li>
          {data.movie.budget > 0 && (
            <li className="mb-2">
              <span className="text-lg font-bold">Budget:</span>{" "}
              {data.movie.budget / 1000000} million(s)
            </li>
          )}
          <li className="mb-2">
            <span className="text-lg font-bold">Original Country:</span>{" "}
            {data.movie.originalCountry}
          </li>
          <li className="mb-2">
            <span className="text-lg font-bold">Original Language:</span>{" "}
            {data.movie.originalLanguage}
          </li>
          <li className="mb-2">
            <span className="text-lg font-bold">Production Company Name:</span>{" "}
            {data.movie.productionCompanyName}
          </li>
          <li className="mb-2">
            <span className="text-lg font-bold">Run Time:</span>{" "}
            {data.movie.runTime} (mins)
          </li>
          <li className="mb-2">
            <span className="text-lg font-bold">Spoken Languages:</span>{" "}
            {data.movie.spokenLanguages}
          </li>
        </ul>
        <div className="flex flex-wrap mb-4">
          <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
            <CreditsList data={data} type="Cast" filterValue={1} />
          </div>
          <div className="w-full lg:w-1/2">
            <CreditsList data={data} type="Crew" filterValue={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
