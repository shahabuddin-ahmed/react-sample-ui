export const CAMPAIGN_STATUS = {
    SCHEDULED: "scheduled",
    SENDING: "sending",
    SENT: "sent",
    FAILED: "failed",
} as const;

export type CampaignStatus =
    (typeof CAMPAIGN_STATUS)[keyof typeof CAMPAIGN_STATUS];

export type Campaign = {
    _id: string;
    id: string;
    name: string;
    subject: string;
    body: string;
    scheduledTime?: string;
    status: CampaignStatus;
};
