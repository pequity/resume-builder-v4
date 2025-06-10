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

// Version before the updateResume change

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

//     // ✅ Add this only block for `all` (DO NOT touch the rest)
//     all: {
//       $get: async () => {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_APP_URL}/api/document/all`,
//           {
//             method: "GET",
//             credentials: "include",
//           }
//         );

//         if (!res.ok) throw new Error("Failed to get documents");
//         return res;
//       },
//     },
//   },
// };

// lib/hono-rpc.ts
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

    // ✅ Fix for use-get-document-by-id.ts
    byId: {
      $get: async ({ documentId }: { documentId: string }) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/document/${documentId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch document");
        return res;
      },
    },

    // ✅ Fix for use-update-document.ts
    update: {
      $patch: async ({
        documentId,
        json,
      }: {
        documentId: string;
        json: Record<string, any>;
      }) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/document/update/${documentId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json),
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to update document");
        return res;
      },
    },

    // added to solve the use-get-document-by.id.ts error

    public: {
      byId: {
        $get: async ({ documentId }: { documentId: string }) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/document/public/doc/${documentId}`,
            {
              method: "GET",
            }
          );

          if (!res.ok) throw new Error("Failed to fetch public document");
          return res;
        },
      },
    },

    // added now

    trash: {
      all: {
        $get: async () => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/document/trash/all`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!res.ok) throw new Error("Failed to get trashed documents");
          return res;
        },
      },
    },

    // added now

    restore: {
      archive: {
        $patch: async ({
          json,
        }: {
          json: {
            documentId: string;
            status: "archived";
          };
        }) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/document/retore/archive`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(json),
              credentials: "include",
            }
          );

          if (!res.ok) throw new Error("Failed to restore document");
          return res;
        },
      },
    },
  },
};
