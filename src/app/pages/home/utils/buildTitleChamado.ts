export const BuildTitleChamado = (tipo: string, mesaNumero: string): string => {
    if (tipo == 'duvida') {
        return `Mesa ${mesaNumero} precisa de ajuda`;
    } else if (tipo == 'pedidoPronto') {
        return `O pedido da mesa ${mesaNumero} está pronto`;
    } else if (tipo == 'conta') {
        return `Mesa ${mesaNumero} precisa da conta`;
    } else if (tipo == 'pedidoCancelado') {
        return `O pedido da mesa ${mesaNumero} foi cancelado`;
    } else {
        return '';
    }

}