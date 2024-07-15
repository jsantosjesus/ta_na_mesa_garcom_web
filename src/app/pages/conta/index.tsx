import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { fromPedido, IPedidoEntity } from "../../entities/pedidoEntity";
import { FirebaseContext } from "../../context/firebaseAppContext";
import { IMesaEntity } from "../../entities/mesaEntity";
import { IoArrowBack } from "react-icons/io5";

import '../../styles/pages/conta.sass'
import { CircularProgress, Snackbar } from "@mui/material";

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
    const [openSnack, setOpenSnack] = useState<boolean>(false);

    const handleCloseSnack = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {  
        return;
        }

        setOpenSnack(false);
    };

    let totalConta: number = 0;

    useEffect(() => {

        // console.log('rodou useEffect de conta');


        const q = query(collection(db, "pedido"), where("conta_id", "==", params.mesa.contaAtiva), where("status", "==", "pronto"));
        onSnapshot(q, (querySnapshot) => {
            const pddos: IPedidoEntity[] = [];
            // console.log(querySnapshot)
            querySnapshot.forEach((doc) => {

                const pddo: IPedidoEntity = fromPedido(doc.data())

                // totalConta = totalConta + pddo.total;

                pddos.push(pddo);
            });
            // console.log("pedidos: " + pddos)
            setPedidos(pddos);
            setLoading(false);
        });

    }, [db, params.mesa]);

    async function pagarConta() {
        setLoading(true);
        const agora = new Date();

        try {
            updateDoc(doc(db, "conta", params.mesa.contaAtiva), {
                dataPaga: agora,
            });

            await updateDoc(doc(db, "mesa", params.mesa.id), {
                contaAtiva: '',
            });

            setLoading(false);

            params.handleClose();

        } catch (e) {
            setOpenSnack(true);
            setLoading(false);
        }
    }


    return (
        <div id="contaBody">
            <div className="navBar">
                <p onClick={params.handleClose}>
                    <IoArrowBack />
                </p>
                <h3 className="titleNavBar">
                    Conta da mesa {params.mesa.numero}
                </h3>
            </div>
            {loading ?
                <div className="loading"><CircularProgress color="inherit" /></div> :
                <div className="pedidos">
                    {pedidos.map((pedido, index) => {
                        totalConta = totalConta + pedido.total;
                        return <div key={index}>{pedido.produtos.map((produto) => {
                            return <div key={produto.id} className="divProduto">
                                <p>{produto.quantidade}</p>
                                <p>{produto.nome}</p>
                                <p>R${produto.preco.toFixed(2).replace('.', ',')} = R$ {(produto.quantidade * produto.preco).toFixed(2).replace('.', ',')}</p>
                            </div>
                        })}
                        </div>
                    })}
                </div>
            }
            <div className="divTotalConta">
                <div className="total">
                    <h4>Total</h4>
                    <h4>R$ {totalConta.toFixed(2).replace('.', ',')}</h4>
                </div>
                {loading ? <p><CircularProgress color="inherit" /></p> : <button onClick={pagarConta}>Conta paga</button>}
            </div>
            <Snackbar
                open={openSnack}
                autoHideDuration={1500}
                onClose={handleCloseSnack}
                message="Ops, Aconteceu um erro"
            />
        </div>
    );
}
export default Conta;
