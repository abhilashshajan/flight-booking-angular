export class FlightSchedule {

    id:number;
    airlineId: number;
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    frequency: string;
    departureTime: Date;
    arrivalTime: Date;
    aircraftRegistration: string;
    seatCount: number;
    price: string;
    updatedBy: string;
    updatedTime: Date;

    constructor(id: number, airlineId: number, flightNumber: string, departureAirport: string, arrivalAirport: string, frequency: string, departureTime: Date, arrivalTime: Date, aircraftRegistration: string, seatCount: number, ticketPrice:string, updatedBy: string, updatedTime: Date) {
        this.id = 0;
        this.airlineId = airlineId;
        this.flightNumber = flightNumber;
        this.departureAirport =  departureAirport;
        this.arrivalAirport = arrivalAirport;
        this.frequency = frequency;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.aircraftRegistration = aircraftRegistration;
        this.seatCount = seatCount;
        this.price = ticketPrice;
        this.updatedBy = updatedBy;
        this.updatedTime = updatedTime;
    }
}
