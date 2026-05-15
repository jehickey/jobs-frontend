import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { CreateUser } from './create-user/create-user';
import { AppsPage } from './apps-page/apps-page';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'createuser', component: CreateUser },
    { path: 'apps', component: AppsPage }
];
