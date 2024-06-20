"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  encryptionKey,
  decryptData,
  isValidDate,
  isValidTime,
  isValidTheaterId,
  formatDateTime,
  encryptData,
} from "../../../../util/utilityFunction"; // Assuming these are TS-compatible
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserSelection {
  date: string;
  time: string;
  theaterId: string;
  movieData: { title: string; originalLanguage: string; id: string };
  theaterData: { theaterName: string; location: string };
}

interface SelectedSeat {
  type: "royal" | "executive";
  seatId: string;
  price: number; // Added price property
}

export default function SeatSelection() {
  const searchParams = useSearchParams();
  const tid = searchParams.get("tid") || "";
  const kid = searchParams.get("kid") || "";
  const router = useRouter();

  let userSelectionObj: UserSelection | null = null;
  try {
    userSelectionObj = JSON.parse(
      decryptData({ iv: tid, encryptedData: kid }, encryptionKey)
    ) as UserSelection;

    if (
      !isValidDate(userSelectionObj.date) ||
      !isValidTime(userSelectionObj.time) ||
      !isValidTheaterId(userSelectionObj.theaterId)
    ) {
      throw new Error("Invalid");
    }
  } catch (error) {
    console.error("Error decrypting data:", error);
    return (
      <div className="flex items-center justify-center center-content">
        <h1 className="text-4xl font-bold">Invalid URL</h1>
      </div>
    );
  }

  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const handleSeatClick = (seatId: string, type: "royal" | "executive") => {
    const price = type === "royal" ? 250 : 150;
    const isSeatSelected = selectedSeats.some(
      (seat) => seat.seatId === seatId && seat.type === type
    );

    if (isSeatSelected) {
      // Deselect if already selected
      setSelectedSeats((prevSeats) =>
        prevSeats.filter(
          (seat) => !(seat.seatId === seatId && seat.type === type)
        )
      );
    } else if (selectedSeats.length < 5) {
      // Select if less than 3 seats are selected
      setSelectedSeats((prevSeats) => [...prevSeats, { type, seatId, price }]);
    } else if (selectedSeats.length === 5) {
      toast("Maximum 5 seat selection are allowed.");
    }
  };
  const totalPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
//   console.log(selectedSeats);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 container mx-auto py-8 relative">
      <div className="bg-white p-8 rounded shadow-md max-w-5xl flex flex-col">
        <div className="w-full mb-4 text-center">
          <p className="text-gray-600 font-semibold">
            {(userSelectionObj?.theaterData as any)?.theaterName},{" "}
            {(userSelectionObj?.theaterData as any)?.location} |{" "}
            {formatDateTime(
              `${userSelectionObj.date}, ${userSelectionObj.time}`
            )}
          </p>
        </div>

        {/* Back to Movie Details Button */}
        <div className="w-full mb-4">
          <Link
            href={`/movies/${(userSelectionObj?.movieData as any).id}/book`}
            className="text-blue-500 hover:underline text-black"
          >
            ← Back to Movie Details
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {(userSelectionObj?.movieData as any)?.title} (
          {(userSelectionObj?.movieData as any)?.originalLanguage})
        </h1>
        <h1 className="text-2xl font-semibold mb-4 underline text-center">
          Rs. 250 ROYAL
        </h1>
        <div className="grid grid-cols-19 gap-2 mb-6">
          {/* ... (ROYALE seat rows) ... */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex space-x-2">
              <span
                className="font-semibold w-6 text-center"
                style={{ paddingTop: "4px" }}
              >
                {String.fromCharCode(65 + index)}
              </span>
              {[...Array(20)].map((_, seatIndex) => (
                <button
                  key={seatIndex}
                  className={`w-8 h-8 rounded-full ${
                    selectedSeats.some(
                      (seat) =>
                        seat.seatId ===
                          `${String.fromCharCode(65 + index)}${
                            seatIndex + 1
                          }` && seat.type === "royal"
                    )
                      ? "bg-green-500"
                      : "bg-white border border-green-300"
                  }`}
                  onClick={() =>
                    handleSeatClick(
                      `${String.fromCharCode(65 + index)}${seatIndex + 1}`,
                      "royal"
                    )
                  }
                >
                  {seatIndex + 1}
                </button>
              ))}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-semibold mb-4 text-center underline">
          Rs. 150 EXECUTIVE
        </h1>
        <div className="grid grid-cols-19 gap-2 mb-6">
          {/* ... (EXECUTIVE seat rows) ... */}
          {[...Array(10)].map((_, index) => (
            <div key={index} className="flex space-x-2">
              <span
                className="font-semibold w-6 text-center"
                style={{ paddingTop: "4px" }}
              >
                {String.fromCharCode(65 + index)}
              </span>
              {[...Array(20)].map((_, seatIndex) => (
                <button
                  key={seatIndex}
                  className={`w-8 h-8 rounded-full ${
                    selectedSeats.some(
                      (seat) =>
                        seat.seatId ===
                          `${String.fromCharCode(65 + index)}${
                            seatIndex + 1
                          }` && seat.type === "executive"
                    )
                      ? "bg-green-500"
                      : "bg-white border border-green-300"
                  }`}
                  onClick={() =>
                    handleSeatClick(
                      `${String.fromCharCode(65 + index)}${seatIndex + 1}`,
                      "executive"
                    )
                  }
                >
                  {seatIndex + 1}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <div className="text-center mb-10">Screen this way please!</div>

          <div className="flex justify-center space-x-4 mb-10">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-green-500 rounded-full mr-2"></div>
              <span>Available</span>
            </div>

            <div className="flex items-center">
              <div className="w-4 h-4 bg-black border border-gray-300 rounded-full mr-2"></div>
              <span>Sold</span>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <button
            type="button"
            className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none dark:focus:ring-blue-800 ${
              selectedSeats.length > 0
                ? "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed" // Gray when disabled
            }`}
            onClick={
              selectedSeats.length > 0
                ? () => {
                    const { iv, encryptedData } = encryptData(
                        selectedSeats,
                        encryptionKey
                      );
                    const pid = `${iv}AEIOU${encryptedData}`;
                    console.log('selectedSeats', selectedSeats)
                    console.log('pid', pid)
                    router.push(
                        `/movies/${userSelectionObj?.movieData?.id}/book/payment?tid=${tid}&kid=${kid}&pid=${pid}`
                      );
                  }
                : undefined
            }
          >
            PAY Rs.{totalPrice}
          </button>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
        }}
      />
    </div>
  );
}
