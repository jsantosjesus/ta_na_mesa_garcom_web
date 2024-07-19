import { BrowserRouter } from "react-router-dom";
import Rotas from "./router";
import { onMessage } from "firebase/messaging";
import { useContext, useEffect, useRef, useState } from "react";
import { FirebaseContext } from "./app/context/firebaseAppContext";
import { Snackbar } from "@mui/material";
import bell from './app/assets/bell.wav';
import { SoundPlayer } from "./app/components/somNotification";

const App = () => {

    const firebaseContext = useContext(FirebaseContext);

    if (!firebaseContext) {
        throw new Error('useFirebase must be used within an FirebaseProvider');
    }

    const { messaging } = firebaseContext;

    const [openSnack, setOpenSnack] = useState<boolean>(false);

    // let titleMessage;
    const bodyMessage = useRef<string>('');

    const handleCloseSnack = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {  
        return;
        }

        setOpenSnack(false);
    };

    useEffect(() => {
        console.log('configurou recebimeno de mensagem');
        onMessage(messaging, (payload) => {
            setOpenSnack(true);
            bodyMessage.current = payload.notification?.body || "";
        });
    }, [messaging])


    return (
        <div>
            <SoundPlayer src={bell} snackBar={openSnack} />
            <BrowserRouter>
                <Rotas />
            </BrowserRouter>
            <Snackbar
                open={openSnack}
                autoHideDuration={1500}
                onClose={handleCloseSnack}
                message={bodyMessage.current}
            />
        </div>
    );
}
export default App;
