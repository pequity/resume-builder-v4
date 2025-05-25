// import { hc } from "hono/client";
// import { AppType } from "@/app/api/[[...route]]/route";

// export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);

// export const api = client.api;

"use client";

import { hc } from "hono/client";

// 👇 Define just the `document.create` shape you need
export const api = {
  document: {
    create: {
      $post: async ({
        json,
      }: {
        json: {
          title: string;
          summary?: string | null;
          status?: "archived" | "private" | "public";
          themeColor?: string;
          thumbnail?: string;
          currentPosition?: number;
        };
      }) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/document/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json),
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to create document");
        return res;
      },
    },
  },
};
