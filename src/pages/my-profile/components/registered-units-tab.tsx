import type { ReactNode } from "react";

import { Building2, Globe, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, Card, CardBody, Chip, Image } from "@heroui/react";

import { formatNPWP } from "@/components/forms/npwp-input";

type Props = {
  companies: any[];
  activeCompanyId?: number;
};

export default function RegisteredUnitsTab({
  companies,
  activeCompanyId,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4">
      {(companies || []).map((company: any) => (
        <Card key={company.id}>
          <CardBody className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-40 h-40 bg-gray-50 flex items-center justify-center border-r border-gray-100">
                {company.logo_url ? (
                  <Image
                    alt={company.name}
                    className="object-contain w-24 h-24"
                    src={company.logo_url}
                  />
                ) : (
                  <Building2 className="text-gray-200" size={40} />
                )}
              </div>
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-lg font-black uppercase text-gray-500">
                      {company.name}
                    </h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">
                      {company.slug}
                    </p>
                  </div>
                  {activeCompanyId === company.id && (
                    <Chip
                      className="text-white uppercase"
                      classNames={{
                        content: "font-bold",
                      }}
                      color="success"
                      radius="md"
                      size="sm"
                    >
                      {t("profile.active_company")}
                    </Chip>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <InfoItem
                    icon={<Phone size={12} />}
                    label={t("profile.contact")}
                    value={company.phone_number}
                  />
                  <InfoItem
                    icon={<Globe size={12} />}
                    label={t("common.email")}
                    value={company.email}
                  />
                  <InfoItem
                    fullWidth
                    icon={<MapPin size={12} />}
                    label={t("common.address")}
                    value={`${company.address?.title} ${company.address?.district || ""}, ${company.address?.city || ""}`}
                  />
                </div>

                {company.npwp && (
                  <Alert
                    classNames={{
                      title: "text-[10px] font-black text-gray-500 uppercase",
                      description: "text-[11px] font-bold text-gray-600",
                      iconWrapper: "text-primary rounded-md",
                    }}
                    description={formatNPWP(company.npwp)}
                    title={t("profile.npwp")}
                  />
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  fullWidth = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`${fullWidth ? "md:col-span-2" : ""} space-y-1`}>
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-[9px] font-black uppercase">{label}</span>
      </div>
      <p className="text-[11px] font-bold uppercase text-gray-700">
        {value || "-"}
      </p>
    </div>
  );
}
