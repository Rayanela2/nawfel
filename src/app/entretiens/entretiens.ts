import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entretiens',
  imports: [CommonModule, FormsModule],
  templateUrl: './entretiens.html',
  styleUrls: ['./entretiens.css'],
})
export class Entretiens {
  maintenanceDone: boolean = false;
  dossierRef = 'Réf-2026-0042';
  headerGifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjh3d2x6Y25hN2NnYzhqYWpwM2pmbWQwd2k2YmN6MG1qN2tlYWgwNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/rfMv3gKQwJHfW/giphy.gif';
  telephone = '';
  toitureType = 'Tuiles';
  nombrePhotovoltaiques: number | null = null;
  intervenant = '';
  installationType = 'Photovoltaïque Résidentiel';
  commentaires = '';
  destinationEmail = 'njfuturepro@gmail.com';
  toitureTypes = [
    'Tuiles',
    'Ardoise',
    'Toit plat',
    'Bac acier',
    'Autre'
  ];
  installationTypes = [
    'Photovoltaïque Résidentiel',
    'Autoconsommation Pro',
    'Site industriel'
  ];
  suggestions = [
    'Nettoyage des panneaux',
    'Ajout stockage batterie'
  ];

  // New fields for client type
  clientType: 'particulier' | 'professionnel' = 'particulier';
  clientNom = '';
  clientPrenom = '';
  clientAdresse = '';
  clientTelephone = '';
  clientEmail = '';
  installationNature = '';
  installationPuissance: number | null = null;
  // Professional fields
  companyName = '';
  siret = '';
  contactContactNom = '';
  contactContactPrenom = '';
  contactPerson = '';
  companyAddress = '';
  companyTelephone = '';
  companyEmail = '';
  tvaNumber = '';
  companyActivity = '';
  // Installation type checkboxes for professionals
  installationTypeOptions = ['Toiture', 'Ombrière', 'Au sol', 'Autre'];
  selectedInstallationTypes: { [key: string]: boolean } = {};
  // Besoins options
  besoinsOptions = [
    'Maintenance préventive',
    'Nettoyage des panneaux',
    'Contrôle / diagnostic',
    'Dépannage',
    'Contrat de maintenance',
    'Autre'
  ];
  selectedBesoins: { [key: string]: boolean } = {};
  autreBesoinText = '';
  besoinMessage = '';

  get dynamicHeaderTitle(): string {
    return this.maintenanceDone
      ? 'Compte rendu d’entretien finalisé'
      : 'Entretien des panneaux solaires';
  }

  constructor(private router: Router) {}

  // Save minimal 'informations generales' to localStorage
  saveInformationsGenerales(): void {
    const payload: any = { clientType: this.clientType };

    if (this.clientType === 'particulier') {
      payload.nom = this.clientNom;
      payload.prenom = this.clientPrenom;
      payload.adresse = this.clientAdresse;
      payload.telephone = this.clientTelephone;
      payload.email = this.clientEmail;
    } else {
      payload.societe = this.companyName;
      payload.contactNom = this.contactContactNom;
      payload.contactPrenom = this.contactContactPrenom;
      payload.adresse = this.companyAddress;
      payload.telephone = this.companyTelephone;
      payload.email = this.companyEmail;
    }

    const validParticulier = this.clientType !== 'particulier' || (this.clientNom.trim() && this.clientTelephone.trim() && this.clientEmail.trim());
    const validProfessionnel = this.clientType !== 'professionnel' || (this.companyName.trim() && this.companyTelephone.trim() && this.companyEmail.trim());

    if (!validParticulier || !validProfessionnel) {
      alert('Veuillez remplir au minimum le nom, téléphone et email du contact avant de sauvegarder.');
      return;
    }

    try {
      localStorage.setItem('informationsGenerales', JSON.stringify(payload));
      localStorage.setItem('informationsGeneralesComplete', 'true');
      alert('Informations générales sauvegardées.');
    } catch (e) {
      console.error('Erreur lors de la sauvegarde dans localStorage', e);
      alert('Impossible de sauvegarder les informations localement.');
    }
  }

  saveAndGoToDevis(): void {
    this.saveInformationsGenerales();
    const ok = localStorage.getItem('informationsGeneralesComplete') === 'true';
    if (ok) {
      this.router.navigate(['/devis']);
    }
  }

  sendAndGoToDevis(): void {
    this.saveInformationsGenerales();
    const ok = localStorage.getItem('informationsGeneralesComplete') === 'true';
    if (!ok) {
      return;
    }

    const destinataire = this.destinationEmail || 'njfuturepro@gmail.com';
    const subject = `Informations générales - ${this.dossierRef}`;

    const lines: string[] = [];
    lines.push(`Dossier: ${this.dossierRef}`);
    lines.push('');
    lines.push('Informations générales:');
    lines.push(`Type de client: ${this.clientType}`);
    if (this.clientType === 'particulier') {
      lines.push(`Nom: ${this.clientNom}`);
      lines.push(`Prénom: ${this.clientPrenom}`);
      lines.push(`Adresse: ${this.clientAdresse}`);
      lines.push(`Téléphone: ${this.clientTelephone}`);
      lines.push(`Email: ${this.clientEmail}`);
    } else {
      lines.push(`Société: ${this.companyName}`);
      lines.push(`Contact: ${this.contactContactNom} ${this.contactContactPrenom}`);
      lines.push(`Adresse société: ${this.companyAddress}`);
      lines.push(`Téléphone société: ${this.companyTelephone}`);
      lines.push(`Email société: ${this.companyEmail}`);
    }

    const body = lines.join('\n');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destinataire)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:${destinataire}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    if (!win) {
      window.location.href = mailtoUrl;
    }

    try {
      localStorage.setItem('informationsGeneralesSent', 'true');
    } catch (e) {
      console.warn('localStorage not available', e);
    }

    // navigate to devis so user can review and send the quote
    this.router.navigate(['/devis']);
  }

  canSend(): boolean {
    if (this.clientType === 'particulier') {
      return this.emailIsValid(this.clientEmail) && this.phoneIsValid(this.clientTelephone) && !!(this.clientNom && this.clientNom.trim());
    }
    // professionnel
    return this.emailIsValid(this.companyEmail) && this.phoneIsValid(this.companyTelephone) && !!(this.companyName && this.companyName.trim());
  }

  emailIsValid(email: string): boolean {
    if (!email) { return false; }
    // simple RFC-like check
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  phoneIsValid(phone: string): boolean {
    if (!phone) { return false; }
    const digits = phone.replace(/\D/g, '');
    // accept French numbers (10 digits) or international with country code (>=9)
    return digits.length >= 9 && digits.length <= 15;
  }

  sendEntretienEmail(): void {
    const statutMaintenance = this.maintenanceDone ? 'Oui' : 'Non';
    const telephone = this.telephone || 'Non renseigné';
    const typeToiture = this.toitureType || 'Non renseigné';
    const nombrePhotovoltaiques = this.nombrePhotovoltaiques ?? 'Non renseigné';
    const intervenant = this.intervenant || 'Non renseigné';
    const typeInstallation = this.installationType || 'Non renseigné';
    const commentaires = this.commentaires || 'Aucun commentaire';
    const destinataire = this.destinationEmail.trim();
    const clientType = this.clientType || 'Non renseigné';
    const clientNom = this.clientNom || 'Non renseigné';
    const clientPrenom = this.clientPrenom || 'Non renseigné';
    const clientAdresse = this.clientAdresse || 'Non renseigné';
    const clientTelephone = this.clientTelephone || 'Non renseigné';
    const clientEmail = this.clientEmail || 'Non renseigné';
    const installationNature = this.installationNature || 'Non renseigné';
    const installationPuissance = this.installationPuissance ?? 'Non renseigné';
    const companyName = this.companyName || 'Non renseigné';
    const siret = this.siret || 'Non renseigné';
    const contactNom = this.contactContactNom || 'Non renseigné';
    const contactPrenom = this.contactContactPrenom || 'Non renseigné';
    const contactPerson = `${contactNom} ${contactPrenom}`;
    const companyAddress = this.companyAddress || 'Non renseigné';
    const companyTelephone = this.companyTelephone || 'Non renseigné';
    const companyEmail = this.companyEmail || 'Non renseigné';
    const tvaNumber = this.tvaNumber || 'Non renseigné';
    const companyActivity = this.companyActivity || 'Non renseigné';
    const selectedInstallation = Object.keys(this.selectedInstallationTypes).filter(k => this.selectedInstallationTypes[k]);
    const selectedBesoinsList = Object.keys(this.selectedBesoins).filter(k => this.selectedBesoins[k]);
    const autreBesoin = this.autreBesoinText || '';
    const besoinMessageText = this.besoinMessage || '';

    if (!destinataire || !destinataire.includes('@')) {
      alert('Veuillez saisir une adresse email valide.');
      return;
    }

    const subject = `Compte rendu entretien solaire - ${this.dossierRef}`;
    const body = [
      `Dossier client: ${this.dossierRef}`,
      '',
      '1) Informations générales',
      `- Type de client: ${clientType}`,
      `- Nom: ${clientNom}`,
      `- Prénom: ${clientPrenom}`,
      `- Adresse: ${clientAdresse}`,
      `- Téléphone client: ${clientTelephone}`,
      `- Email client: ${clientEmail}`,
      `- Type de toiture: ${typeToiture}`,
      `- Nombre de photovoltaïques: ${nombrePhotovoltaiques}`,
      `- Intervenant: ${intervenant}`,
      `- Type d\'installation: ${typeInstallation}`,
      `- Nature de l\'installation: ${installationNature}`,
      `- Puissance (kWc): ${installationPuissance}`,
      '',
      'Informations société (si professionnel)',
      `- Société: ${companyName}`,
      `- SIRET: ${siret}`,
      `- Contact: ${contactPerson}`,
      `- Adresse société: ${companyAddress}`,
      `- Téléphone société: ${companyTelephone}`,
      `- Email société: ${companyEmail}`,
      `- TVA intra: ${tvaNumber}`,
      `- Activité: ${companyActivity}`,
      `- Types d'installation: ${selectedInstallation.length ? selectedInstallation.join(', ') : 'Non renseigné'}`,
      `- Besoins: ${selectedBesoinsList.length ? selectedBesoinsList.join(', ') : 'Non renseigné'}`,
      `- Autre besoin précisé: ${autreBesoin}`,
      `- Message besoin: ${besoinMessageText}`,
      '',
      '2) Performance & maintenance',
      `- Maintenance effectuée: ${statutMaintenance}`,
      `- Commentaires techniques: ${commentaires}`
    ].join('\n');

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destinataire)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:${destinataire}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const gmailWindow = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    if (!gmailWindow) {
      window.location.href = mailtoUrl;
    }
  }
}
