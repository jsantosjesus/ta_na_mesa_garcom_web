export const BuildHora = (hora: Date): string => {

    const now: Date = new Date();

    const differenceInHours: number = now.getHours() - hora.getHours();

    const wastoDay: boolean = hora.getDate() == now.getDate() &&
    hora.getMonth() == now.getMonth() &&
    hora.getFullYear == now.getFullYear;

    const wasNow: boolean = hora.getHours() == now.getHours() && hora.getMinutes() == now.getMinutes();

    if(!wastoDay){
        return `${hora.getDate()}/${hora.getMonth() + 1}/${hora.getFullYear()} às ${hora.getHours()}:${hora.getMinutes()}`
    } else if (!wasNow){
        const time: number =
          ((differenceInHours * 60) - hora.getMinutes()) + now.getMinutes();
      const plural: string = time > 1 ? 'minutos' : 'minuto';
      return `à ${time} ${plural}`;
    } else {
        return 'agora';
    }


}