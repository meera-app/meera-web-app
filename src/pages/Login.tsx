import { Box, Button, CircularProgress, TextField, Typography, styled } from "@mui/material";
import { RecaptchaVerifier } from "firebase/auth";
import { FormEvent, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import Form from "./StyledForm";

interface LoginProps {
    isLoading: boolean;
    onPhoneNumberSubmit: (phoneNumber: string) => void;
}


function Login({ isLoading, onPhoneNumberSubmit }: LoginProps) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [validated, setValidated] = useState(false);

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const phone = event.target.value.replace(/\D/g, '');
        if (phone.length >= 0 && phone.length <= 10) {
            setPhoneNumber(phone)
        }
    }

    const generateRecatcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
            'size': 'invisible',
            'callback': (response: string) => {
                //console.log(response);

            },
            'expired-callback': () => {
                // Response expired. Ask user to solve reCAPTCHA again.
                //console.log("Captcha expired");

            }
        });
    }

    useEffect(() => {
        setValidated(phoneNumber.length === 10);
    }, [phoneNumber]);

    const handleSendOtp = (event: FormEvent) => {
        event.preventDefault();
        generateRecatcha();
        onPhoneNumberSubmit(phoneNumber);
    }


    return (
        <Form onSubmit={handleSendOtp}>
            <Typography component="h1" variant="h5">
                Delete Account
            </Typography>
            <TextField
                sx={{ mt: 3 }}
                required
                fullWidth
                label="Enter 10 digit Mobile number"
                disabled={isLoading}
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]{0,10}' }}
            />
            <div className="recaptcha-container" />
            <Box sx={{ m: 1, position: 'relative', width: "100%" }}>
                <Button
                    id="sign-in-button"
                    type="submit"
                    fullWidth
                    disabled={isLoading || !validated}
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}>
                    Send OTP
                </Button>

                {isLoading && (
                    <CircularProgress
                        color="secondary"
                        size={24}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
            </Box>
        </Form>
    );

}

export default Login;