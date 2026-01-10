import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Typography,
} from "@mui/joy";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";

import { http } from "@/utils/libs/axios";
import GuestGuard from "@/utils/guard/guest-guard";
import Password from "@/components/password";
import { notifyError } from "@/utils/helpers/notify";

const formSchema = z.object({
  email: z
    .email({ message: "Format email tidak valid." })
    .min(1, { message: "Email wajib diisi." }),
  password: z
    .string({ message: "Password wajib diisi." })
    .min(1, { message: "Password wajib diisi." }),
});

export default function Login() {
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
      // email: "admin@bengkel.com",
      // password: "password123",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
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
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <GuestGuard>
      <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full">
          <CardContent>
            <Typography fontSize={18} fontWeight={700}>
              Masuk ke Akun
            </Typography>
            <Typography fontSize={12}>
              Masukkan email dan kata sandi Anda untuk mengakses panel admin
              bengkel.
            </Typography>
          </CardContent>
          <CardContent sx={{ gap: 3, mt: 2 }}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="contoh@bengkel.com"
                    startDecorator={<Mail />}
                    {...field}
                  />
                  <FormHelperText>{errors.email?.message}</FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={!!errors.password}>
                  <FormLabel className="flex justify-between w-full">
                    <span>Kata Sandi</span>
                    <Link>Lupa kata sandi?</Link>
                  </FormLabel>
                  <Password {...field} startDecorator={<Lock />} />
                  <FormHelperText>{errors.password?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </CardContent>
          <CardActions sx={{ flexDirection: "column" }}>
            <Button fullWidth disabled={loading} type="submit">
              {loading ? "Sedang Masuk..." : "Masuk"}
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
            <Button fullWidth type="button" variant="outlined">
              Masuk dengan Google
            </Button>
          </CardActions>
        </Card>
      </form>
    </GuestGuard>
  );
}
