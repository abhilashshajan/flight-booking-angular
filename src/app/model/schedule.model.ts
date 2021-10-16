export class Schedule {

    id:number;
    airlineName: string;
    airlineCode: string;
    origin: string;
    destination: string;
    frequency: string;
    depatureTime: Date;
    arrivalTime: Date;
    price: string

    constructor(id: number, airlineName: string, airlineCode: string, origin: string, destination: string, frequency: string, depatureTime: Date, arrivalTime: Date,price:string) {
        this.id = 0;
        this.airlineName = airlineName;
        this.airlineCode = airlineCode;
        this.origin =  origin;
        this.destination = destination;
        this.frequency = frequency;
        this.depatureTime = depatureTime;
        this.arrivalTime = arrivalTime;
        this.price = price
    }
}
