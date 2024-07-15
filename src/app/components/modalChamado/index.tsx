import { useContext, useState } from "react";
import { IChamadoEntity } from "../../entities/chamadoEntity";
import BuildTitleChamado from "../buildTitleChamado";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { doc, updateDoc } from "firebase/firestore";

import '../../styles/components/modalChamado.sass';
import { CircularProgress } from "@mui/material";

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
            console.log('Erro: ' + e)
        }

    }

    return (
        <div id="modalChamadoBody">
            <div className="transparent"  onClick={params.handleClose}/>

            <div className="modal">
                <b><BuildTitleChamado tipo={params.chamado.tipo} mesaNumero={params.chamado.mesaNumero} /></b>
                {loading ? <p><CircularProgress color="inherit"/></p> : <button onClick={setChamadoAtentido}>Chamado atendido</button>}
            </div>
        </div>
    );
}
export default ModalChamado;
