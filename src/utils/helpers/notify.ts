import Swal, { type SweetAlertIcon, type SweetAlertOptions } from "sweetalert2";

export const notify = (msg: string, icon?: SweetAlertIcon) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  Toast.fire({
    icon: icon ?? "success",
    title: msg,
  });
};

export const notifyError = (res: any) => {
  const msg = (res.response?.data as any).message || res;

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  Toast.fire({
    icon: "error",
    title: msg,
  });
};

export const confirmSweat = (
  callback: () => void,
  option?: SweetAlertOptions,
) => {
  Swal.fire({
    theme: "material-ui",
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
