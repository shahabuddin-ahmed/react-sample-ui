import axios from "axios";
import { Alert } from "../misc/common";
import Manifest from "../manifest";

const apiHost = Manifest.apiHost;

// default axios headers
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers["Accept"] = "*/*";

export function getAccessToken() {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken ? JSON.parse(accessToken) : null;
}

export async function LOGIN(payload: any) {
    try {
        const result = await axios.post(`${apiHost}/user/login`, payload);

        if (result.data) {
            if (result.data.data?.accessToken) {
                localStorage.setItem(
                    "accessToken",
                    JSON.stringify(result.data.data.accessToken)
                );
            }
            return result.data;
        } else {
            Alert("Oops!", "Something went wrong!", "error");
        }
    } catch (error: any) {
        if (error?.response) {
            return {
                status: "failed",
                message: error.response.data?.message ?? "Login failed",
            };
        } else {
            console.error("Error: ", error);
        }
    }
}

export async function REGISTER(payload: any) {
    try {
        const result = await axios.post(`${apiHost}/user/signup`, payload);

        if (result && result.data) {
            return result.data;
        } else {
            Alert("Oops!", "Something went wrong!", "error");
        }
    } catch (error: any) {
        if (error?.response) {
            return {
                status: "failed",
                message: error.response.data?.message ?? "Registration failed",
            };
        } else {
            console.error("Error: ", error);
        }
    }
}
