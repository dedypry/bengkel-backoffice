/* eslint-disable import/order */
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

// Import HeroUI Components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Divider,
  Link,
} from "@heroui/react";

import { http } from "@/utils/libs/axios";
import GuestGuard from "@/utils/guard/guest-guard";
import { notifyError } from "@/utils/helpers/notify";
import Password from "@/components/password";

const formSchema = z.object({
  email: z
    .email({ message: "Format email tidak valid." })
    .min(1, { message: "Email wajib diisi." }),
  password: z
    .string({ message: "Password wajib diisi." })
    .min(1, { message: "Password wajib diisi." }),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    http
      .post("/auth/login", values)
      .then(({ data }) => {
        Cookies.set("token", data.access_token, {
          expires: 1,
          path: "/",
          sameSite: "strict",
        });
        navigate("/");
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <GuestGuard>
      <div className="flex items-center justify-center px-4">
        <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-2">
            <CardHeader className="flex flex-col items-start gap-1">
              <h1 className="text-xl font-bold">Masuk ke Akun</h1>
              <p className="text-gray-500 text-small">
                Masukkan email dan kata sandi Anda untuk mengakses panel admin
                bengkel.
              </p>
            </CardHeader>

            <CardBody className="flex flex-col gap-4">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.email?.message}
                    isInvalid={!!errors.email}
                    label="Email"
                    labelPlacement="outside"
                    placeholder="contoh@bengkel.com"
                    startContent={<Mail className="text-gray-400" size={18} />}
                    type="email"
                    variant="bordered"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Password
                    {...field}
                    errorMessage={errors.password?.message}
                    isInvalid={!!errors.password}
                    label="Kata Sandi"
                    labelPlacement="outside"
                    startContent={<Lock className="text-gray-400" size={18} />}
                    variant="bordered"
                  />
                )}
              />
              <Link className="text-xs flex justify-end cursor-pointer">
                Lupa Kata sandi ?
              </Link>
            </CardBody>

            <CardFooter className="flex flex-col gap-3">
              <Button
                fullWidth
                color="primary"
                isLoading={loading}
                type="submit"
              >
                Masuk
              </Button>

              <div className="relative flex items-center w-full py-2">
                <Divider className="flex-grow" />
                <span className="mx-2 text-xs text-default-400 uppercase">
                  Atau
                </span>
                <Divider className="flex-grow" />
              </div>

              <Button
                fullWidth
                startContent={<img alt="google" src="/google.png" width={16} />}
                type="button"
                variant="flat"
              >
                Masuk dengan Google
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </GuestGuard>
  );
}
