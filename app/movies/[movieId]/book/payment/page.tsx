"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  encryptionKey,
  decryptData,
  isValidDate,
  isValidTime,
  isValidTheaterId,
  formatDateTime,
} from "../../../../util/utilityFunction";

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

export default function Payment() {
  const searchParams = useSearchParams();
  const tid = searchParams.get("tid") || "";
  const kid = searchParams.get("kid") || "";
  const pid = searchParams.get("pid") || "";
  const seatSelectionEncryptArr = pid?.split("AEIOU") || [];

  let userSelectionObj: UserSelection | null = null;
  let seatSelectionObj: SelectedSeat | null = null;
  try {
    userSelectionObj = JSON.parse(
      decryptData({ iv: tid, encryptedData: kid }, encryptionKey)
    ) as UserSelection;
    seatSelectionObj = JSON.parse(
      decryptData(
        {
          iv: seatSelectionEncryptArr[0],
          encryptedData: seatSelectionEncryptArr[1],
        },
        encryptionKey
      )
    ) as SelectedSeat;
    console.log("seatSelectionObj", seatSelectionObj);

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

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 container mx-auto py-8 relative">
      <div className="bg-white p-8 rounded shadow-md max-w-5xl flex flex-col">
        {/* Back to Movie Details Button */}
        <div className="w-full mb-4">
          <Link
            href={`/movies/${
              (userSelectionObj?.movieData as any).id
            }/book/seat-selection?tid=${tid}&kid=${kid}`}
            className="text-blue-500 hover:underline text-black"
          >
            ← Back to Movie Details
          </Link>
        </div>
        <h1 className="text-2xl font-semibold mb-4 underline text-center">
          BOOKING SUMMARY
        </h1>
        <div className="w-full mb-4 text-center">
          <p className="text-gray-600 font-semibold">
            {(userSelectionObj?.theaterData as any)?.theaterName},{" "}
            {(userSelectionObj?.theaterData as any)?.location} |{" "}
            {formatDateTime(
              `${userSelectionObj.date}, ${userSelectionObj.time}`
            )}
          </p>
        </div>

        <h1 className="text-3xl font-bold mb-2">
          {(userSelectionObj?.movieData as any)?.title} (
          {(userSelectionObj?.movieData as any)?.originalLanguage})
        </h1>





    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">BOOKING SUMMARY</h2>

      {/* Seat Details Section */}
      <div className="mb-4">
        {/* {seats.map((seat) => (
          <div key={seat.type} className="flex justify-between items-center">
            <span className="font-medium">{seat.type}</span>
            <span>
              {seat.price.toFixed(2)} x {seat.count}
            </span>
          </div>
        ))} */}
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-2">
        <span className="font-medium">Sub total</span>
        <span className="font-semibold">Rs.100</span>
      </div>

      {/* Internet Handling Fees and Breakup (Collapsible) */}
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <span>Internet handling fees</span>
          <span className="font-semibold">Rs. 100</span>
        </div>
        {/* ... (Toggle tax breakup details) ... */}
      </div>

      {/* Payment Gateway Charges and Breakup (Collapsible) */}
      {/* ... (Similar structure to Internet handling fees) ... */}

      

      {/* Amount Payable */}
      <div className="flex justify-between items-center border-t border-gray-200 pt-4">
        <span className="font-bold">Amount Payable</span>
        <span className="text-xl font-bold">Rs. 200</span>
      </div>
    </div>
  
      </div>
    </div>
  );
}
