import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParcoursService } from '../services/parcours.service';

@Component({
  selector: 'app-devis',
  imports: [CommonModule],
  templateUrl: './devis.html',
  styleUrl: './devis.css',
})
export class Devis implements OnInit {
  constructor(private parcoursService: ParcoursService) {}

  entreprise = {
    nom: 'NF Solaire',
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
    this.etapesProjet = this.parcoursService.obtenirEtapesSelectionnees();
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
