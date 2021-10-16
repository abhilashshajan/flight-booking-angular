export class Flight {

    flightCode: string;
    flightName: string;
    from: string;
    to: string;
    price: number;
    depTime: Date;
    arrTime: Date;
    duration: Date

    constructor(flightCode: string, flightName: string, from: string, to: string, price: number, depTime: Date, arrTime: Date, duration: Date) {
        this.flightCode = flightCode;
        this.flightName = flightName;
        this.from = from;
        this.to = to;
        this.price = price;
        this.depTime = depTime;
        this.arrTime = arrTime;
        this.duration = duration
    }
}
