// "use client";
// import { toast } from "@/hooks/use-toast";
// import { api } from "@/lib/hono-rpc";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { InferRequestType, InferResponseType } from "hono";

// type ResponseType = InferResponseType<typeof api.document.create.$post>;
// type RequestType = InferRequestType<typeof api.document.create.$post>["json"];

// const useCreateDocument = () => {
//   const queryClient = useQueryClient();

//   const mutation = useMutation<ResponseType, Error, RequestType>({
//     mutationFn: async (json) => {
//       const response = await api.document.create.$post({ json });
//       return await response.json();
//     },
//     onSuccess: (response) => {
//       console.log(response);
//       queryClient.invalidateQueries({ queryKey: ["documents"] });
//     },
//     onError: () => {
//       toast({
//         title: "Error",
//         description: "Failed to create document",
//         variant: "destructive",
//       });
//     },
//   });

//   return mutation;
// };

// export default useCreateDocument;

"use client";

import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/hono-rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RequestType = {
  title: string;
  summary?: string | null;
  status?: "archived" | "private" | "public";
  themeColor?: string;
  thumbnail?: string;
  currentPosition?: number;
};

type ResponseType = {
  success: "ok";
  data: {
    id: string;
    title: string;
    // Add any other returned fields
  };
};

const useCreateDocument = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await api.document.create.$post({ json });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

export default useCreateDocument;
