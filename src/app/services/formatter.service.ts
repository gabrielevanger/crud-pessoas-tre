import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatterService {

  private aplicarMascara(input: HTMLInputElement, valor: string, controlSetter: (v: string) => void): void {
    input.value = valor;
    controlSetter(valor);
  }

  formatarData(input: HTMLInputElement, setter: (v: string) => void): void {
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length >= 5) v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    else if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    this.aplicarMascara(input, v, setter);
  }

  formatarCep(input: HTMLInputElement, setter: (v: string) => void): void {
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length >= 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
    this.aplicarMascara(input, v, setter);
  }

  formatarCelular(input: HTMLInputElement, setter: (v: string) => void): void {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length >= 7) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length >= 3) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length >= 1) v = `(${v}`;
    this.aplicarMascara(input, v, setter);
  }

  formatarTelefone(input: HTMLInputElement, setter: (v: string) => void): void {
    let v = input.value.replace(/\D/g, '').slice(0, 10);
    if (v.length >= 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    else if (v.length >= 3) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length >= 1) v = `(${v}`;
    this.aplicarMascara(input, v, setter);
  }

  extrairDigitos(valor: string): string {
    return valor.replace(/\D/g, '');
  }
}
