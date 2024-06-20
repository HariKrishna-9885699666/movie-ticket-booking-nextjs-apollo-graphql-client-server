"use client";
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { ThreeDots } from "react-loader-spinner";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  getFormattedDateString,
  getNextSevenDays,
  encryptionKey,
  encryptData,
} from "../../../util/utilityFunction";
import { useRouter } from "next/navigation";

const GET_MOVIE_THEATERS = gql`
  query GetMovieTheaters($movieId: Int!) {
    movie(id: $movieId) {
      id
      title
      originalLanguage
      theaters {
        id
        theaterName
        location
        mTicket
        foodCourt
        parking
        timings
      }
    }
  }
`;

const BookingPageContent = ({ params }: { params: { movieId: string } }) => {
  const movieId = Number(params.movieId);
  // Calculate current date plus one day
  const currentDate = new Date();
  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1); // Set to current date + 1 day

  const [selectedDate, setSelectedDate] = useState<Date>(nextDay);
  const [selectedTimes, setSelectedTimes] = useState<Record<number, string>>(
    {}
  );
  const router = useRouter();

  const handleTimeSelection = (theater: { id: number }, time: string) => {
    const theaterId = theater.id;
    setSelectedTimes((prevTimes) => ({
      ...prevTimes,
      [theaterId]: time,
    }));

    // Navigate to the seat selection page with the selected date, time, and theater ID
    if (time) {
      const userSelectedItems = {
        time,
        theaterId,
        date: getFormattedDateString(selectedDate),
        movieData: data?.movie,
        theaterData: theater,
      };
      const { iv, encryptedData } = encryptData(
        userSelectedItems,
        encryptionKey
      );

      router.push(
        `/movies/${movieId}/book/seat-selection?tid=${iv}&kid=${encryptedData}`
      );
    } else {
      console.warn("No time selected");
    }
  };

  const { loading, error, data } = useQuery(GET_MOVIE_THEATERS, {
    variables: { movieId },
  });

  if (error) {
    toast.error("Error fetching movie theaters. Please try again later.");
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

  const theaters = data?.movie?.theaters || [];

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 min-h-screen">
      {/* Back to Movie Details Button */}
      <div className="w-full mb-4">
        <Link
          href={`/movies/${movieId}`}
          className="text-blue-500 hover:underline text-black"
        >
          ← Back to Movie Details
        </Link>
      </div>

      {/* Date Picker */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">
          {data?.movie?.title} ({data?.movie?.originalLanguage})
        </h1>
        <div className="flex space-x-2">
          {getNextSevenDays().map((date) => (
            <button
              key={date.toISOString()} // Use date.toISOString() to generate a unique key
              className={`px-4 py-2 rounded-lg ${
                date.toISOString().slice(0, 10) ===
                selectedDate.toISOString().slice(0, 10)
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedDate(date)}
            >
              {getFormattedDateString(date, "ddd, MMM D")}
            </button>
          ))}
        </div>
      </div>

      {/* Theaters List */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Available Theaters</h2>
        {theaters.length === 0 ? (
          <p>No theaters available for this movie.</p>
        ) : (
          theaters.map((theater: any) => (
            <div
              key={theater.id}
              className="mb-4 p-4 bg-white rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold">{theater.theaterName}</h3>
              <p className="text-lg">{theater.location}</p>
              <div className="flex space-x-4 mt-2">
                {theater.mTicket && (
                  <span className="badge bg-green-500 text-white px-2 py-1 rounded">
                    M-Ticket
                  </span>
                )}
                {theater.foodCourt && (
                  <span className="badge bg-yellow-500 text-white px-2 py-1 rounded">
                    Food Court
                  </span>
                )}
                {theater.parking && (
                  <span className="badge bg-blue-500 text-white px-2 py-1 rounded">
                    Parking
                  </span>
                )}
              </div>
              <div className="flex space-x-2 mt-2">
                {theater.timings.map((time: string, index: number) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-lg ${
                      selectedTimes[theater.id] === time
                        ? "bg-blue-700 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleTimeSelection(theater, time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingPageContent;
