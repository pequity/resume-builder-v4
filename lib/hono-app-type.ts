import type { ClientRequest } from "hono/client";

export type AppType = ClientRequest<{
  api: {
    document: {
      create: {
        $post: {
          input: {
            json: {
              title: string;
              summary?: string | null;
              status?: "archived" | "private" | "public";
              themeColor?: string;
              thumbnail?: string;
              currentPosition?: number;
            };
          };
          output: {
            success: string;
            data: unknown;
          };
          status: 200;
        };
      };
    };
  };
}>;
