import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { PessoaService } from '../../services/pessoa.service';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-pessoa-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './pessoa-list.html',
  styleUrl: './pessoa-list.css'
})
export class PessoaListComponent implements OnInit, OnDestroy {
  private pessoaService = inject(PessoaService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private busca$ = new Subject<string>();

  pessoas = signal<Pessoa[]>([]);
  loading = signal(false);
  erro = signal<string | null>(null);
  offset = signal(0);
  hasMore = signal(false);
  busca = signal('');

  readonly limite = 25;

  ngOnInit() {
    this.busca$
      .pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(termo => {
        this.offset.set(0);
        this.carregar(termo);
      });

    this.carregar();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBusca(termo: string) {
    this.busca.set(termo);
    this.busca$.next(termo);
  }

  carregar(termo = this.busca()) {
    this.loading.set(true);
    this.erro.set(null);

    const req = termo.trim()
      ? this.pessoaService.pesquisar(termo.trim(), this.offset())
      : this.pessoaService.listar(this.offset());

    req.subscribe({
      next: (res) => {
        this.pessoas.set(res.items);
        this.hasMore.set(res.hasMore);
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar pessoas. Verifique sua conexão e tente novamente.');
        this.loading.set(false);
      }
    });
  }

  proximo() {
    this.offset.set(this.offset() + this.limite);
    this.carregar();
  }

  anterior() {
    this.offset.set(Math.max(0, this.offset() - this.limite));
    this.carregar();
  }

  editar(cpf: string) {
    this.router.navigate(['/pessoas', cpf, 'editar']);
  }

  excluir(pessoa: Pessoa) {
    if (!confirm(`Deseja realmente excluir "${pessoa.nome}"?`)) return;
    this.pessoaService.excluir(pessoa.cpf).subscribe({
      next: () => this.carregar(),
      error: () => alert('Erro ao excluir registro. Tente novamente.')
    });
  }

  paginaAtual() {
    return Math.floor(this.offset() / this.limite) + 1;
  }
}
