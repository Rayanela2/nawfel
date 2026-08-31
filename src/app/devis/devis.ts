import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParcoursService } from '../services/parcours.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-devis',
  imports: [CommonModule],
  templateUrl: './devis.html',
  styleUrl: './devis.css',
})
export class Devis implements OnInit {
  constructor(private parcoursService: ParcoursService, private router: Router) {}

  entreprise = {
    nom: 'NJ Solaire',
    adresse: 'Paris, Ile-De-Francd, France',
    tel: '0609526109',
  };

  client = {
    nom: 'Client',
    adresse: 'Adresse à confirmer',
    tel: '+33 6 00 00 00 00',
    email: 'client@email.com',
  };

  devisRef = '#2026-001';
  date = new Date().toLocaleDateString('fr-FR');
  dateValidite = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');
  statut: 'brouillon' | 'envoyé' | 'accepté' = 'envoyé';

  etapesProjet: string[] = [];

  conditionsPaiement = [
    'Validation du parcours client',
    'Planification de l’intervention',
    'Compte rendu et finalisation du dossier'
  ];

  ngOnInit(): void {
    // Redirect to the informations générales form if client info not completed
    const ok = typeof window !== 'undefined' && localStorage.getItem('informationsGeneralesComplete') === 'true';
    if (!ok) {
      // send user to the form to fill informations générales
      this.router.navigate(['/entretiens']);
      return;
    }

    this.etapesProjet = this.parcoursService.obtenirEtapesSelectionnees();

    // Prefill client info from localStorage when available
    try {
      const raw = localStorage.getItem('informationsGenerales');
      if (raw) {
        const info = JSON.parse(raw);
        if (info.clientType === 'particulier') {
          this.client.nom = info.nom || this.client.nom;
          this.client.adresse = info.adresse || this.client.adresse;
          this.client.tel = info.telephone || this.client.tel;
          this.client.email = info.email || this.client.email;
        } else {
          this.client.nom = info.societe || this.client.nom;
          this.client.adresse = info.adresse || this.client.adresse;
          this.client.tel = info.telephone || this.client.tel;
          this.client.email = info.email || this.client.email;
        }
      }
    } catch (e) {
      console.warn('Impossible de pré-remplir le devis depuis localStorage', e);
    }
  }

  exportPDF(): void {
    window.print();
  }

  envoyerParMail(): void {
    const subject = `Devis ${this.devisRef} - ${this.entreprise.nom}`;
    const detailEtapes = this.etapesProjet.map((etape) => `- ${etape}`).join('\n');
    const body = `Bonjour,\n\nVoici le devis ${this.devisRef} avec les étapes validées :\n${detailEtapes}\n\nCordialement,\n${this.entreprise.nom}`;
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${this.client.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  }
}
