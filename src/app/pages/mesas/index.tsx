import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { AuthContext } from "../../context/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { fromMesa, IMesaEntity } from "../../entities/mesaEntity";
// import MenuBar from "../../components/menuBar";
import Conta from "../conta";
import Menu from "../../components/menu";

import '../../styles/pages/mesas.sass'
import { CircularProgress, Snackbar } from "@mui/material";

// interface State extends SnackbarOrigin {
//     open: boolean;
//   }

const Mesas = () => {


    const firebaseContext = useContext(FirebaseContext);

    if (!firebaseContext) {
        throw new Error('firebase must be used within an firebaseProvider');
    }

    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { db } = firebaseContext;
    const { user } = authContext;
    const [loading, setLoading] = useState<boolean>(true);
    const [contaOpen, setContaOpen] = useState<IMesaEntity | undefined>(undefined);
    const [mesas, setMesas] = useState<IMesaEntity[]>([]);
    
    const [openSnack, setOpenSnack] = useState<boolean>(false);

    const handleCloseSnack = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {  
        return;
        }

        setOpenSnack(false);
    };



    useEffect(() => {
        // console.log('rodou o useState');

        const q = query(collection(db, "mesa"), where("garcom_id", "==", user));
        onSnapshot(q, (querySnapshot) => {
            const msas: IMesaEntity[] = [];
            querySnapshot.forEach((doc) => {

                const msa: IMesaEntity = fromMesa(doc.data(), doc.id)

                msas.push(msa);
                setLoading(false);
            });
            setMesas(msas);
        });



    }, [db, user]);

    function openContaPage(mesa: IMesaEntity) {
        if (!mesa.contaAtiva) {
            setOpenSnack(true);
        } else {
            setContaOpen(mesa);
        }
    }


    return (
        <div id="mesasBody">
            {!contaOpen ?
                <>
                    <Menu title="Mesas" />
                    {loading ? <div className="loading"><CircularProgress color="inherit" /></div> :

                        mesas.map((mesa) => {
                            return <div onClick={() => openContaPage(mesa)} key={mesa.id} className={`mesa ${mesa.contaAtiva ? "ocupada" : "livre"}`}>
                                <h2>Mesa {mesa.numero}</h2>
                            </div>
                        })
                    }
                </>
                :
                <Conta mesa={contaOpen} handleClose={() => setContaOpen(undefined)} />
            }
            <Snackbar
                open={openSnack}
                autoHideDuration={1500}
                onClose={handleCloseSnack}
                message="Essa mesa não tem conta ativa"
            />
        </div>
    );
}
export default Mesas;

