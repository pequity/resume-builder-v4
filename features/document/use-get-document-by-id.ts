// "use client";
// import { api } from "@/lib/hono-rpc";
// import { useQuery } from "@tanstack/react-query";

// export const useGetDocument = (documentId: string) => {
//   const query = useQuery({
//     queryKey: ["documentId", documentId],
//     queryFn: async () => {
//       const endpoint = api.document[":documentId"];

//       const response = await endpoint.$get({
//         param: {
//           documentId: documentId,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to get document");
//       }

//       const { data, success } = await response.json();
//       return { data, success };
//     },
//     retry: 3,
//   });
//   return query;
//   // enabled: false;
// };

// export default useGetDocument;

"use client";
import { api } from "@/lib/hono-rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetDocument = (documentId: string) => {
  const query = useQuery({
    queryKey: ["documentId", documentId],
    queryFn: async () => {
      const response = await api.document.byId.$get({ documentId });

      const { data, success } = await response.json();
      return { data, success };
    },
    retry: 3,
  });
  return query;
};

export default useGetDocument;
