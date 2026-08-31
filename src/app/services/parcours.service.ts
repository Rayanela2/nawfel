import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface ParcoursEtape {
  id: number;
  label: string;
  checked: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ParcoursService {
  private readonly isBrowser: boolean;
  private etapesSubject = new BehaviorSubject<ParcoursEtape[]>([]);
  etapes$ = this.etapesSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.etapesSubject.next(this.chargerEtapes());
    this.sauvegarderInitiales();
  }

  private chargerEtapes(): ParcoursEtape[] {
    if (!this.isBrowser) {
      return this.getEtapesParDefaut();
    }

    const stored = localStorage.getItem('devisEtapes');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getEtapesParDefaut();
      }
    }
    return this.getEtapesParDefaut();
  }

  private getEtapesParDefaut(): ParcoursEtape[] {
    return [
      { id: 1, label: 'Visite technique sur site', checked: true },
      { id: 2, label: 'Vérification de la toiture', checked: true },
      { id: 3, label: 'Étude de production', checked: true },
      { id: 4, label: 'Planification de la maintenance', checked: false },
    ];
  }

  private sauvegarderInitiales(): void {
    if (!this.isBrowser) {
      return;
    }

    if (!localStorage.getItem('devisEtapes')) {
      localStorage.setItem('devisEtapes', JSON.stringify(this.getEtapesParDefaut()));
    }
  }

  getEtapes(): ParcoursEtape[] {
    return this.etapesSubject.value;
  }

  ajouterEtape(label: string): void {
    const etapes = [...this.getEtapes(), {
      id: Date.now(),
      label,
      checked: true,
    }];
    this.sauvegarder(etapes);
  }

  mettreAJourEtape(id: number, checked: boolean): void {
    const etapes = this.getEtapes().map((etape) =>
      etape.id === id ? { ...etape, checked } : etape,
    );
    this.sauvegarder(etapes);
  }

  supprimerEtape(id: number): void {
    const etapes = this.getEtapes().filter((etape) => etape.id !== id);
    this.sauvegarder(etapes);
  }

  private sauvegarder(etapes: ParcoursEtape[]): void {
    if (this.isBrowser) {
      localStorage.setItem('devisEtapes', JSON.stringify(etapes));
    }

    this.etapesSubject.next(etapes);
  }

  obtenirEtapesSelectionnees(): string[] {
    return this.getEtapes()
      .filter((etape) => etape.checked)
      .map((etape) => etape.label);
  }
}
