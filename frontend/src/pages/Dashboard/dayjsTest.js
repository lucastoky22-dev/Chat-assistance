import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const rawDate = "2026-01-10 16:43:16.26+03";

const formattedDate = dayjs(rawDate)
  .format("DD/MM/YYYY HH:mm:ss");

console.log("formattedDate : " + formattedDate);