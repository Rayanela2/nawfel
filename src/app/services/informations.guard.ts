import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class InformationsGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    try {
      const ok = typeof window !== 'undefined' && localStorage.getItem('informationsGeneralesComplete') === 'true';
      if (ok) {
        return true;
      }
    } catch (e) {
      console.warn('Could not read localStorage in guard', e);
    }

    return this.router.parseUrl('/entretiens');
  }
}
