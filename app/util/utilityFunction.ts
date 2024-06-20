import dayjs from "dayjs";
import crypto from "crypto";

export const getFormattedDateString = (
  date: string | Date,
  format = "YYYY-MM-DD"
) => {
  return dayjs(date).format(format);
};

export const getNextSevenDays = () => {
  const days = [];
  for (let i = 1; i <= 7; i++) {
    days.push(dayjs().add(i, "day").toDate());
  }
  return days;
};

export const getFormattedDate = (
  releaseDate: string,
  format?: "Y" | "M" | "D"
) => {
  const date = new Date(parseInt(releaseDate, 10));

  switch (format) {
    case "Y":
      return date.getFullYear().toString();
    case "M":
      return date.toLocaleDateString("en-US", { month: "long" });
    case "D":
      return date.toLocaleDateString("en-US", { day: "numeric" });
    default:
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  }
};

// Ensure correct key length for AES-256
function generateKey(inputKey: string): Buffer {
  const hash = crypto.createHash("sha256");
  hash.update(inputKey);
  return hash.digest(); // Returns a 32-byte buffer
}

// Updated encryption method using generateKey function to handle key validation
export function encryptData(
  data: any,
  inputKey: string
): { iv: string; encryptedData: string } {
  const algorithm = "aes-256-cbc";
  const keyBuffer = generateKey(inputKey);
  const iv = crypto.randomBytes(16);

  // Convert the object to a JSON string before encryption
  const dataString = JSON.stringify(data);
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);

  let encryptedData = cipher.update(dataString, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return { iv: iv.toString("hex"), encryptedData };
}

// Updated decryption method using generateKey to handle key validation
export function decryptData(
  data: { iv: string; encryptedData: string },
  inputKey: string
): string {
  const algorithm = "aes-256-cbc";
  const keyBuffer = generateKey(inputKey);
  const iv = Buffer.from(data.iv, "hex");
  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);

  let decryptedData = decipher.update(data.encryptedData, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");

  return decryptedData;
}

export const encryptionKey = "4BapYcqY1HdQO12ZawiconnyXo6IaVqO";

export const isValidDate = (dateStr: string): boolean => {
  const selectedDate = new Date(dateStr);
  const currentDate = new Date();
  return !isNaN(selectedDate.getTime()) && selectedDate >= currentDate;
};

export const isValidTime = (timeStr: string): boolean => {
  return /^(0?[1-9]|1[0-2])(:[0-5][0-9])?(am|pm)$/i.test(timeStr);
};

export const isValidTheaterId = (theaterId: any): boolean => {
  return Number.isInteger(theaterId);
};

export function formatDateTime(inputDateTime: string): string {
  const days: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [date, time] = inputDateTime.split(", ");
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.match(/\d+/g) || [];

  const formattedDate: Date = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );
  const dayOfWeek: string = days[formattedDate.getDay()];
  const monthName: string = months[formattedDate.getMonth()];
  const formattedTime: string = `${(hour || "").padStart(2, "0")}:${(
    minute || ""
  ).padStart(2, "0")} ${time.slice(-2)}`;

  return `${dayOfWeek}, ${day} ${monthName}, ${formattedTime}`;
}
