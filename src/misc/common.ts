import swal from "sweetalert";
import { toast, type ToastPosition, type TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
