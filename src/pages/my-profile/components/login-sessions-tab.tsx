import type { LoginSessionItem } from "@/utils/interfaces/ILoginSession";

import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  Globe,
  LogOut,
  Monitor,
  Smartphone,
  Tablet,
  Trash2,
} from "lucide-react";
import { Button, Card, CardBody, Chip } from "@heroui/react";

import LoginSessionsSkeleton from "./login-sessions-skeleton";

import { http } from "@/utils/libs/axios";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { forceLogout } from "@/utils/helpers/auth-session";

function getPlatformIcon(platform: string) {
  if (platform === "mobile") {
    return Smartphone;
  }

  if (platform === "tablet") {
    return Tablet;
  }

  return Monitor;
}

export default function LoginSessionsTab() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<LoginSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingAll, setRevokingAll] = useState(false);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    http
      .get("/user/sessions")
      .then(({ data }) => setSessions(data || []))
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  const revokeAll = async () => {
    setRevokingAll(true);
    http
      .post("/user/sessions/revoke-all")
      .then(({ data }) => {
        notify(data.message || t("profile.sessions_revoked_all"));
        forceLogout();
      })
      .catch((err) => notifyError(err))
      .finally(() => setRevokingAll(false));
  };

  const revokeOne = async (session: LoginSessionItem) => {
    setRevokingId(session.id);
    http
      .delete(`/user/sessions/${session.id}`)
      .then(({ data }) => {
        notify(data.message || t("profile.session_revoked"));
        if (data.is_current) {
          forceLogout();

          return;
        }
        void fetchSessions();
      })
      .catch((err) => notifyError(err))
      .finally(() => setRevokingId(null));
  };

  if (loading) {
    return <LoginSessionsSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
        <p className="text-[11px] font-medium text-gray-500 max-w-xl">
          {t("profile.login_devices_desc")}
        </p>
        <Button
          color="danger"
          isDisabled={sessions.length === 0}
          isLoading={revokingAll}
          size="sm"
          startContent={!revokingAll ? <LogOut size={16} /> : undefined}
          variant="flat"
          onPress={() =>
            confirmSweat(
              () => {
                void revokeAll();
              },
              {
                title: t("profile.sessions_revoke_all_title"),
                text: t("profile.sessions_revoke_all_text"),
                icon: "warning",
                confirmButtonText: t("profile.sessions_revoke_all_confirm"),
                cancelButtonText: t("cancel"),
              },
            )
          }
        >
          {t("profile.sessions_revoke_all")}
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center">
            <Monitor className="mx-auto mb-3 text-gray-300" size={40} />
            <p className="font-black uppercase text-sm text-gray-400">
              {t("profile.sessions_empty")}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="scrollbar-modern max-h-[420px] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-3">
            {sessions.map((session) => {
              const PlatformIcon = getPlatformIcon(session.platform);

              return (
                <Card key={session.id}>
                  <CardBody className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                          <PlatformIcon size={20} />
                        </div>
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black uppercase text-sm text-gray-600">
                              {session.device_label}
                            </p>
                            {session.is_current && (
                              <Chip
                                classNames={{ content: "font-bold uppercase" }}
                                color="success"
                                radius="md"
                                size="sm"
                                variant="flat"
                              >
                                {t("profile.session_current_device")}
                              </Chip>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold uppercase text-gray-400">
                            <span className="inline-flex items-center gap-1">
                              <Globe size={11} />
                              {session.ip_address}
                            </span>
                            <span>
                              {t("profile.session_last_active")}{" "}
                              {dayjs(session.last_used_at).format(
                                "DD MMM YYYY HH:mm",
                              )}
                            </span>
                            <span>
                              {t("profile.session_started")}{" "}
                              {dayjs(session.created_at).format("DD MMM YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        color="danger"
                        isLoading={revokingId === session.id}
                        size="sm"
                        startContent={
                          revokingId === session.id ? undefined : (
                            <Trash2 size={14} />
                          )
                        }
                        variant="light"
                        onPress={() =>
                          confirmSweat(
                            () => {
                              void revokeOne(session);
                            },
                            {
                              title: t("profile.session_revoke_title"),
                              text: t("profile.session_revoke_text"),
                              icon: "warning",
                              confirmButtonText: t(
                                "profile.session_revoke_confirm",
                              ),
                              cancelButtonText: t("cancel"),
                            },
                          )
                        }
                      >
                        {t("profile.session_revoke")}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
