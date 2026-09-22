import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user && user.email === process.env.ADMIN_EMAIL;
  const isAdminRoute = request.nextUrl.pathname.startsWith("/8392-admin");
  const isAdminLoginRoute = request.nextUrl.pathname.startsWith("/8392-admin/login");

  if (isAdminRoute) {
    if (!user) {
      if (!isAdminLoginRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/8392-admin/login";
        return NextResponse.redirect(url);
      }
    } else {
      if (!isAdmin) {
        // Logged in as normal user, but trying to access admin route
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      } else {
        // Logged in as admin
        if (isAdminLoginRoute) {
          const url = request.nextUrl.clone();
          url.pathname = "/8392-admin";
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
