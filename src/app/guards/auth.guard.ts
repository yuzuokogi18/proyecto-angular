// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);

    const now = Date.now() / 1000; // tiempo actual

    if (decoded.exp && decoded.exp < now) {
      // token expirado
      localStorage.clear();
      router.navigate(['/login']);
      return false;
    }

    return true;

  } catch (error) {
    console.error("❌ Error validando token:", error);
    localStorage.clear();
    router.navigate(['/login']);
    return false;
  }
};
