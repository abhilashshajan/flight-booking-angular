import { Injectable } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class RouteGardService {

    constructor(private authenticate: AuthenticationService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authenticate.isUserLoggedIn()) {
            return true;
        } else {
            this.router.navigate(['']);
            return false;
        }
    }
}

