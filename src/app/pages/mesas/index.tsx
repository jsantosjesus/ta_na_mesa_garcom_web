import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { AuthContext } from "../../context/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { fromMesa, IMesaEntity } from "../../entities/mesaEntity";

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
    const {user} = authContext;
    const [loading, setLoading] = useState<boolean>(true);
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


    return (
        <div>
            {loading ? <p>loading...</p> : mesas.map((mesa) => {
                return <div key={mesa.id}>
                {mesa.numero}
                </div>
            })}
        </div>
    );
}
export default Mesas;

