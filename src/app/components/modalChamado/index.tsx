import { useContext, useState } from "react";
import { IChamadoEntity } from "../../entities/chamadoEntity";
import BuildTitleChamado from "../buildTitleChamado";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { doc, updateDoc } from "firebase/firestore";

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

        } catch (e){
            console.log('Erro: ' + e)
        }

    }

    return (
        <div>
            <BuildTitleChamado tipo={params.chamado.tipo} mesaNumero={params.chamado.mesaNumero} />
            {loading ? <p>loading...</p> : <button onClick={setChamadoAtentido}>Chamado atendido</button>}
        </div>
    );
}
export default ModalChamado;
