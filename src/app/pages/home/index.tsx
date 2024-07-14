import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { fromChamado, IChamadoEntity } from "../../entities/chamadoEntity";
import { BuildHoraChamado } from "./utils/buildHoraChamado";
import ModalChamado from "../../components/modalChamado";

const Home = () => {

    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const firebaseContext = useContext(FirebaseContext);

    if (!firebaseContext) {
        throw new Error('firebase must be used within an firebaseProvider');
    }

    const { user } = authContext;
    const { db } = firebaseContext;
    const [chamados, setChamados] = useState<IChamadoEntity[]>([]);
    const [chosenChamado, setChosenChamado] = useState<IChamadoEntity | undefined>(undefined);

    useEffect(() => {

        console.log('rodou useEffect de home');


        const q = query(collection(db, "chamado"), where("garcom_id", "==", user), where("status", "==", "ATIVO"));
        onSnapshot(q, (querySnapshot) => {
            const chmdos: IChamadoEntity[] = [];
            querySnapshot.forEach((doc) => {
                
                const chmd: IChamadoEntity = fromChamado(doc.data(), doc.id)
                
                chmdos.push(chmd);
            });
            setChamados(chmdos);
        });
    }, [db, user]);


    function closeChamado(){
        setChosenChamado(undefined);
    }

    return (
        <div>
            page home
            {chamados && chamados.map((chamado) => {
                return <div key={chamado.id} onClick={() => {setChosenChamado(chamado)}}><p>{BuildHoraChamado(chamado.hora)}</p></div>
            })}
            {chosenChamado && <ModalChamado chamado={{...chosenChamado}} handleClose={closeChamado} />}
            <button onClick={() => {setChosenChamado(undefined)}}>fechar</button>
        </div>
    );
}
export default Home;
