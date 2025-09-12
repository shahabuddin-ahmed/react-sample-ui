import React from "react";
import { Button, Card, FormGroup, Grid, TextField } from "@material-ui/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { REGISTER } from "../../requests/auth";
import { Notify } from "../../misc/common";

const RegistrationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Must be a valid email").required("Required"),
    password: Yup.string().min(8, "Invalid Password!").required("Required"),
    phoneNumber: Yup.string().required("Required"),
});

const RegistrationForm = () => {
    const handleSubmit = async (values) => {
        let res = await REGISTER(values);
        if (res.status && res.status === "failed") {
            Notify(res.message, "error");
        } else {
            Notify("Registration success", "success");
        }
    };

    return (
        <Formik
            initialValues={{
                name: "",
                email: "",
                password: "",
                phoneNumber: "",
            }}
            validationSchema={RegistrationSchema}
            onSubmit={(values) => {
                handleSubmit(values);
            }}
        >
            {({ errors, touched, handleChange, values, handleBlur }) => (
                <Form autoComplete="off" className="p-4">
                    <h4 className="mb-4">Registration</h4>
                    <FormGroup className="mb-3">
                        <TextField
                            name="name"
                            variant="outlined"
                            label="Full Name"
                            value={values.name}
                            helperText={
                                errors.name && touched.name ? errors.name : ""
                            }
                            error={errors.name && touched.name ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <TextField
                            name="email"
                            variant="outlined"
                            label="Email Address"
                            value={values.email}
                            helperText={
                                errors.email && touched.email
                                    ? errors.email
                                    : ""
                            }
                            error={errors.email && touched.email ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                                errors.password && touched.password
                                    ? errors.password
                                    : ""
                            }
                            error={
                                errors.password && touched.password
                                    ? true
                                    : false
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <TextField
                            name="phoneNumber"
                            variant="outlined"
                            label="Phone Number"
                            value={values.phoneNumber}
                            helperText={
                                errors.phoneNumber && touched.phoneNumber
                                    ? errors.phoneNumber
                                    : ""
                            }
                            error={
                                errors.phoneNumber && touched.phoneNumber
                                    ? true
                                    : false
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                            {" "}
                            Registration{" "}
                        </Button>
                        <p>
                            Already registered? <Link to="/login">Login</Link>
                        </p>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

const Registration = () => {
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
                        <RegistrationForm />
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Registration;
