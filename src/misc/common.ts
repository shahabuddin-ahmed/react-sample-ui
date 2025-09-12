import swal from "sweetalert";
import { toast, type ToastPosition, type TypeOptions } from "material-react-toastify";

/**
 * Show a SweetAlert modal
 * @param title - alert title
 * @param msg - alert message
 * @param type - one of "success" | "error" | "warning" | "info"
 * @param time - auto close time (ms)
 */
export function Alert(
  title: string,
  msg: string,
  type: "success" | "error" | "warning" | "info",
  time: number = 5000
): void {
  swal({
    title,
    text: msg,
    icon: type,
    buttons: undefined,
    timer: time,
  });
}

/**
 * Show a toast notification
 * @param msg - message text
 * @param type - toast type ("info", "success", "warning", "error", "default")
 * @param time - auto close time (ms)
 * @param position - toast position
 */
export const Notify = (
  msg: string,
  type: TypeOptions = "info",
  time: number = 1500,
  position: ToastPosition = "top-right"
): void => {
  toast(msg, {
    position,
    autoClose: time,
    type,
  });
};
