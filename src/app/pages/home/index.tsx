import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { fromChamado, IChamadoEntity } from "../../entities/chamadoEntity";
import ModalChamado from "../../components/modalChamado";
import { Link } from "react-router-dom";
import MenuBar from "../../components/menuBar";
import BuildHoraChamado from "../../components/buildHoraChamado";
import BuildTitleChamado from "../../components/buildTitleChamado";

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

        console.log('rodou useEffect de home');


        const q = query(collection(db, "chamado"), where("garcom_id", "==", user), where("status", "==", "ATIVO"));
        onSnapshot(q, (querySnapshot) => {
            const chmdos: IChamadoEntity[] = [];
            querySnapshot.forEach((doc) => {

                const chmd: IChamadoEntity = fromChamado(doc.data(), doc.id)

                chmdos.push(chmd);
            });
            console.log(chmdos);
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
        <div>
            <MenuBar />
            page home
            <Link to="/mesas">Mesas</Link>
            {loading ? <p>loading...</p> : chamados.map((chamado) => {
                return <div key={chamado.id} onClick={() => { setChosenChamado(chamado) }}>
                    <BuildTitleChamado tipo={chamado.tipo} mesaNumero={chamado.mesaNumero} />
                    <BuildHoraChamado hora={chamado.hora} />
                </div>
            })}
            {chosenChamado && <ModalChamado chamado={{ ...chosenChamado }} handleClose={closeChamado} />}
            {/* <button onClick={() => { setChosenChamado(undefined) }}>fechar</button> */}
        </div>
    );
}
export default Home;
