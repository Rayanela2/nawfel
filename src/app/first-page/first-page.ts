import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ParcoursService, ParcoursEtape } from '../services/parcours.service';

@Component({
  selector: 'app-first-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './first-page.html',
  styleUrls: ['./first-page.css'],
})
export class FirstPage implements OnInit {
  constructor(private router: Router, public parcoursService: ParcoursService) {}

  ngOnInit(): void {
    this.parcoursEtapes = this.parcoursService.getEtapes();
  }

  mainTitle = 'En Moyenne 20% de rendement perdu sans entretiens réguliers';
  subtitle = 'Nettoyage, controle et maintenant préventive : nous veillons au bon etat de votre installation photovoltaïque pour vous aider à preserver ses performances dans le temps';
  trustPill = 'Entreprise assurée • Intervention partout en Ile-de-France • Spécialiste photovoltaïque';
  ctaLabel = 'Créer mon devis';
  ctaSubtext = 'Réponse rapide sous 24h';
  contactEmail = 'contact@njsolaire.fr';
  
  services = [
    {
      icon: '',
      title: 'Nettoyage professionnel à l\'eau osmosée',
      description: 'Nettoyage sans résidu pour une performance optimale'
    },
    {
      icon: '',
      title: 'Intervention sécurisée',
      description: 'Protocoles de sécurité stricts et assurance complète'
    },
    {
      icon: '',
      title: 'Spécialiste photovoltaïque',
      description: 'Expertise reconnue en installation et maintenance'
    }
  ];

  guarantees = [
    'Nettoyage des panneaux',
    'Controle visuel de l\'installation',
    'Maintenance preventive ',
    'Rapport d\'intervention',
    'Signalement des anomalies',
  ];

  whyItems = [
    {
      id: 1,
      question: 'Une Expertise Photovoltaique',
      answer: 'Nous sommes spécialisés dans l\'entretiens et la maintenance des installations photovoltaïques',
    },
    {
      id: 2,
      question: 'Une approche préventive',
      answer: 'Notre Objectif n\'est pas seulement de nettoyer vos panneaux, mais aussi de contribuer à détecter les problèmes avant qu\'ils n\'entrainent une baisse de production ou une panne',
    },
    {
      id: 3,
      question: 'Un suivi transparent',
      answer: 'Vous savez ce qui a été realisé et ce qui a été constaté lors de chaque intervention',
    },
     {
      id: 4,
      question: 'Pour Particuliers et Professionnels',
      answer: 'Nous intervenons sur les installations résidentielles comme sur les installations professionnelles: toitures, ombrières, centrales au sol',
    },
    {
      id: 5,
      question: 'Entretiens ponctuel ou régulier',
      answer: 'Vous pouvez faire appel à nous pour une intervention unique ou mettre en place un programme de maintenance préventive',
    }
    ,
    {
      id: 6,
      question: 'Un service simple et fiable',
      answer: 'Devis clair, intervention planifié et compte rendu après passage.',
    }
  ];
  activeWhyItemId: number | null = 1;

  parcoursEtapes: ParcoursEtape[] = [];
  nouvelleEtape = '';
  messageAjout = '';
  private messageTimeoutId: number | null = null;

  onEtapeChange(id: number, checked: boolean): void {
    this.parcoursService.mettreAJourEtape(id, checked);
  }

  supprimerEtape(id: number): void {
    this.parcoursService.supprimerEtape(id);
    this.parcoursEtapes = this.parcoursService.getEtapes();
  }

  toggleWhyItem(id: number): void {
    this.activeWhyItemId = this.activeWhyItemId === id ? null : id;
  }

  ajouterEtape(): void {
    const valeur = this.nouvelleEtape.trim();
    if (!valeur) {
      return;
    }

    this.parcoursService.ajouterEtape(valeur);
    this.parcoursEtapes = this.parcoursService.getEtapes();
    this.nouvelleEtape = '';
    this.messageAjout = `"${valeur}" ajoutée au devis ✅`;

    if (this.messageTimeoutId) {
      clearTimeout(this.messageTimeoutId);
    }

    this.messageTimeoutId = window.setTimeout(() => {
      this.messageAjout = '';
    }, 3000);
  }

  allerAuDevis(): void {
    this.router.navigate(['/devis']);
  }

  contacter(): void {
    const email = this.contactEmail || 'contact@njsolaire.fr';
    const subject = encodeURIComponent('Demande de contact - NJ Solaire');
    window.location.href = `mailto:${email}?subject=${subject}`;
  }

  callNumber(): void {
    // Use international format to improve compatibility on some devices
    const tel = 'tel:+33609526109';
    window.location.href = tel;
  }
}
