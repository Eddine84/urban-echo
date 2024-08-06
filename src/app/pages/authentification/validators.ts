import { AbstractControl } from '@angular/forms';

export function passwordStrengthValidator(control: AbstractControl) {
  const hasUpperCase = /[A-Z]/.test(control.value);
  const hasLowerCase = /[a-z]/.test(control.value);
  const hasNumeric = /\d/.test(control.value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
  const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
  if (!valid) {
    // Retourne un objet d'erreur si le mot de passe ne respecte pas les critères
    return { weakPassword: true };
  }
  return null; // Retourne null si le mot de passe est valide
}
