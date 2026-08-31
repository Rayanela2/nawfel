import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  currentStep: number = 0;
  
  steps = [
    { id: 1, name: 'Panneaux Solaires', icon: '☀️', route: '/' },
    { id: 2, name: 'Devis', icon: '🔧', route: '/entretiens' },
    { id: 3, name: 'Creation Devis', icon: '📋', route: '/devis' },
  ];

  selectStep(stepId: number) {
    this.currentStep = stepId - 1;
  }
}
