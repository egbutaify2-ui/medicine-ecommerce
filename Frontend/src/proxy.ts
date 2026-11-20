import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { userService } from "@/services/user.service";
import { Roles } from "@/constants/roles";

function dashboardForRole(role?: string) {
  if (role === Roles.admin) return "/admin-dashboard";
  if (role === Roles.seller) return "/seller-dashboard";
  return "/customer-dashboard";
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const { data } = await userService.getSession();
  const user = data?.user;
  const role = user?.role as string | undefined;

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const destination = dashboardForRole(role);
  const isAdminArea = pathname.startsWith("/admin-dashboard");
  const isSellerArea = pathname.startsWith("/seller-dashboard");
  const isCustomerArea = pathname.startsWith("/customer-dashboard");

  if (isAdminArea && role !== Roles.admin) return NextResponse.redirect(new URL(destination, request.url));
  if (isSellerArea && role !== Roles.seller && role !== Roles.admin) return NextResponse.redirect(new URL(destination, request.url));
  if (isCustomerArea && role !== "CUSTOMER" && role !== Roles.admin) return NextResponse.redirect(new URL(destination, request.url));
  if (pathname === "/dashboard") return NextResponse.redirect(new URL(destination, request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/admin-dashboard/:path*", "/seller-dashboard/:path*", "/customer-dashboard/:path*"],
};
