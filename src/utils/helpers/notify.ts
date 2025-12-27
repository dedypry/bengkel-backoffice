import type { AxiosError } from "axios";

import { toast, type ExternalToast } from "sonner";

export const notify = (msg: string, data?: ExternalToast) => {
  toast.success("Success", {
    position: "top-right",
    description: msg,
    ...data,
    descriptionClassName: "!text-black",
  });
};

export const notifyError = (res: AxiosError) => {
  const msg = (res.response?.data as any).message || res;

  toast.error("Terjadi Kesalahan", {
    position: "top-right",
    style: { color: "red" },
    description: msg,
    descriptionClassName: "!text-black",
  });
};
