

import '../../styles/pages/home.sass'

type IParamsBuildTitleChamado = {
    tipo: string,
    mesaNumero: string
}



const BuildTitleChamado = (params: IParamsBuildTitleChamado) => {

    let buildTitle: string;


    if (params.tipo == 'duvida') {
        buildTitle = `Mesa ${params.mesaNumero} precisa de ajuda`;
    } else if (params.tipo == 'pedidoPronto') {
        buildTitle = `O pedido da mesa ${params.mesaNumero} está pronto`;
    } else if (params.tipo == 'conta') {
        buildTitle = `Mesa ${params.mesaNumero} precisa da conta`;
    } else if (params.tipo == 'pedidoCancelado') {
        buildTitle = `O pedido da mesa ${params.mesaNumero} foi cancelado`;
    } else {
        buildTitle = '';
    }




    return (
        <p id="titleChamado">
            {buildTitle}
        </p>
    );
}
export default BuildTitleChamado;
