// Tutorial

// import { hc } from "hono/client";
// import { AppType } from "@/app/api/[[...route]]/route";

// export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);

// export const api = client.api;

//

// Add Resume Working on Vercel

// "use client";
// export const api = {
//   document: {
//     create: {
//       $post: async ({
//         json,
//       }: {
//         json: {
//           title: string;
//           summary?: string | null;
//           status?: "archived" | "private" | "public";
//           themeColor?: string;
//           thumbnail?: string;
//           currentPosition?: number;
//         };
//       }) => {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_APP_URL}/api/document/create`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(json),
//             credentials: "include",
//           }
//         );

//         if (!res.ok) throw new Error("Failed to create document");
//         return res;
//       },
//     },
//   },
// };

//

"use client";

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

    // ✅ Add this only block for `all` (DO NOT touch the rest)
    all: {
      $get: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/document/all`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to get documents");
        return res;
      },
    },
  },
};
