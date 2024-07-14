import { DocumentData } from "firebase/firestore";


export type IChamadoEntity = {
    id: string,
    hora: Date,
    status: string,
    tipo: string,
    mesaNumero: string,
    mesaId: string
}

export const fromChamado = (data: DocumentData, id: string) => {
    const chamado: IChamadoEntity = {
        id: id,
        hora: data.hora.toDate(),
        status: data.status,
        tipo: data.tipo,
        mesaNumero: data.mesa.numero,
        mesaId: data.mesa.id
    }
    
    return chamado; 
}