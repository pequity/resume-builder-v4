import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
export const GET = handleAuth();

console.log("KINDE_ISSUER_URL:", process.env.KINDE_ISSUER_URL);
