import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './_modules/shared.module';
import { ConfirmDialogComponent } from './modals/confirm-dialog/confirm-dialog.component';
import { RolesModalComponent } from './modals/roles-modal/roles-modal.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { RegisterComponent } from './register/register.component';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { DatePickerComponent } from './_forms/date-picker/date-picker.component';
import { ProjectRequestsComponent } from './project-requests/project-requests.component';
import { ProjectRequestDetailsComponent } from './project-request-details/project-request-details.component';
import { ProjectPageComponent } from './project-page/project-page.component';
import { MessagesComponent } from './messages/messages.component';
import { TeamComponent } from './team/team.component';
import { CreateRequirementComponent } from './create-requirement/create-requirement.component';
import { UnapprovedRequirementsComponent } from './unapproved-requirements/unapproved-requirements.component';
import { ProfileMessagesComponent } from './profile-messages/profile-messages.component';
import { ProfileImageComponent } from './profile-image/profile-image.component';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { RequirementsOnHoldComponent } from './requirements-on-hold/requirements-on-hold.component';
import { ProjectHistoryComponent } from './project-history/project-history.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ConfirmDialogComponent,
    RolesModalComponent,
    NotFoundComponent,
    ServerErrorComponent,
    LoginComponent,
    DashboardComponent,
    ProfileDetailsComponent,
    RegisterComponent,
    TextInputComponent,
    ClientDashboardComponent,
    CreateProjectComponent,
    DatePickerComponent,
    ProjectRequestsComponent,
    ProjectRequestDetailsComponent,
    ProjectPageComponent,
    MessagesComponent,
    TeamComponent,
    CreateRequirementComponent,
    UnapprovedRequirementsComponent,
    ProfileMessagesComponent,
    ProfileImageComponent,
    PhotoEditorComponent,
    RequirementsOnHoldComponent,
    ProjectHistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    KanbanBoardComponent,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
