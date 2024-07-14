import { DocumentData } from "firebase/firestore";

type IProdutoPedidoEntity = {
    id: string,
    nome: string,
    observacao: string,
    preco: number,
    quantidade: number
}


export type IPedidoEntity = {
    total: number
    produtos: IProdutoPedidoEntity[]
}

export const fromPedido = (data: DocumentData) => {

    const produtosList: IProdutoPedidoEntity[] = [];

    data.produtos.map((produto: DocumentData) => {

        const prdto: IProdutoPedidoEntity = {
            id: produto.id,
            nome: produto.nome,
            observacao: produto.observacao,
            preco: produto.preco,
            quantidade: produto.quantidade
        }
        produtosList.push(prdto);
    })




    const chamado: IPedidoEntity = {
        total: data.total,
        produtos: produtosList
    }

    return chamado;
}