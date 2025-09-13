// src/pages/Campaign/Create.tsx
import React, { useMemo, useState } from "react";
import {
    Container,
    Paper,
    Stack,
    Typography,
    TextField,
    Button,
    Alert,
    MenuItem,
} from "@mui/material";
import { Formik, Form, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import campaignRequest from "../../requests/campaign";
import { Notify } from "../../misc/common";

type CreateValues = {
    name: string;
    subject: string;
    body: string;
    scheduledTime: string; // "YYYY-MM-DD"
    status: "scheduled" | "draft" | "running" | "sent" | "failed";
};

type ApiSuccess<T> = {
    code: "SUCCESS";
    message: string;
    response: T;
    errors: any[];
};

// Adjust this if your API returns a different shape
type CreatedCampaign = {
    id?: string;
    _id?: string;
    name: string;
    subject: string;
    body: string;
    scheduledTime: string;
    status: string;
};

const validationSchema = Yup.object({
    name: Yup.string().trim().required("Name is required"),
    subject: Yup.string().trim().required("Subject is required"),
    body: Yup.string().trim().required("Body is required"),
    scheduledTime: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
        .required("Scheduled date is required"),
    status: Yup.mixed<CreateValues["status"]>()
        .oneOf(["scheduled", "draft", "running", "sent", "failed"])
        .required("Status is required"),
});

const initialValues: CreateValues = {
    name: "",
    subject: "",
    body: "",
    scheduledTime: "",
    status: "scheduled",
};

const CampaignCreate: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [submitErr, setSubmitErr] = useState<string | null>(null);
    const statuses = useMemo(
        () => ["scheduled", "draft", "running", "sent", "failed"] as const,
        []
    );

    const handleSubmit = async (
        values: CreateValues,
        _helpers: FormikHelpers<CreateValues>
    ): Promise<void> => {
        setSubmitErr(null);
        try {
            const res:
                | ApiSuccess<CreatedCampaign>
                | { status?: string; message?: string } =
                await campaignRequest.create(values);

            if ((res as ApiSuccess<CreatedCampaign>)?.code === "SUCCESS") {
                const created = (res as ApiSuccess<CreatedCampaign>).response;
                Notify("Campaign created", "success");
                const id = created?.id || created?._id;
                if (id) {
                    navigate(`/campaign/${id}`);
                } else {
                    navigate("/");
                }
            } else {
                throw new Error(
                    (res as any)?.message || "Campaign creation failed"
                );
            }
        } catch (e: any) {
            setSubmitErr(e?.message ?? "Failed to create campaign");
            Notify(e?.message ?? "Failed to create campaign", "error");
        }
    };

    if (!isAuthenticated) {
        return (
            <Container maxWidth="md" sx={{ py: 3 }}>
                <Alert severity="error">
                    You must be logged in to create a campaign.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                    Create Campaign
                </Typography>

                {submitErr && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {submitErr}
                    </Alert>
                )}

                <Formik<CreateValues>
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        isSubmitting,
                    }) => (
                        <Form noValidate>
                            <Stack spacing={2}>
                                <TextField
                                    name="name"
                                    label="Name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.name && errors.name)}
                                    helperText={
                                        touched.name && errors.name
                                            ? errors.name
                                            : ""
                                    }
                                    fullWidth
                                />

                                <TextField
                                    name="subject"
                                    label="Subject"
                                    value={values.subject}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                        touched.subject && errors.subject
                                    )}
                                    helperText={
                                        touched.subject && errors.subject
                                            ? errors.subject
                                            : ""
                                    }
                                    fullWidth
                                />

                                <TextField
                                    name="body"
                                    label="Body"
                                    value={values.body}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.body && errors.body)}
                                    helperText={
                                        touched.body && errors.body
                                            ? errors.body
                                            : ""
                                    }
                                    fullWidth
                                    multiline
                                    minRows={4}
                                />

                                <TextField
                                    name="scheduledTime"
                                    label="Scheduled Date"
                                    type="date"
                                    value={values.scheduledTime}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                        touched.scheduledTime &&
                                            errors.scheduledTime
                                    )}
                                    helperText={
                                        touched.scheduledTime &&
                                        errors.scheduledTime
                                            ? errors.scheduledTime
                                            : "Format: YYYY-MM-DD"
                                    }
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField
                                    select
                                    name="status"
                                    label="Status"
                                    value={values.status}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(
                                        touched.status && errors.status
                                    )}
                                    helperText={
                                        touched.status && errors.status
                                            ? errors.status
                                            : ""
                                    }
                                    fullWidth
                                >
                                    {statuses.map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {s.toUpperCase()}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    justifyContent="flex-end"
                                    sx={{ mt: 1 }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(-1)}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "Creating…"
                                            : "Create Campaign"}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
};

export default CampaignCreate;
