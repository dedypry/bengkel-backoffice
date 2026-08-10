/* eslint-disable import/order */
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button, Card, CardBody, CardFooter, Input, Link } from "@heroui/react";

import { http } from "@/utils/libs/axios";
import GuestGuard from "@/utils/guard/guest-guard";
import { notifyError } from "@/utils/helpers/notify";
import { saveAuthSession } from "@/utils/helpers/auth-session";
import { disconnectPusher } from "@/utils/libs/pusher";
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
        disconnectPusher();
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
      <div className="space-y-6">
        <div className="space-y-1 text-left">
          <h2 className="text-2xl font-black uppercase text-slate-700">
            {t("auth.form_title")}
          </h2>
          <p className="text-sm font-medium text-slate-500">
            {t("auth.form_subtitle")}
          </p>
        </div>

        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <Card className="border border-slate-100 bg-white/90 p-2 shadow-lg backdrop-blur-sm">
            <CardBody className="flex flex-col gap-4 pt-6">
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
              <Link className="flex cursor-pointer justify-end text-xs">
                {t("auth.forgot_password")}
              </Link>
            </CardBody>

            <CardFooter className="flex flex-col gap-3 pb-6">
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
