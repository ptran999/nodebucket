/**
 * Title: app-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 * Modified By: Phuong Tran
 */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { HomeComponent } from './home/home.component';
import { TasksComponent } from './task-management/tasks/tasks.component';
import { authGuard } from './shared/auth.guard';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NotFoundComponent } from './not-found/not-found.component';

// routes array with a path, component, and title for each route in the application (e.g. home, about, contact, etc.)
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Nodebucket: Home'
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Nodebucket: Home'
      },
      {
        path: 'contact-us',
        component: ContactUsComponent,
        title: 'Nodebucket: Contact Us'
      },
      {
        path: 'about-us',
        component: AboutUsComponent,
        title: 'Nodebucket: About Us'
      },
      {
        path: 'tasks',
        component: TasksComponent,
        title: 'Nodebucket: Task Manager',
        canActivate: [ authGuard ]
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
        title: 'Nodebucket: Not Found'
             },

    ],
  },
  {
    // The 'security' path is mapped to the SecurityModule
    path: 'security',
    loadChildren: () =>
      import('./security/security.module').then((m) => m.SecurityModule),
  },
  {
      // Redirects to not-found page
    path: '**',
    redirectTo: '/not-found'
  }
];

@NgModule({
  // imports the RouterModule and defines the routes array and other options (e.g. useHash, enableTracing, scrollPositionRestoration)
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
