import axios, { type AxiosInstance } from "axios";
import { Alert } from "../misc/common";
import Manifest from "../manifest";
import { getAccessToken } from "./auth";

class CampaignRequest {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: Manifest.apiHost,
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
            },
        });

        // Add interceptor to attach token
        this.client.interceptors.request.use((config) => {
            const token = getAccessToken();
            if (token) {
                (config.headers as any) = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
            return config;
        });
    }

    public async create(payload: any) {
        try {
            const result = await this.client.post("/campaign/create", payload);
            return result.data;
        } catch (error: any) {
            return this.handleError(error, "Campaign creation failed");
        }
    }

    public async list() {
        try {
            const result = await this.client.get("/campaign/list");
            return result.data;
        } catch (error: any) {
            return this.handleError(error, "Fetching campaign list failed");
        }
    }

    public async details(id: string) {
        try {
            const result = await this.client.get(`/campaign/details/${id}`);
            return result.data;
        } catch (error: any) {
            return this.handleError(error, "Fetching campaign details failed");
        }
    }

    public async status(id: string) {
        try {
            const result = await this.client.get(`/campaign/${id}/status`);
            return result.data;
        } catch (error: any) {
            return this.handleError(error, "Fetching campaign status failed");
        }
    }

    public async publish(id: string) {
        try {
            const result = await this.client.get(`/campaign/publish/${id}`);
            return result.data;
        } catch (error: any) {
            return this.handleError(error, "Publishing campaign failed");
        }
    }

    private handleError(error: any, fallbackMsg: string) {
        if (error?.response) {
            return {
                status: "failed",
                message: error.response.data?.message ?? fallbackMsg,
            };
        } else {
            console.error("Error: ", error);
            Alert("Oops!", fallbackMsg, "error");
        }
    }
}

const campaignRequest = new CampaignRequest();

export default campaignRequest;
