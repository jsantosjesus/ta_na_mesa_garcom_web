import { useContext, useState } from "react";
import { IChamadoEntity } from "../../entities/chamadoEntity";
import BuildTitleChamado from "../buildTitleChamado";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { doc, updateDoc } from "firebase/firestore";
import { CircularProgress, Snackbar } from "@mui/material";

import '../../styles/components/modalChamado.sass';

type IParamsModalChamado = {
    chamado: IChamadoEntity,
    handleClose: () => void
}

const ModalChamado = (params: IParamsModalChamado) => {

    const firebaseContext = useContext(FirebaseContext);

    if (!firebaseContext) {
        throw new Error('firebase must be used within an firebaseProvider');
    }

    const { db } = firebaseContext;
    const [loading, setLoading] = useState<boolean>(false);

    const [openSnack, setOpenSnack] = useState<boolean>(false);


    const handleCloseSnack = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {  
        return;
        }

    setOpenSnack(false);
  };


    async function setChamadoAtentido() {
        setLoading(true);

        try {
            updateDoc(doc(db, "chamado", params.chamado.id), {
                status: 'ATENDIDO',
            });

            await updateDoc(doc(db, "mesa", params.chamado.mesaId), {
                chamandoGarcom: '',
            });

            params.handleClose();

        } catch (e) {
            // console.log('Erro: ' + e)
            setOpenSnack(true);
        }

    }

    return (
        <div id="modalChamadoBody">
            <div className="transparent"  onClick={params.handleClose}/>

            <div className="modal">
                <b><BuildTitleChamado tipo={params.chamado.tipo} mesaNumero={params.chamado.mesaNumero} /></b>
                {loading ? <p><CircularProgress color="inherit"/></p> : <button onClick={setChamadoAtentido}>Chamado atendido</button>}
            </div>
            <Snackbar
                open={openSnack}
                autoHideDuration={1500}
                onClose={handleCloseSnack}
                message="Ops, Aconteceu um erro!"
            />
        </div>
    );
}
export default ModalChamado;
