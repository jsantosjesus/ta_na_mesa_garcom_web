import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { fromChamado, IChamadoEntity } from "../../entities/chamadoEntity";
import { BuildHora } from "./utils/buildHora";

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

    useEffect(() => {

        const q = query(collection(db, "chamado"), where("garcom_id", "==", user), where("status", "==", "ATIVO"));
        onSnapshot(q, (querySnapshot) => {
            const chmdos: IChamadoEntity[] = [];
            querySnapshot.forEach((doc) => {
                // const chmd: IChamadoEntity = {
                //     id: doc.id,
                //     hora: doc.data().hora,
                //     status: doc.data().status,
                //     tipo: doc.data().tipo,
                //     mesaNumero: doc.data().mesa.numero,
                //     mesaId: doc.data().mesa.id
                // };
                const chmd: IChamadoEntity = fromChamado(doc.data(), doc.id)
                chmdos.push(chmd);
            });
            setChamados(chmdos);
        });
    });


    return (
        <div>
            page home
            {chamados && chamados.map((chamado) => {
                return <div key={chamado.id}><p>{BuildHora(chamado.hora)}</p></div>
            })}
        </div>
    );
}
export default Home;
