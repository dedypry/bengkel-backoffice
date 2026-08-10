/* eslint-disable import/order */
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

// Import HeroUI Components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Link,
} from "@heroui/react";

import { http } from "@/utils/libs/axios";
import GuestGuard from "@/utils/guard/guest-guard";
import { notifyError } from "@/utils/helpers/notify";
import { saveAuthSession } from "@/utils/helpers/auth-session";
import Password from "@/components/password";

export default function LoginPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formSchema = useMemo(
    () =>
      z.object({
        username: z
          .string({ message: t("auth.validation.username_required") })
          .min(1, { message: t("auth.validation.username_required") }),
        password: z
          .string({ message: t("auth.validation.password_required") })
          .min(1, { message: t("auth.validation.password_required") }),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
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
        saveAuthSession(data.session_id);
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
              <h1 className="text-xl font-bold">{t("auth.login_title")}</h1>
              <p className="text-gray-500 text-small">
                {t("auth.login_subtitle")}
              </p>
            </CardHeader>

            <CardBody className="flex flex-col gap-4">
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.username?.message}
                    isInvalid={!!errors.username}
                    label={t("auth.username_label")}
                    labelPlacement="outside"
                    placeholder={t("auth.username_placeholder")}
                    startContent={<Mail className="text-gray-400" size={18} />}
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
                    label={t("auth.password_label")}
                    labelPlacement="outside"
                    startContent={<Lock className="text-gray-400" size={18} />}
                    variant="bordered"
                  />
                )}
              />
              <Link className="text-xs flex justify-end cursor-pointer">
                {t("auth.forgot_password")}
              </Link>
            </CardBody>

            <CardFooter className="flex flex-col gap-3">
              <Button
                fullWidth
                color="primary"
                isLoading={loading}
                type="submit"
              >
                {t("auth.login_button")}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </GuestGuard>
  );
}
