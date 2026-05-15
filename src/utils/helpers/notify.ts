import Swal, { type SweetAlertIcon, type SweetAlertOptions } from "sweetalert2";
import Cookies from "js-cookie";

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
  let msg: any = (res.response?.data as any).message || res;

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

  if (res.response?.status === 402) {
    const errors: any[] = res.response.data.data;

    Object.keys(errors).forEach((key: any) => {
      Toast.fire({
        icon: "error",
        title: errors[key][0],
      });
    });
  } else {
    Toast.fire({
      icon: "error",
      title: msg,
    });
  }

  if (res.response?.status === 401) {
    Cookies.remove("token");
    window.location.href = "/login";
  }
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
