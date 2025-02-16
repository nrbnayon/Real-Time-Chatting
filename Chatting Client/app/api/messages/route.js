// app/api/messages/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

async function fetchWithAuth(url, options = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred while fetching the data.",
    }));
    throw new Error(
      error.message || "An error occurred while fetching the data."
    );
  }

  return response.json();
}

// POST new message
export async function POST(request) {
  try {
    const body = await request.json();
    const data = await fetchWithAuth("/messages", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ data: data.data });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}

// GET search messages
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const chatId = searchParams.get("chatId");

  if (!query || !chatId) {
    return NextResponse.json(
      { error: "Query and chatId are required for search" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchWithAuth(
      `/messages/search?query=${query}&chatId=${chatId}`
    );
    return NextResponse.json({ data: data.data });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to search messages" },
      { status: 500 }
    );
  }
}

// // app/api/messages/route.js
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

// async function fetchWithAuth(url, options = {}) {
//   const cookieStore = cookies();
//   const token = await cookieStore.get("accessToken")?.value;

//   const headers = {
//     "Content-Type": "application/json",
//     ...options.headers,
//   };

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   const response = await fetch(`${API_BASE_URL}${url}`, {
//     ...options,
//     headers,
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({
//       message: "An error occurred while fetching the data.",
//     }));
//     throw new Error(
//       error.message || "An error occurred while fetching the data."
//     );
//   }

//   return response.json();
// }

// // POST new message
// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const data = await fetchWithAuth("/messages", {
//       method: "POST",
//       body: JSON.stringify(body),
//     });
//     return NextResponse.json({ data: data.data });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message || "Failed to send message" },
//       { status: 500 }
//     );
//   }
// }

// // GET search messages
// export async function GET(request) {
//   const searchParams = request.nextUrl.searchParams;
//   const query = searchParams.get("query");
//   const chatId = searchParams.get("chatId");

//   if (!query || !chatId) {
//     return NextResponse.json(
//       { error: "Query and chatId are required for search" },
//       { status: 400 }
//     );
//   }

//   try {
//     const data = await fetchWithAuth(
//       `/messages/search?query=${query}&chatId=${chatId}`
//     );
//     return NextResponse.json({ data: data.data });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message || "Failed to search messages" },
//       { status: 500 }
//     );
//   }
// }
