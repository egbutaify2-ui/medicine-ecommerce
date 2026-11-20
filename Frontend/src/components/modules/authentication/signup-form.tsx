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

const formSchema = z.object({ name: z.string().min(1, "Name is required"), email: z.email(), password: z.string().min(8, "Password must be at least 8 characters") });
const googleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleGoogleLogin = async () => {
    try { await authClient.signIn.social({ provider: "google", callbackURL: window.location.origin + callbackUrl }); }
    catch { toast.error("Google sign-up is not configured for this preview."); }
  };

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating your account...");
      try {
        const { error } = await authClient.signUp.email(value);
        if (error) { toast.error(error.message, { id: toastId }); return; }
        toast.success("Account created. You can now continue.", { id: toastId });
        router.push(callbackUrl);
        router.refresh();
      } catch { toast.error("Could not create the account. Please try again.", { id: toastId }); }
    },
  });

  return (
    <Card {...props}>
      <CardHeader className="space-y-1 text-center"><CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create your account</CardTitle><CardDescription className="text-gray-500 dark:text-gray-400">Join <span className="font-semibold">MediStore</span> and start shopping</CardDescription></CardHeader>
      <form className="px-5" onSubmit={(event) => { event.preventDefault(); form.handleSubmit(); }}>
        <FieldGroup>
          <form.Field name="name">{(field) => { const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <Field data-invalid={invalid}><FieldLabel htmlFor={field.name}>Name</FieldLabel><Input id={field.name} name={field.name} autoComplete="name" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />{invalid && <FieldError errors={field.state.meta.errors} />}</Field>; }}</form.Field>
          <form.Field name="email">{(field) => { const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <Field data-invalid={invalid}><FieldLabel htmlFor={field.name}>Email</FieldLabel><Input id={field.name} name={field.name} type="email" autoComplete="email" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />{invalid && <FieldError errors={field.state.meta.errors} />}</Field>; }}</form.Field>
          <form.Field name="password">{(field) => { const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <Field data-invalid={invalid}><FieldLabel htmlFor={field.name}>Password</FieldLabel><Input id={field.name} name={field.name} type="password" autoComplete="new-password" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />{invalid && <FieldError errors={field.state.meta.errors} />}</Field>; }}</form.Field>
        </FieldGroup>
        <CardContent className="mt-5 space-y-3 px-0">
          <Button type="submit" className="w-full">Sign Up</Button>
          {googleAuthEnabled && <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>Continue with Google</Button>}
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">Already have an account? <Link href="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">Login</Link></p>
          <p className="text-center text-xs text-muted-foreground">New accounts are customer accounts. Seller access is assigned by the store administrator.</p>
        </CardContent>
      </form>
    </Card>
  );
}
