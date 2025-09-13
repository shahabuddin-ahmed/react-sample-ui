// src/components/Campaign/StatusChip.tsx
import React, { type FC } from "react";
import { Chip } from "@mui/material";
import { CAMPAIGN_STATUS } from "../../types/campaign";

interface StatusChipProps {
    status: string;
}

const StatusChip: FC<StatusChipProps> = ({ status }) => {
    const map: Record<
        string,
        { label: string; color: "default" | "success" | "warning" | "error" }
    > = {
        [CAMPAIGN_STATUS.SCHEDULED]: { label: "Scheduled", color: "default" },
        [CAMPAIGN_STATUS.SENDING]: { label: "Sending", color: "warning" },
        [CAMPAIGN_STATUS.SENT]: { label: "Sent", color: "success" },
        [CAMPAIGN_STATUS.FAILED]: { label: "Failed", color: "error" },
    };

    const key = status?.toLowerCase?.() as keyof typeof CAMPAIGN_STATUS;
    const meta = map[key] ?? { label: status || "—", color: "default" };

    return <Chip size="small" label={meta.label} color={meta.color} />;
};

export default StatusChip;
