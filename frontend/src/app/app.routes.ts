import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductComponent } from './product/product.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddProductComponent } from './add-product/add-product.component';
import { SalesComponent } from './sales/sales.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { authGuard, roleGuard } from './services/auth.guard';


export const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  }
  ,

  {
  
    path: 'login',
    component: LoginComponent
  },
  {
    path:'dashboard',
    component:DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'user'] }
  },
    {
    path:'product',
    component:ProductComponent,
    canActivate: [authGuard, roleGuard],
      data: { roles: ['admin', 'user'] }
  },
  {
    path:'navbar',
    component:NavbarComponent
  }
  ,
  {
    path:'add-product',
    component:AddProductComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'add-user',
    component: AddUserComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'user-list',
    component: UserListComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'supplier',
    component: SupplierComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'user'] }
  },
  {
    path: 'add-sales',
    component: SalesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'user'] }
  },
  {
    path: 'sales-list',
    loadComponent: () => import('./sales-list/sales-list.component').then(component => component.SalesListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'user'] }
  }
];