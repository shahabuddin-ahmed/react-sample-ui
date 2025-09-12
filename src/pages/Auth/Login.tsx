import React, { type FC } from "react";
import { Button, Card, FormGroup, Grid, TextField } from "@material-ui/core";
import { Formik, Form, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { LOGIN } from "../../requests/auth";
import { Notify } from "../../misc/common";

type LoginValues = {
    email: string;
    password: string;
};

type LoginResponse = {
    status?: "failed" | "success" | string;
    message?: string;
    // add any other fields your API returns (token, user, etc.)
};

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Must be a valid email").required("Required"),
    password: Yup.string().min(8, "Invalid Password!").required("Required"),
});

const LoginForm: FC = () => {
    const handleSubmit = async (
        values: LoginValues,
        _helpers: FormikHelpers<LoginValues>
    ): Promise<void> => {
        const res: LoginResponse = await LOGIN(values);

        if (res.status === "failed") {
            Notify(res.message ?? "Login failed", "error");
        } else {
            Notify("Login success", "success");
            window.location.href = "/"; // or use history.push("/") if you prefer
        }
    };

    return (
        <Formik<LoginValues>
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched, handleChange, values, handleBlur }) => (
                <Form autoComplete="off" className="p-4">
                    <h4 className="mb-4">Login</h4>

                    <FormGroup className="mb-3">
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

                    <FormGroup className="mb-3">
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
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ display: "flex", flexWrap: "wrap" }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Login
                        </Button>
                        <p>
                            Not registered? <Link to="/register">Register</Link>
                        </p>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

const Login: FC = () => {
    return (
        <div className="my-5 pt-5">
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item lg={4} sm={8} xs={10}>
                    <Card>
                        <LoginForm />
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Login;
