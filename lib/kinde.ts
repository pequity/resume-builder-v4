import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

type Env = {
  Variables: {
    // ❌ Original problematic code (commented out)
    // user: KindeUser<Record<string, any>>;

    // ✅ Fixed version: Use 'unknown' instead of 'any' for better type safety
    user: KindeUser<Record<string, unknown>>;
  };
};

export const getAuthUser = createMiddleware<Env>(async (c, next) => {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
      throw new HTTPException(401, {
        res: c.json({ error: "unauthorized" }),
      });
    }
    const user = await getUser();
    c.set("user", user);
    await next();
  } catch (error) {
    console.log(error);
    throw new HTTPException(401, {
      res: c.json({ error: "unauthorized" }),
    });
  }
});
