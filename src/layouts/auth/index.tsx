import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Chip } from "@heroui/react";

import AuthLogo from "@/components/auth-logo";
import { useAuthBranding } from "@/hooks/use-auth-branding";

export default function AuthLayout() {
  const { t } = useTranslation();
  const branding = useAuthBranding();
  const heroTagsRaw = t("auth.hero_tags", { returnObjects: true });
  const heroTags = Array.isArray(heroTagsRaw) ? heroTagsRaw : [];

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-center lg:px-10 lg:py-12 xl:px-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-pulse" />
          <div className="absolute right-[-4rem] top-[18%] h-80 w-80 rounded-full bg-white/10 blur-[90px]" />
          <div className="absolute bottom-[-3rem] left-[20%] h-64 w-64 rounded-full bg-black/10 blur-[70px]" />
          <div className="absolute bottom-[28%] left-[8%] h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute right-[15%] top-[55%] h-28 w-28 rounded-full bg-teal-200/20 blur-2xl" />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-light.png")`,
          }}
        />

        <div className="relative z-10 max-w-lg space-y-8">
          <AuthLogo
            logoUrl={branding.logoUrl}
            name={branding.name}
            size={48}
            variant="on-primary"
          />

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">
              {branding.name ?? t("auth.brand_name")}
            </p>
            <h1 className="text-4xl font-black uppercase leading-[1.05] text-white xl:text-6xl">
              {t("auth.hero_title")}
            </h1>
            <div className="space-y-1">
              <p className="text-lg font-bold uppercase tracking-wide text-white/90">
                {t("auth.hero_line_1")}
              </p>
              <p className="text-base font-medium text-white/75">
                {t("auth.hero_line_2")}
              </p>
            </div>
            <p className="text-sm font-semibold italic text-white/85">
              {t("auth.hero_highlight")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {heroTags.map((tag) => (
              <Chip
                key={tag}
                classNames={{
                  base: "border border-white/25 bg-white/15 backdrop-blur-sm",
                  content: "font-bold uppercase text-[10px] text-white",
                }}
                radius="sm"
                size="sm"
                variant="flat"
              >
                {tag}
              </Chip>
            ))}
          </div>
        </div>

        <p className="relative z-10 mt-16 text-[11px] font-medium uppercase tracking-widest text-white/50">
          {t("auth.brand_footer")}
        </p>
      </div>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] p-4 sm:p-6 lg:min-h-0 lg:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-12 top-[-10%] h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-[-5%] left-[-5%] h-64 w-64 rounded-full bg-teal-300/15 blur-[80px]" />
          <div className="absolute right-[10%] top-[35%] h-48 w-48 rounded-full bg-indigo-200/20 blur-[70px]" />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-light.png")`,
          }}
        />

        <div className="relative z-10 w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
