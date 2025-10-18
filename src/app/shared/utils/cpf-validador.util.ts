import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cpfValidador(control: AbstractControl): ValidationErrors | null {
  const cpf = (control.value || '').replace(/\D/g, '');
  if (!cpf) return null;
  if (cpf.length !== 11) return { cpfInvalido: true };
  if (/^(\d)\1+$/.test(cpf)) return { cpfInvalido: true };

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += +cpf[i] * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== +cpf[9]) return { cpfInvalido: true };

  soma = 0;
  for (let i = 0; i < 10; i++) soma += +cpf[i] * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== +cpf[10]) return { cpfInvalido: true };

  return null;
}
