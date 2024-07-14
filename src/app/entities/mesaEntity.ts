import { DocumentData } from "firebase/firestore";


export type IMesaEntity = {
    id: string,
    numero: string,
    status: string,
    contaAtiva: string,
}

export const fromMesa = (data: DocumentData, id: string) => {
    const chamado: IMesaEntity = {
        id: id,
        status: data.status,
        numero: data.numero,
        contaAtiva: data.contaAtiva ? data.contaAtiva : ""
}

return chamado; 
}