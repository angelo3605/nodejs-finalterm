import z from "zod";
import { useLogin } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GoogleLogo from "@/assets/oauth-icons/google.svg?react";
import FacebookLogo from "@/assets/oauth-icons/facebook.svg?react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import Logo from "@/assets/logo.svg?react";

const loginSchema = z.object({
  email: z.email().min(1).trim(),
  password: z.string().min(1),
});

function OauthButton({ provider, name, Icon, onCallback }) {
  return (
    <Button variant="outline" className="w-full">
      <Icon /> Login with {name}
    </Button>
  );
}

export function LoginPage() {
  const { mutate: login } = useLogin();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => login(data);

  return (
    <div className="min-h-screen flex justify-center items-center bg-leaves">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Logo className="size-[5rem] -mt-[4rem] mx-auto" />
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>Please login with an account to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email address" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Your password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Link className="inline-block text-sm hover:underline">Forgot password?</Link>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:-translate-y-0.5 hover:shadow/20">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex-col [&>*]:w-full gap-6">
          <div className="flex items-center gap-2">
            <Separator className="!shrink-1" />
            <span className="text-sm shrink-0">or</span>
            <Separator className="!shrink-1" />
          </div>

          <div className="space-y-2">
            <OauthButton provider="google" name="Google" Icon={GoogleLogo} />
            <OauthButton provider="facebook" name="Facebook" Icon={FacebookLogo} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
