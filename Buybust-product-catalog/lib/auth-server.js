// lib/getUserFromCookie.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function getUserFromCookie() {
  // Make sure this function is executed SERVER-SIDE
  const cookieStore = await cookies(); // Note: cookies() can be sync or async depending on Next version
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // contains user data
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}
