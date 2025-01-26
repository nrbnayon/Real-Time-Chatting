(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root of the server]__28202e._.js", {

"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[project]/middleware.js [middleware] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/api/server.js [middleware] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware] (ecmascript)");
;
const publicRoutes = [
    "/",
    "/register",
    "/login"
];
async function middleware(request) {
    const { pathname } = request.nextUrl;
    if (publicRoutes.includes(pathname)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const accessToken = request.cookies.get("accessToken")?.value;
    const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
    const user = GenerateSlug(decodedToken.name);
    if (!accessToken) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", request.url));
    }
    try {
        // Fetch vendor profile using the access token
        const apiUrl = process.env.JOB_PORTAL_API_URL;
        const response = await fetch(`${apiUrl}/api/v1/vendor/vendor-profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            cache: "no-store"
        });
        // Handle failed profile fetch
        if (!response.ok) {
            console.error(`Failed to fetch vendor profile: ${response.status}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", request.url));
        }
        // Parse vendor profile data
        const { data: profileData } = await response.json();
        const vendorName = GenerateSlug(profileData?.result?.data?.vendorName);
        // Validate vendor name exists
        if (!vendorName) {
            console.warn("Vendor name not found in profile data");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", request.url));
        }
        // Validate vendor route access
        const pathSegments = pathname.split("/").filter(Boolean);
        const firstSegment = pathSegments[0];
        // Redirect to correct vendor-specific route if needed
        if (firstSegment !== vendorName) {
            const additionalPath = pathSegments.slice(1).join("/");
            const redirectUrl = additionalPath ? `/${vendorName}/${additionalPath}` : `/${vendorName}`;
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(redirectUrl, request.url));
        }
    } catch (error) {
        console.error("Error processing middleware:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", request.url));
    }
    // Allow access to the requested route
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)"
    ]
}; // import { NextResponse } from "next/server";
 // const onlyAuthNotExist = ["/sign-in", "/sign-up", "/forgot-password"];
 // const privateRoutes = ["/blogs", "/settings", "/product", "/welcome"];
 // export async function middleware(request) {
 //   // const dispatch = useDispatch();
 //   const { pathname } = request.nextUrl;
 //   const accessToken = request.cookies.get("accessToken")?.value;
 //   // console.log("accessToken from  middleware...: ", accessToken);
 //   const isPrivateRoute = privateRoutes.some((route) =>
 //     pathname.startsWith(route)
 //   );
 //   const isAuthRestrictedRoute = onlyAuthNotExist.includes(pathname);
 //   if (isPrivateRoute && !accessToken) {
 //     return NextResponse.redirect(new URL("/", request.url));
 //   }
 //   return NextResponse.next();
 // }
 // export const config = {
 //   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
 // };
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__28202e._.js.map