import type { AxiosError } from "axios";

import Swal, { type SweetAlertOptions } from "sweetalert2";
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

export const confirmSweat = (
  callback: () => void,
  option?: SweetAlertOptions,
) => {
  Swal.fire({
    title: "Apakah anda yakin?",
    text: "Data yang dihapus tidak dapat dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#168BAB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
    ...option,
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};
