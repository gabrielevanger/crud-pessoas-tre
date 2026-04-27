export interface Pessoa {
  cpf: string;
  nome: string;
  rg: string;
  data_nasc: string;
  sexo: string;
  mae: string;
  pai: string;
  email: string;
  senha: string;
  celular: string;
  telefone_fixo: string;
  altura: string;
  peso: string;
  tipo_sanguineo: string;
  cor: string;
  signo: string;
  endereco: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  idade?: string;
  links?: { rel: string; href: string }[];
}

export interface PessoaResponse {
  items: Pessoa[];
  hasMore: boolean;
  limit: number;
  offset: number;
  count: number;
  links: { rel: string; href: string }[];
}
