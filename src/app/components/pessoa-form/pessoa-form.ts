import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PessoaService } from '../../services/pessoa.service';
import { CepService } from '../../services/cep.service';
import { FormatterService } from '../../services/formatter.service';
import { ESTADOS_BRASILEIROS, TIPOS_SANGUINEOS, SIGNOS_ZODIACAIS } from '../../constants/form-options.constants';

@Component({
  selector: 'app-pessoa-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './pessoa-form.html',
  styleUrl: './pessoa-form.css'
})
export class PessoaFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pessoaService = inject(PessoaService);
  private cepService = inject(CepService);
  private formatter = inject(FormatterService);

  private destroy$ = new Subject<void>();

  modoEdicao = signal(false);
  cpfAtual = signal<string | null>(null);
  loading = signal(false);
  salvando = signal(false);
  erro = signal<string | null>(null);

  readonly estados = ESTADOS_BRASILEIROS;
  readonly tiposSanguineos = TIPOS_SANGUINEOS;
  readonly signos = SIGNOS_ZODIACAIS;

  form = this.fb.group({
    cpf:           ['', Validators.required],
    nome:          ['', Validators.required],
    rg:            ['', Validators.required],
    data_nasc:     ['', Validators.required],
    sexo:          ['', Validators.required],
    mae:           ['', Validators.required],
    pai:           ['', Validators.required],
    email:         ['', [Validators.required, Validators.email]],
    senha:         ['', Validators.required],
    celular:       ['', Validators.required],
    telefone_fixo: [''],
    altura:        ['', Validators.required],
    peso:          ['', Validators.required],
    tipo_sanguineo:['', Validators.required],
    cor:           ['', Validators.required],
    signo:         ['', Validators.required],
    endereco:      ['', Validators.required],
    numero:        ['', Validators.required],
    bairro:        ['', Validators.required],
    cep:           ['', Validators.required],
    cidade:        ['', Validators.required],
    estado:        ['', Validators.required],
  });

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    if (cpf) {
      this.modoEdicao.set(true);
      this.cpfAtual.set(cpf);
      this.form.get('cpf')?.disable();
      this.carregarPessoa(cpf);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarPessoa(cpf: string): void {
    this.loading.set(true);
    this.pessoaService.buscarPorCpf(cpf)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pessoa) => {
          this.form.patchValue(pessoa as any);
          this.loading.set(false);
        },
        error: () => {
          this.erro.set('Erro ao carregar dados da pessoa.');
          this.loading.set(false);
        }
      });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    this.erro.set(null);
    const dados = this.form.getRawValue() as any;

    const operacao = this.modoEdicao()
      ? this.pessoaService.atualizar(this.cpfAtual()!, dados)
      : this.pessoaService.criar(dados);

    operacao.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.router.navigate(['/pessoas']),
      error: () => {
        this.erro.set('Erro ao salvar. Verifique os dados e tente novamente.');
        this.salvando.set(false);
      }
    });
  }

  onData(event: Event): void {
    this.formatter.formatarData(
      event.target as HTMLInputElement,
      (v) => this.form.get('data_nasc')?.setValue(v, { emitEvent: false })
    );
  }

  onCep(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formatter.formatarCep(
      input,
      (v) => this.form.get('cep')?.setValue(v, { emitEvent: false })
    );
    const digitos = this.formatter.extrairDigitos(input.value);
    if (digitos.length === 8) {
      this.cepService.buscar(digitos)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (dados) => {
            if (!dados.erro) {
              this.form.patchValue({
                endereco: dados.logradouro || '',
                bairro:   dados.bairro     || '',
                cidade:   dados.localidade || '',
                estado:   dados.uf         || '',
              });
            }
          }
        });
    }
  }

  onCelular(event: Event): void {
    this.formatter.formatarCelular(
      event.target as HTMLInputElement,
      (v) => this.form.get('celular')?.setValue(v, { emitEvent: false })
    );
  }

  onTelefone(event: Event): void {
    this.formatter.formatarTelefone(
      event.target as HTMLInputElement,
      (v) => this.form.get('telefone_fixo')?.setValue(v, { emitEvent: false })
    );
  }

  getControl(name: string) {
    return this.form.get(name);
  }

  isInvalid(name: string): boolean {
    const control = this.getControl(name);
    return !!(control?.invalid && control?.touched);
  }
}
