import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    BACKEND_URL: z.url().default("http://localhost:5000"),
    FRONTEND_URL: z.url().default("http://localhost:3000"),
    API_URL: z.url().default("http://localhost:5000"),
    AUTH_URL: z.url().default("http://localhost:5000"),
    PUBLIC_BACKEND_URL: z.url().default("http://localhost:5000"),
  },
  client: {
    NEXT_PUBLIC_TEST: z.string().default("local"),
    NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: z.enum(["true", "false"]).default("false"),
    NEXT_PUBLIC_DEMO_MODE: z.enum(["true", "false"]).default("false"),
  },
  runtimeEnv: {
    BACKEND_URL: process.env.BACKEND_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    API_URL: process.env.API_URL,
    AUTH_URL: process.env.AUTH_URL,
    PUBLIC_BACKEND_URL: process.env.PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_TEST: process.env.NEXT_PUBLIC_TEST,
    NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED,
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  },
});
