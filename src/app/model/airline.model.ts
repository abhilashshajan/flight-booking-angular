export class Airline {

    id: number;
    airlineCode: string;
    airlineName: string;
    contactNumber: string;
    updatedDate: Date;
    updatedBy: string

    constructor(id: number, airlineCode: string, airlineName: string, contactNumber: string, updatedDate:Date, updatedBy: string) {
        this.id = id,
        this.airlineCode = airlineCode;
        this.airlineName = airlineName;
        this.contactNumber = contactNumber;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
    }
}
