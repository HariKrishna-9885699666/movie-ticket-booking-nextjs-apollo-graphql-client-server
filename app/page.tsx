"use client";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { gql, useQuery } from "@apollo/client";
import { ThreeDots } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import { getFormattedDate } from "./util/utilityFunction";

const GET_TOP_MOVIES = gql`
  query {
    getRandomMovies(limit: 10) {
      id
      title
      budget
      releaseDate
      backdropPath1
      productionCompanyImagePath1
      credits {
        # Access the credits relationship
        profilePath1
        name
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_TOP_MOVIES);

  if (error) {
    toast.error("Error fetching movies. Please try again later.");
  }
  return (
    <div className="flex items-center justify-center">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white/50 flex items-center justify-center">
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

      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        interval={3000}
        transitionTime={1000}
        dynamicHeight={true}
      >
        {data?.getRandomMovies?.map((item: any, index: number) => {
          const releaseDate = getFormattedDate(item.releaseDate);

          return (
            <div key={index} className="relative">
              <img
                src={item.backdropPath1}
                alt={`Slide ${index + 1}`}
                style={{ height: "85vh" }}
              />
              <div className="absolute top-8 right-8 text-right backdrop-filter backdrop-blur-lg p-4 rounded-lg">
                <p className="text-lg md:text-xl text-gray-300">
                  Release Date:
                </p>
                <p className="text-lg md:text-xl text-gray-300">
                  {releaseDate}
                </p>
              </div>

              {/* Centered Title */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-lg">
                  <h2 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {item.title}
                  </h2>
                </div>
              </div>

              {/* Production Company Image (Bottom Right) */}
              {item.productionCompanyImagePath1 && (
                <div className="absolute bottom-8 right-8">
                  <img
                    src={item.productionCompanyImagePath1}
                    alt={item.productionCompanyName}
                    className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg"
                  />
                </div>
              )}

              {/* Credits (Top Left) */}
              <div className="absolute top-8 left-8 flex flex-col space-y-2">
                {item.credits
                  .slice(0, 2)
                  .map(
                    (credit: {
                      id: number;
                      profilePath1: string;
                      name: string;
                    }) => (
                      <div key={credit.name} className="flex items-center">
                        <img
                          src={credit.profilePath1}
                          alt={credit.name}
                          className=" md:w-10 md:h-50 rounded-full mr-2"
                        />
                        <span className="text-sm md:text-base text-white font-semibold">
                          {credit.name}
                        </span>
                      </div>
                    )
                  )}
              </div>
            </div>
          );
        })}
      </Carousel>
      <Toaster />
    </div>
  );
}
