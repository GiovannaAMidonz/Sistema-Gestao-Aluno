import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


const TIPOS_FOTO = ['image/jpeg', 'image/png'];
const TAMANHO_MAX_FOTO = 5 * 1024 * 1024;


export function validarArquivoFoto(arquivo: File): string | null {
  if (!TIPOS_FOTO.includes(arquivo.type)) {
    return 'Formato inválido. Envie uma imagem JPG ou PNG.';
  }
  if (arquivo.size > TAMANHO_MAX_FOTO) {
    return 'A foto deve ter no máximo 5 MB.';
  }
  return null;
}


export function somenteDigitos(valor: string | null | undefined): string {
  return (valor ?? '').replace(/\D/g, '');
}


const NOME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '’-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

export function nomeCompletoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = (control.value ?? '').trim();
    if (!valor) {
      return null;
    }
    if (valor.length < 3 || valor.length > 120) {
      return { nomeTamanho: true };
    }
    return NOME_REGEX.test(valor) ? null : { nomeCaracteres: true };
  };
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = somenteDigitos(control.value);
    if (!cpf) {
      return null;
    }
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return { cpfInvalido: true };
    }

    const calcularDigito = (base: string, pesoInicial: number): number => {
      const soma = [...base].reduce((acc, d, i) => acc + Number(d) * (pesoInicial - i), 0);
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    const dv1 = calcularDigito(cpf.substring(0, 9), 10);
    const dv2 = calcularDigito(cpf.substring(0, 10), 11);
    const valido = dv1 === Number(cpf[9]) && dv2 === Number(cpf[10]);

    return valido ? null : { cpfInvalido: true };
  };
}

export function telefoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const tel = somenteDigitos(control.value);
    if (!tel) {
      return null;
    }
    const valido = /^[1-9][1-9]\d{8}$/.test(tel) || /^[1-9][1-9]9\d{8}$/.test(tel);
    return valido ? null : { telefoneInvalido: true };
  };
}

export function mascaraCpf(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
}

export function mascaraTelefone(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 11);
  if (d.length <= 2) {
    return d.length ? `(${d}` : '';
  }
  const ddd = d.slice(0, 2);
  const numero = d.slice(2);
  const corte = numero.length > 8 ? 5 : 4;
  return numero.length > corte
    ? `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`
    : `(${ddd}) ${numero}`;
}
