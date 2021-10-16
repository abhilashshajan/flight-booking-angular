export class User { 
  username:string;
  email:string;
  roles:Array<string>;
  password:string;
  enabled:boolean;
  constructor(userName : string, userPassword : string,userEmail : string, accountStatus : boolean, userRole : Array<string>){
    this.username = userName;
    this.email = userEmail;
    this.roles = userRole;
    this.password = userPassword;
    this.enabled = accountStatus;
} 
}
