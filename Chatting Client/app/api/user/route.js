import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const apiUrl = process.env.API_URL;
  const accessToken = cookieStore.get("accessToken")?.value;
  // console.log("user cookies:: ", accessToken);

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const apiResponse = await fetch(`${apiUrl}/api/v1/auth/profile`, {
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await apiResponse.json();
    // console.log("data from api route in my profile...", data);

    if (!data.success) {
      return NextResponse.json(
        { success: false, message: "Failed to get user" },
        { status: 400 }
      );
    }

    const result = data || {};
    // console.log("data from api route in my profile...", result);
    return NextResponse.json({
      success: true,
      user: result,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get user" },
      { status: 500 }
    );
  }
}
