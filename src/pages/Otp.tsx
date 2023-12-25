import { Box, Button, useTheme } from "@mui/material";
import { FormEvent, useCallback, useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import Form from "./StyledForm";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebase/firebase";

interface OtpProps {
    phoeNumber: string;
    onVerifyOtp: (otp: string) => void;
    onResendOtop: () => void;
}

function Otp({ phoeNumber, onVerifyOtp, onResendOtop }: OtpProps) {
    const theme = useTheme();
    const [otp, setOtp] = useState("");
    const [secondsRemaining, setSecondsRemaining] = useState(60);

    const generateRecatcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'resend-button', {
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



    const startCountDown = () => {
        const timerInterval = setInterval(() => {
            if (secondsRemaining === 0) {
                clearInterval(timerInterval);
            } else {
                setSecondsRemaining(prevSeconds => prevSeconds - 1);
            }
        }, 1000);
    }

    useEffect(startCountDown, []);

    const handleRestart = () => {
        // Restart the countdown by setting secondsRemaining back to its initial value
        setSecondsRemaining(60);
        startCountDown();
    };


    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onVerifyOtp(otp);
    }

    const handelResendOtp = () => {
        generateRecatcha();
        onResendOtop();
        handleRestart();
    }

    return (
        <Form onSubmit={handleSubmit}>
            Enter the sent OTP to your number <b>+91-{`${phoeNumber}`}</b>.
            <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                inputStyle={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    fontSize: 20,
                    marginLeft: 8,
                    marginRight: 8,
                    textAlign: "center",
                    marginBottom: 30,
                    marginTop: 10,
                    borderWidth: "1px"
                }}
                renderInput={(props) => <input {...props} />}
            />

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                fontSize: 14,

            }}>
                <span>Didn't receive OTP?</span>
                {secondsRemaining > 0 ? <span style={{ color: theme.palette.primary.main, paddingLeft: 4 }}>Resend in {secondsRemaining}s</span> : <Button
                    id="resend-button"
                    size="small" onClick={handelResendOtp}>Resend</Button>}
            </Box>

            <Button fullWidth
                variant="contained"
                disabled={otp.length < 6}
                sx={{ mt: 5 }}
                type="submit"
            >
                Verify OTP
            </Button>
        </Form>
    )
}

export default Otp;