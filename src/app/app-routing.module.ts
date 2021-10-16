import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './booking/booking.component';
import { HistoryComponent } from './history/history.component';
import { ManageComponent } from './manage/manage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CouponsComponent } from './coupons/coupons.component';
import { RouteGardService } from './services/router/RouteGardService';


const routes: Routes = [{ path: '', component: LoginComponent },
{ path: 'home', component: HomeComponent,canActivate:[RouteGardService] },
{ path: 'home/booking', component: BookingComponent,canActivate:[RouteGardService] },
{ path: 'home/booking/history', component: HistoryComponent,canActivate:[RouteGardService] },
{ path: 'home/booking/manage', component: ManageComponent,canActivate:[RouteGardService] },
{ path: 'dashboard', component: DashboardComponent,canActivate:[RouteGardService] },
{ path: 'dashboard/schedule', component: ScheduleComponent,canActivate:[RouteGardService] },
{ path: 'dashboard/coupon', component: CouponsComponent,canActivate:[RouteGardService] }
]

@NgModule({
  imports: [
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }