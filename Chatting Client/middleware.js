import { NextResponse } from "next/server";

const onlyAuthNotExist = ["/sign-in", "/sign-up", "/forgot-password"];
const privateRoutes = ["/blogs", "/settings", "/product", "/cart"];

export async function middleware(request) {
  // const dispatch = useDispatch();
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  // console.log("accessToken from  middleware...: ", accessToken);

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRestrictedRoute = onlyAuthNotExist.includes(pathname);

  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
