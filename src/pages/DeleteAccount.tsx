import { Backdrop, Button, CircularProgress, Container, FormControlLabel, Paper, Radio, TextField, Typography, styled, useTheme } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useUserContext } from "../util/Auth";
import { auth } from "../firebase/firebase";


const RadioText = styled(Typography)(({ theme }) => ({
    display: 'inline-block',
    color: theme.palette.text.secondary
}));



function DeleteAccount() {
    const theme = useTheme();
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [reason, setReason] = useState("");
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const userType = useUserContext();

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const userId = { userId: userType?.user?.uid };
            console.log(userId);
            const response = await fetch('https://deleteuseraccount-oqlmp3mpcq-uc.a.run.app', {
                method: 'POST',
                body: JSON.stringify(userId),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }).then((response) => response.json());
            console.log(response);
            await auth.signOut();
            enqueueSnackbar(`${response.message}`, { variant: "success" });
            //enqueueSnackbar(`${response.message}`, { variant: "success" });
        } catch (error) {
            console.log(error);
            enqueueSnackbar(`${error}`, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }

    const hadnleReasonSelect = (index: number) => {
        if (index === 5) {
            setReason("");
        }
        setSelectedIndex(index);

    };

    useEffect(() => {
        if (selectedIndex === 5) {
            setButtonEnabled(reason.length > 0)

        } else {
            setButtonEnabled(selectedIndex >= 0)
        }
    }, [selectedIndex, reason]);

    return (
        <Container component="main" maxWidth="sm">
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography variant="h5">You're about to delete your account</Typography>
                <Typography variant="body1" sx={{ my: 1 }} color={theme.palette.text.secondary}>
                    All data associated with your account, including profile information, story likes, chanting history and achievements, will be permanently deleted. This information cannot be recovered once your account is deleted.
                </Typography>
                <Typography variant="body2" sx={{ my: 2, fontSize: 12, fontWeight: "bold" }}>Select a reason</Typography>

                <FormControlLabel
                    sx={{ display: "block" }}
                    control={<Radio checked={selectedIndex === 0} onChange={() => { hadnleReasonSelect(0) }} />}
                    label={<RadioText variant="body1">I don't want to use Meera app anymore.</RadioText>}
                />
                <FormControlLabel
                    sx={{ display: "block" }}
                    control={<Radio checked={selectedIndex === 1} onChange={() => { hadnleReasonSelect(1) }} />}
                    label={<RadioText variant="body1">I'm using a different account.</RadioText>}
                />
                <FormControlLabel
                    sx={{ display: "block" }}
                    control={<Radio checked={selectedIndex === 2} onChange={() => { hadnleReasonSelect(2) }} />}
                    label={<RadioText variant="body1">I've found a better app.</RadioText>}
                />
                <FormControlLabel
                    sx={{ display: "block" }}
                    control={<Radio checked={selectedIndex === 3} onChange={() => { hadnleReasonSelect(3) }} />}
                    label={<RadioText variant="body1">I'm worried about my privacy.</RadioText>}
                />
                <FormControlLabel
                    sx={{ display: "block" }}
                    control={<Radio checked={selectedIndex === 4} onChange={() => { hadnleReasonSelect(4) }} />}
                    label={<RadioText variant="body1">The app is not working properly.</RadioText>}
                />
                <FormControlLabel
                    sx={{ display: "block" }}
                    control={<Radio checked={selectedIndex === 5} onChange={() => { hadnleReasonSelect(5) }} />}
                    label={<RadioText variant="body1">Other</RadioText>}
                />
                {(selectedIndex === 5) && <TextField
                    required
                    fullWidth
                    id="reason"
                    label="Please specify your reason"
                    variant="outlined"
                    sx={{ mb: 2 }}
                    onChange={(event) => {
                        setReason(event.target.value);
                    }}
                />}
                <TextField
                    required
                    fullWidth
                    multiline
                    rows={3}
                    id="comments"
                    label="Additional comments (optional)"
                    variant="outlined"
                />

                <Button fullWidth
                    variant="contained"
                    sx={{ mt: 3 }}
                    disabled={!buttonEnabled}
                    onClick={handleDeleteAccount}
                >
                    Delete my account now
                </Button>
            </Paper>
            <Backdrop open={isLoading} >
                <CircularProgress />
            </Backdrop>
        </Container>

    );
}

export default DeleteAccount;