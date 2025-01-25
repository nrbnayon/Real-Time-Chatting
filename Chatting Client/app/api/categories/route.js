// app/api/categories/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const apiUrl = process.env.API_URL;
  try {
    const url = `${apiUrl}/api/v1/category`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("categories data", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
