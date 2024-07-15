import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { fromChamado, IChamadoEntity } from "../../entities/chamadoEntity";
import ModalChamado from "../../components/modalChamado";
import { PiForkKnifeFill } from "react-icons/pi";
import BuildHoraChamado from "../../components/buildHoraChamado";
import BuildTitleChamado from "../../components/buildTitleChamado";
import Menu from "../../components/menu";
import { CircularProgress } from "@mui/material";


import '../../styles/pages/home.sass'

const Home = () => {

    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const firebaseContext = useContext(FirebaseContext);

    if (!firebaseContext) {
        throw new Error('firebase must be used within an firebaseProvider');
    }

    const { user, setUserName } = authContext;
    const { db } = firebaseContext;
    const [chamados, setChamados] = useState<IChamadoEntity[]>([]);
    const [chosenChamado, setChosenChamado] = useState<IChamadoEntity | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        // console.log('rodou useEffect de home');


        const q = query(collection(db, "chamado"), where("garcom_id", "==", user), where("status", "==", "ATIVO"));
        onSnapshot(q, (querySnapshot) => {
            const chmdos: IChamadoEntity[] = [];
            querySnapshot.forEach((doc) => {

                const chmd: IChamadoEntity = fromChamado(doc.data(), doc.id)

                chmdos.push(chmd);
            });
            setChamados(chmdos);
            setLoading(false);
        });


        async function getUserName() {
            const docRef = doc(db, "usuario", user);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUserName(docSnap.data().nome);
            }
        }

        getUserName();
    }, [db, user, setUserName]);


    function closeChamado() {
        setChosenChamado(undefined);
    }

    return (
        <div id="bodyHome">
            <Menu title="Chamados" />
            {loading
                ? <div className="loading"><CircularProgress color="inherit" /></div>
                : chamados.map((chamado) => {
                    return <div key={chamado.id} onClick={() => { setChosenChamado(chamado) }} className="chamado">
                        <div className="chamadoIcon">
                            <PiForkKnifeFill />
                        </div>
                        <div className="chamadoTitleAndSubtitle">
                            <BuildTitleChamado tipo={chamado.tipo} mesaNumero={chamado.mesaNumero} />
                            <BuildHoraChamado hora={chamado.hora} />
                        </div>
                    </div>
                })}
            {chosenChamado && <ModalChamado chamado={{ ...chosenChamado }} handleClose={closeChamado} />}
        </div>
    );
}
export default Home;
