import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { AuthContext } from "../../context/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { fromMesa, IMesaEntity } from "../../entities/mesaEntity";
// import MenuBar from "../../components/menuBar";
import Conta from "../conta";
import Menu from "../../components/menu";

import '../../styles/pages/mesas.sass'
import { CircularProgress } from "@mui/material";

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

    useEffect(() => {
        console.log('rodou o useState');

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

    function openContaPage(mesa: IMesaEntity){
        if(!mesa.contaAtiva){
            console.log('toastfy mesa sem conta');
        } else {
            setContaOpen(mesa);
        }
    }


    return (
        <div id="mesasBody">
            {!contaOpen ?
                <>
                    <Menu title="Mesas" />
                    {loading ? <div className="loading"><CircularProgress color="inherit"/></div> :

                        mesas.map((mesa) => {
                            return <div onClick={() => openContaPage(mesa)} key={mesa.id} className={`mesa ${mesa.contaAtiva ? "ocupada" : "livre"}`}>
                                <h2>Mesa {mesa.numero}</h2>
                            </div>
                        })
                    }
                </>
                :
                <Conta mesa={contaOpen} handleClose={() => setContaOpen(undefined)}/>
            }
        </div>
    );
}
export default Mesas;

