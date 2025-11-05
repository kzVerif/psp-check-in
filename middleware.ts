import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // ถ้าไม่ login → redirect มาที่นี่
  },
});

// ✅ กำหนดว่า path ไหนบังคับ login บ้าง
export const config = {
  // matcher: ["/:path*", "/profile/:path*", "/admin/:path*"],
  matcher: ["/zones/:path*","/beacons/:path*","/schedules/:path*","/devices/:path*","/checkins/:path*",],
};
