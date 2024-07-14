import { useEffect, useState } from "react";

type IParamsBuildHoraChamado = {
    hora: Date
}

const BuildHoraChamado = (params: IParamsBuildHoraChamado) => {

    const [now, setNow] = useState<Date>(new Date());


    useEffect(() => {

        const intervalo = setInterval(() => {
            setNow(new Date());
        }, 10000);

        return () => clearInterval(intervalo);
    })


    const differenceInHours: number = now.getHours() - params.hora.getHours();

    const wastoDay: boolean = params.hora.getDate() == now.getDate() &&
        params.hora.getMonth() == now.getMonth() &&
        params.hora.getFullYear == now.getFullYear;

    const wasNow: boolean = params.hora.getHours() == now.getHours() && params.hora.getMinutes() == now.getMinutes();

    let buildHora: string = '';

    if (!wastoDay) {
        buildHora = `${params.hora.getDate()}/${params.hora.getMonth() + 1}/${params.hora.getFullYear()} às ${params.hora.getHours()}:${params.hora.getMinutes()}`
    } else if (!wasNow) {
        const time: number =
            ((differenceInHours * 60) - params.hora.getMinutes()) + now.getMinutes();
        const plural: string = time > 1 ? 'minutos' : 'minuto';
        buildHora = `à ${time} ${plural}`;
    } else {
        buildHora = 'agora';
    }



    return (
        <p>
            {buildHora}
        </p>
    );
}
export default BuildHoraChamado;