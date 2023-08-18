import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './_guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectRequestsComponent } from './project-requests/project-requests.component';
import { ProjectRequestDetailsComponent } from './project-request-details/project-request-details.component';
import { projectRequestDetailedResolver } from './_resolvers/project-request-detailed.resolver';
import { ProjectPageComponent } from './project-page/project-page.component';
import { MessagesComponent } from './messages/messages.component';
import { TeamComponent } from './team/team.component';
import { CreateRequirementComponent } from './create-requirement/create-requirement.component';
import { RequirementsOnHoldComponent } from './requirements-on-hold/requirements-on-hold.component';
import { ProjectHistoryComponent } from './project-history/project-history.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard/:id', component: DashboardComponent },
      { path: 'projects', component: ClientDashboardComponent },
      { path: 'projects/create', component: CreateProjectComponent },
      { path: 'projects/requests', component: ProjectRequestsComponent },
      { path: 'projects/requests/:id', component: ProjectRequestDetailsComponent, resolve: projectRequestDetailedResolver },
      { path: 'projects/:id', component: ProjectPageComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'teams/:id', component: TeamComponent },
      { path: 'history', component: ProjectHistoryComponent },
      { path: 'projects/:id/create-requirement', component: CreateRequirementComponent },
      { path: 'projects/:id/requirements-on-hold', component: RequirementsOnHoldComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
