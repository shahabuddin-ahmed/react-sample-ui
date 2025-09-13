// src/pages/Campaign/Details.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Container,
    Stack,
    Typography,
    Paper,
    Divider,
    Button,
    CircularProgress,
    Alert,
    Box,
    Tooltip,
    IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import campaignRequest from "../../requests/campaign";
import StatusChip from "./StatusChip";
import { CAMPAIGN_STATUS, type Campaign } from "../../types/campaign";

type ApiSuccess<T> = {
    code: "SUCCESS";
    message: string;
    response: T;
    errors: any[];
};

const formatDate = (iso?: string): string => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso!;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const CampaignDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [data, setData] = useState<Campaign | null>(null);
    const [status, setStatus] = useState<typeof CAMPAIGN_STATUS | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [statusLoading, setStatusLoading] = useState<boolean>(false);
    const [publishing, setPublishing] = useState<boolean>(false);
    const [err, setErr] = useState<string | null>(null);

    const canPublish = useMemo(
        () =>
            isAuthenticated &&
            data?.status?.toLowerCase?.() === CAMPAIGN_STATUS.SCHEDULED,
        [isAuthenticated, data]
    );

    const loadDetails = useCallback(async (): Promise<void> => {
        if (!id) return;
        setLoading(true);
        setErr(null);
        try {
            const res:
                | ApiSuccess<Campaign>
                | { status?: string; message?: string } =
                await campaignRequest.details(id);
            if ((res as ApiSuccess<Campaign>).code === "SUCCESS") {
                setData((res as ApiSuccess<Campaign>).response);
            } else {
                throw new Error(
                    (res as any)?.message || "Unexpected API response"
                );
            }
        } catch (e: any) {
            setErr(e?.message ?? "Failed to load details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    const loadStatus = useCallback(async (): Promise<void> => {
        if (!id) return;
        setStatusLoading(true);
        try {
            const res:
                | ApiSuccess<{ status: typeof CAMPAIGN_STATUS }>
                | ApiSuccess<typeof CAMPAIGN_STATUS>
                | { status?: string; message?: string } =
                await campaignRequest.status(id);

            let nextStatus: typeof CAMPAIGN_STATUS | undefined;
            if ((res as ApiSuccess<any>).code === "SUCCESS") {
                const r = (res as ApiSuccess<any>).response;
                nextStatus =
                    typeof r === "string"
                        ? (r as unknown as typeof CAMPAIGN_STATUS)
                        : (r?.status as typeof CAMPAIGN_STATUS);
            }
            if (nextStatus) {
                setStatus(nextStatus);
                setData((prev) =>
                    prev
                        ? {
                              ...prev,
                              status: nextStatus as unknown as Campaign["status"],
                          }
                        : prev
                );
            }
        } catch {
            // non-fatal
        } finally {
            setStatusLoading(false);
        }
    }, [id]);

    const publish = useCallback(async (): Promise<void> => {
        if (!id) return;
        setPublishing(true);
        try {
            const res: ApiSuccess<any> | { status?: string; message?: string } =
                await campaignRequest.publish(id); // POST /campaign/publish/:id
            if ((res as ApiSuccess<any>).code !== "SUCCESS") {
                throw new Error((res as any)?.message || "Publish failed");
            }
            await Promise.all([loadDetails(), loadStatus()]);
        } catch (e: any) {
            setErr(e?.message ?? "Publishing failed");
        } finally {
            setPublishing(false);
        }
    }, [id, loadDetails, loadStatus]);

    // initial load
    useEffect(() => {
        if (!isAuthenticated) {
            setErr("You must be logged in to view campaign details.");
            setLoading(false);
            return;
        }
        if (!id) {
            setErr("Invalid campaign id.");
            setLoading(false);
            return;
        }
        loadDetails().then(loadStatus);
    }, [isAuthenticated, id, loadDetails, loadStatus]);

    // auto-poll while SENDING
    useEffect(() => {
        const rawStatus = status ?? data?.status;
        const current =
            typeof rawStatus === "string" ? rawStatus.toLowerCase() : undefined;
        if (current === CAMPAIGN_STATUS.SENDING) {
            const t = setInterval(loadStatus, 5000);
            return () => clearInterval(t);
        }
        return;
    }, [status, data?.status, loadStatus]);

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
            >
                <Typography variant="h5" fontWeight={700}>
                    Campaign Details
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Back to list">
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/")}
                            color="inherit"
                        >
                            ← Back
                        </Button>
                    </Tooltip>
                    <Tooltip title="Refresh">
                        <span>
                            <IconButton
                                onClick={() => {
                                    loadDetails();
                                    loadStatus();
                                }}
                                aria-label="refresh"
                                disabled={loading}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Button
                        variant="contained"
                        onClick={publish}
                        disabled={!canPublish || publishing}
                    >
                        {publishing ? "Publishing…" : "Publish"}
                    </Button>
                </Stack>
            </Stack>

            {loading && (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ py: 6 }}
                >
                    <CircularProgress />
                </Box>
            )}

            {!loading && err && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {err}
                </Alert>
            )}

            {!loading && !err && data && (
                <Paper variant="outlined" sx={{ p: 3 }}>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ mr: 1 }}
                            >
                                {data.name}
                            </Typography>
                            <StatusChip
                                status={
                                    typeof (status ?? data.status) === "string"
                                        ? String(status ?? data.status)
                                        : ""
                                }
                            />
                        </Stack>
                        <Divider />
                        <Stack spacing={1}>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Subject
                            </Typography>
                            <Typography>{data.subject}</Typography>
                        </Stack>
                        <Stack spacing={1}>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Body
                            </Typography>
                            <Typography whiteSpace="pre-wrap">
                                {data.body}
                            </Typography>
                        </Stack>
                        <Stack spacing={1}>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Scheduled Time
                            </Typography>
                            <Typography>
                                {formatDate(data.scheduledTime)}
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
            )}
        </Container>
    );
};

export default CampaignDetails;
