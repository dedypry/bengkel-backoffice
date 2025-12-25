/* eslint-disable no-console */
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { http } from "@/utils/libs/axios";
import GuestGuard from "@/utils/guard/guest-guard";

const formSchema = z.object({
  email: z
    .email({ message: "Format email tidak valid." })
    .min(1, { message: "Email wajib diisi." }),
  password: z.string().min(1, { message: "Password wajib diisi." }),
});

export default function Login() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "admin@bengkel.com",
      password: "password123",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    http
      .post("/auth/login", values)
      .then(({ data }) => {
        console.log("DATA", data);
        Cookies.set("token", data.access_token, {
          expires: 1,
          path: "/",
          sameSite: "strict",
        });
        navigate("/");
      })
      .catch((err) => console.error(err));
  }

  return (
    <GuestGuard>
      <Form {...form}>
        <form
          className="w-full max-w-sm"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Masuk ke Akun</CardTitle>
              <CardDescription className="text-xs">
                Masukkan email dan kata sandi Anda untuk mengakses panel admin
                bengkel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="contoh@bengkel.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Kata Sandi</FormLabel>
                          <Link
                            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                            to="#"
                          >
                            Lupa kata sandi?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Masukkan kata sandi"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                className="w-full"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting ? "Sedang Masuk..." : "Masuk"}
              </Button>
              <div className="relative w-full my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Atau
                  </span>
                </div>
              </div>
              <Button className="w-full" type="button" variant="outline">
                Masuk dengan Google
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </GuestGuard>
  );
}
