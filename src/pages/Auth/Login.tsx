import { type FC } from "react";
import Grid from "@mui/material/Grid";
import { Button, Card, FormGroup, TextField } from "@mui/material";
import { Formik, Form, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Notify } from "../../misc/common";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { loginUser } from "../../stores/slices/authSlice";

type LoginValues = { email: string; password: string };

const LoginSchema = Yup.object({
    email: Yup.string().email("Must be a valid email").required("Required"),
    password: Yup.string().min(8, "Invalid Password!").required("Required"),
});

const LoginForm: FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );

    const handleSubmit = async (
        values: LoginValues,
        _helpers: FormikHelpers<LoginValues>
    ): Promise<void> => {
        const res = await dispatch(loginUser(values));
        if (loginUser.fulfilled.match(res)) {
            Notify("Login success", "success");
            navigate("/");
        } else if (loginUser.rejected.match(res)) {
            Notify(res.payload as string, "error");
        }
    };

    return (
        <Formik<LoginValues>
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched, handleChange, values, handleBlur }) => (
                <Form autoComplete="off" style={{ padding: 16 }}>
                    <h4 style={{ marginBottom: 16 }}>Login</h4>

                    <FormGroup sx={{ mb: 2 }}>
                        <TextField
                            name="email"
                            variant="outlined"
                            label="Email Address"
                            value={values.email}
                            helperText={
                                touched.email && errors.email
                                    ? errors.email
                                    : ""
                            }
                            error={Boolean(touched.email && errors.email)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                        />
                    </FormGroup>

                    <FormGroup sx={{ mb: 2 }}>
                        <TextField
                            type="password"
                            name="password"
                            variant="outlined"
                            label="Password"
                            value={values.password}
                            helperText={
                                touched.password && errors.password
                                    ? errors.password
                                    : ""
                            }
                            error={Boolean(touched.password && errors.password)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                        />
                    </FormGroup>

                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                        <p style={{ margin: 0 }}>
                            Not registered? <Link to="/register">Register</Link>
                        </p>
                    </Grid>

                    {error && (
                        <p style={{ color: "red", marginTop: "8px" }}>
                            {error}
                        </p>
                    )}
                </Form>
            )}
        </Formik>
    );
};

const Login: FC = () => {
    return (
        <div style={{ marginTop: 40, paddingTop: 40 }}>
            <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
            >
                <Grid size={{ xs: 10, sm: 8, lg: 4 }}>
                    <Card>
                        <LoginForm />
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Login;
