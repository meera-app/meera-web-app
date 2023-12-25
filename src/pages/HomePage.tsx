import { Backdrop, CircularProgress, Container, Paper } from "@mui/material";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useState } from "react";
import { useSnackbar } from "notistack";
import Login from "./Login";
import Otp from "./Otp";

function HomePage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [userId, setUserId] = useState("");

    const handlePhoneNumberSubmit = (phone: string) => {
        setPhoneNumber(phone);
        sendOtp(phone);
    }

    const sendOtp = async (phone: string) => {
        setLoading(true);
        try {
            let appVerifier = window.recaptchaVerifier;
            await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier)
                .then((confirmationResult) => {
                    setOtpSent(true);
                    window.confirmationResult = confirmationResult;
                })
            enqueueSnackbar("OTP Sent Successfully!", { variant: "success" });
        } catch (error) {
            console.log(error);
            enqueueSnackbar(`${error}`, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }

    const verifyOtp = async (otp: string) => {
        setLoading(true);
        try {

            await window.confirmationResult.confirm(otp).then((result: { user: any; }) => {
                // User signed in successfully.
                const user = result.user;
                window.userId = user.id;

            });
            enqueueSnackbar("Login successful!", { variant: "success" });
        } catch (error) {
            console.log(error);
            enqueueSnackbar(`${error}`, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (

        <Container component="main" maxWidth="xs">
            <Paper
                variant="outlined"
                sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>

                {!otpSent ?
                    <Login onPhoneNumberSubmit={handlePhoneNumberSubmit} isLoading={isLoading} /> :
                    <Otp phoeNumber={phoneNumber} onResendOtop={() => {
                        sendOtp(phoneNumber);
                    }}
                        onVerifyOtp={verifyOtp} />
                }
            </Paper>

            <Backdrop open={isLoading} >
                <CircularProgress />
            </Backdrop>
        </Container>
    )
}

export default HomePage;