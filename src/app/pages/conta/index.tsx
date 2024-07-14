import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { fromPedido, IPedidoEntity } from "../../entities/pedidoEntity";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { IMesaEntity } from "../../entities/mesaEntity";

type IParamsConta = {
    mesa: IMesaEntity
    handleClose: () => void
}


const Conta = (params: IParamsConta) => {

    const firebaseContext = useContext(FirebaseContext);

    if (!firebaseContext) {
        throw new Error('firebase must be used within an firebaseProvider');
    }


    const { db } = firebaseContext;
    const [loading, setLoading] = useState<boolean>(true);
    const [pedidos, setPedidos] = useState<IPedidoEntity[]>([]);

    useEffect(() => {

        console.log('rodou useEffect de conta');


        const q = query(collection(db, "pedido"), where("conta_id", "==", params.mesa.contaAtiva), where("status", "==", "pronto"));
        onSnapshot(q, (querySnapshot) => {
            const pddos: IPedidoEntity[] = [];
            querySnapshot.forEach((doc) => {

                const pddo: IPedidoEntity = fromPedido(doc.data())

                pddos.push(pddo);
            });
            setPedidos(pddos);
            setLoading(false);
        });

    }, [db, params.mesa]);

    async function pagarConta() {

        const agora = new Date();

        try {
            updateDoc(doc(db, "conta", params.mesa.contaAtiva), {
                dataPaga: agora,
            });

            await updateDoc(doc(db, "mesa", params.mesa.id), {
                contaAtiva: '',
            });

            params.handleClose();

        } catch (e){
            console.log('Erro: ' + e)
        }
    }


    return (
        <div>
            <div><p onClick={params.handleClose}>{"<"}</p><p>Conta da mesa{params.mesa.numero}</p></div>
            {loading ? <>loading...</> : pedidos.map((pedido, index) => {
                return <div key={index}>{pedido.produtos.map((produto) => {
                    return <div key={produto.id}>
                        <p>{produto.quantidade}</p>
                        <p>{produto.nome}</p>
                        <p>R${produto.preco.toFixed(2).replace('.', ',')} = R$ {(produto.quantidade * produto.preco).toFixed(2).replace('.', ',')}</p>
                    </div>
                })}
                <div>
                    <p>Total</p>
                    <p>R$ {pedido.total.toFixed(2).replace('.', ',')}</p>
                    <button onClick={pagarConta}>Conta paga</button>
                </div>
                </div>
            })}
        </div>
    );
}
export default Conta;
