// src/pages/Campaign/List.tsx
import React, { useEffect, useState, type JSX } from "react";
import {
    Container,
    Box,
    Stack,
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import campaignRequest from "../../requests/campaign";

type Campaign = {
    _id: string;
    id: string;
    name: string;
    subject: string;
    body: string;
    scheduledTime?: string;
    status: string;
};

type ApiSuccess = {
    code: "SUCCESS";
    message: string;
    response: Campaign[];
    errors: any[];
};

const CampaignList: React.FC = () => {
    const { isAuthenticated } = useAuth();

    const [rows, setRows] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [err, setErr] = useState<string | null>(null);

    const formatDate = (iso?: string): string => {
        if (!iso) return "—";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso!;
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
            d.getDate()
        )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const statusChip = (status: string): JSX.Element => {
        const map: Record<
            string,
            {
                label: string;
                color:
                    | "default"
                    | "success"
                    | "warning"
                    | "error"
                    | "primary"
                    | "secondary"
                    | "info";
            }
        > = {
            sent: { label: "SENT", color: "success" },
            running: { label: "RUNNING", color: "warning" },
            failed: { label: "FAILED", color: "error" },
            draft: { label: "DRAFT", color: "default" },
        };
        const meta = map[status?.toLowerCase?.()] ?? {
            label: status?.toUpperCase?.() || "—",
            color: "default",
        };
        return <Chip size="small" label={meta.label} color={meta.color} />;
    };

    const fetchData = async (): Promise<void> => {
        setLoading(true);
        setErr(null);
        try {
            const data: ApiSuccess | { status?: string; message?: string } =
                await campaignRequest.list();

            if (
                (data as ApiSuccess)?.code === "SUCCESS" &&
                Array.isArray((data as ApiSuccess).response)
            ) {
                setRows((data as ApiSuccess).response);
            } else {
                throw new Error(
                    (data as any)?.message || "Unexpected API response"
                );
            }
        } catch (e: any) {
            setErr(e?.message ?? "Failed to load campaigns");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchData();
        else {
            setRows([]);
            setLoading(false);
            setErr("You must be logged in to view campaigns.");
        }
    }, [isAuthenticated]);

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
            >
                <Typography variant="h5" fontWeight={700}>
                    Campaigns
                </Typography>

                <Stack direction="row" spacing={1}>
                    <Tooltip title="Refresh">
                        <span>
                            <IconButton
                                onClick={fetchData}
                                aria-label="refresh"
                                disabled={!isAuthenticated || loading}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={RouterLink}
                        to="/campaigns/new"
                        disabled={!isAuthenticated}
                    >
                        New Campaign
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

            {!loading && !err && rows.length === 0 && (
                <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                    <Typography>No campaigns yet.</Typography>
                    <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={RouterLink}
                        to="/campaigns/new"
                        disabled={!isAuthenticated}
                    >
                        Create your first campaign
                    </Button>
                </Paper>
            )}

            {!loading && !err && rows.length > 0 && (
                <Paper variant="outlined">
                    <Table size="small" aria-label="campaigns table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Scheduled</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right" width={120} />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((c) => (
                                <TableRow key={c.id || c._id} hover>
                                    <TableCell>
                                        <Typography fontWeight={600}>
                                            {c.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{c.subject}</TableCell>
                                    <TableCell>
                                        {formatDate(c.scheduledTime)}
                                    </TableCell>
                                    <TableCell>
                                        {statusChip(c.status)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            component={RouterLink}
                                            to={`/campaign/${c.id || c._id}`}
                                        >
                                            Details ▸
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Container>
    );
};

export default CampaignList;
