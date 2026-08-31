import { Routes } from '@angular/router';
import { FirstPage } from './first-page/first-page';
import { Entretiens } from './entretiens/entretiens';
import { Devis } from './devis/devis';

export const routes: Routes = [
  { path: '', component: FirstPage },
  { path: 'entretiens', component: Entretiens },
  { path: 'devis', component: Devis },
];
