import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CreateComponent } from './create/create.component';
import { ExploreComponent } from './explore/explore.component';
import { SigninComponent } from './signin/signin.component';
import { DeckDetailComponent } from './deck-detail/deck-detail.component';
import { StudyComponent } from './study/study.component';
import { YourDecksComponent } from './your-decks/your-decks.component';
import { YourDecksDetailComponent } from './your-decks-detail/your-decks-detail.component';
import { UpdateDeckComponent } from './update-deck/update-deck.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'create', component: CreateComponent, canActivate: [AuthGuard] },
  { path: 'explore', component: ExploreComponent, canActivate: [AuthGuard] },
  {
    path: 'deck/:id',
    component: DeckDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'studyDeck/:id',
    component: StudyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'yourDecks',
    component: YourDecksComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'yourDeck/:id',
    component: YourDecksDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'updateDeck/:id',
    component: UpdateDeckComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
