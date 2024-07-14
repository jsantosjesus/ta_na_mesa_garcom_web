import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { AuthContext } from "../../context/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { fromMesa, IMesaEntity } from "../../entities/mesaEntity";
import MenuBar from "../../components/menuBar";
import Conta from "../conta";

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
        <div>
            {!contaOpen ?
                <>
                    <MenuBar />
                    {loading ? <p>loading...</p> :

                        mesas.map((mesa) => {
                            return <div onClick={() => openContaPage(mesa)} key={mesa.id}>
                                <p>{mesa.numero}</p>
                                {mesa.contaAtiva}
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

