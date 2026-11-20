"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({ email: z.email(), password: z.string().min(8, "Password must be at least 8 characters long") });
const googleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleGoogleLogin = async () => {
    try { await authClient.signIn.social({ provider: "google", callbackURL: window.location.origin + callbackUrl }); }
    catch { toast.error("Google sign-in is not configured for this preview."); }
  };

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Signing in...");
      try {
        const { error } = await authClient.signIn.email(value);
        if (error) { toast.error(error.message, { id: toastId }); return; }
        toast.success("Signed in successfully.", { id: toastId });
        router.push(callbackUrl);
        router.refresh();
      } catch { toast.error("Sign-in failed. Please try again.", { id: toastId }); }
    },
  });

  return (
    <Card {...props}>
      <CardHeader className="space-y-2 text-center"><CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</CardTitle><CardDescription className="text-gray-500 dark:text-gray-400">Sign in to continue to <span className="font-semibold">MediStore</span></CardDescription></CardHeader>
      <form className="px-5" onSubmit={(event) => { event.preventDefault(); form.handleSubmit(); }}>
        <FieldGroup>
          <form.Field name="email">{(field) => { const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <Field data-invalid={invalid}><FieldLabel htmlFor={field.name}>Email</FieldLabel><Input id={field.name} name={field.name} type="email" autoComplete="email" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />{invalid && <FieldError errors={field.state.meta.errors} />}</Field>; }}</form.Field>
          <form.Field name="password">{(field) => { const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <Field data-invalid={invalid}><FieldLabel htmlFor={field.name}>Password</FieldLabel><Input id={field.name} name={field.name} type="password" autoComplete="current-password" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />{invalid && <FieldError errors={field.state.meta.errors} />}</Field>; }}</form.Field>
        </FieldGroup>
        <CardContent className="mt-5 space-y-3 px-0">
          <Button type="submit" className="w-full">Sign In</Button>
          {googleAuthEnabled && <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>Continue with Google</Button>}
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">Don't have an account? <Link href="/signup" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">Sign Up</Link></p>
        </CardContent>
      </form>
    </Card>
  );
}
