import SendMateService from "../src";
import dotenv from "dotenv";

dotenv.config();

const client = new SendMateService(
  process.env.SENDMATE_PUBLISHABLE_KEY || "YOUR_PUBLISHABLE_KEY",
  process.env.SENDMATE_SECRET_KEY || "YOUR_SECRET_KEY",
  process.env.SENDMATE_SANDBOX === "true"
);

export default client;
