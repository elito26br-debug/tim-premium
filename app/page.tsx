'use client';

import { useEffect, useMemo, useState } from 'react';
import { CreditCard, Wallet, Plus, Search, CheckCircle2, CalendarDays, AlertTriangle } from 'lucide-react';

type Conta = {
  id: number;
  categoria: string;
  nome: string;
  valor: number;
  vencimento: string;
  status: 'EM ABERTO' | 'PAGO';
  obs: string;
};

type Cartao = {
  id: number;
  nome: string;
  limite: number;
  usado: number;
  vencimento: string;
};

const contasIniciais: Conta[] = [
  { id: 1, categoria: 'Empréstimo', nome: 'Mercado Pago', valor: 1606.79, vencimento: '2026-06-05', status: 'EM ABERTO', obs: '' },
  { id: 2, categoria: 'Empréstimo', nome: 'Mercado Pago', valor: 456.12, vencimento: '2026-06-25', status: 'EM ABERTO', obs: '6 parcelas • 3 pagas • 3 restantes' },
  { id: 3, categoria: 'Empréstimo', nome: 'Mercado Pago', valor: 162.41, vencimento: '2026-06-17', status: 'EM ABERTO', obs: '9 parcelas • 4 pagas • 5 restantes' },
  { id: 4, categoria: 'Assinatura', nome: 'Canva', valor: 35.0, vencimento: '2026-06-11', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 5, categoria: 'Assinatura', nome: 'Gran Cursos Online', valor: 74.9, vencimento: '2026-06-11', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 6, categoria: 'Assinatura', nome: 'Roku TV / Crunchyroll', valor: 19.9, vencimento: '2026-06-05', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 7, categoria: 'Assinatura', nome: 'Serasa', valor: 23.9, vencimento: '2026-06-23', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 8, categoria: 'Assinatura', nome: 'Gmail / Google', valor: 14.99, vencimento: '2026-06-23', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 9, categoria: 'Assinatura', nome: 'DramaWave', valor: 69.99, vencimento: '2026-06-14', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 10, categoria: 'Empréstimo', nome: 'Cartão Malu', valor: 133.16, vencimento: '2026-06-10', status: 'EM ABERTO', obs: '6 parcelas • 3 pagas • 3 restantes' },
  { id: 11, categoria: 'Financiamento', nome: 'Moto', valor: 0, vencimento: '2026-06-25', status: 'EM ABERTO', obs: '36 parcelas • 10 pagas • 26 restantes' },
  { id: 12, categoria: 'Empréstimo', nome: 'Denilson', valor: 1040.0, vencimento: '2026-06-08', status: 'EM ABERTO', obs: 'Inclui juros de 30%' },
];

const cartoesIniciais: Cartao[] = [
  { id: 1, nome: 'Nubank', limite: 350, usado: 352, vencimento: '10' },
  { id: 2, nome: 'Caixa', limite: 1800, usado: 1851, vencimento: '01' },
  { id: 3, nome: 'Brasil Card', limite: 100, usado: 0, vencimento: '20' },
];

function moeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function dataBR(data: string) {
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

export default function AppFinanceiroPremiumAlpha() {
  const [contas, setContas] = useState<Conta[]>(contasIniciais);
  const [cartoes, setCartoes] = useState<Cartao[]>(cartoesIniciais);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('TODAS');
  const [receitas, setReceitas] = useState({ salario: 0, valeAlimentacao: 0, extras: 0 });

  const [modalConta, setModalConta] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [novaConta, setNovaConta] = useState({
    nome: '',
    categoria: 'Assinatura',
    valor: '',
    vencimento: '',
    obs: '',
  });

  const [modalReceitas, setModalReceitas] = useState(false);
  const [modalCartao, setModalCartao] = useState(false);
  const [acaoCartao, setAcaoCartao] = useState({ tipo: '', cartaoId: 0, valor: '' });

  useEffect(() => {
    const contasSalvas = localStorage.getItem('alpha-finance-contas');
    const cartoesSalvos = localStorage.getItem('alpha-finance-cartoes');
    const receitasSalvas = localStorage.getItem('alpha-finance-receitas');

    if (contasSalvas) setContas(JSON.parse(contasSalvas));
    if (cartoesSalvos) setCartoes(JSON.parse(cartoesSalvos));
    if (receitasSalvas) setReceitas(JSON.parse(receitasSalvas));
  }, []);

  useEffect(() => {
    localStorage.setItem('alpha-finance-contas', JSON.stringify(contas));
  }, [contas]);

  useEffect(() => {
    localStorage.setItem('alpha-finance-cartoes', JSON.stringify(cartoes));
  }, [cartoes]);

  useEffect(() => {
    localStorage.setItem('alpha-finance-receitas', JSON.stringify(receitas));
  }, [receitas]);

  const contasFiltradas = contas.filter((conta) => {
    const combinaBusca =
      conta.nome.toLowerCase().includes(busca.toLowerCase()) ||
      conta.categoria.toLowerCase().includes(busca.toLowerCase()) ||
      conta.obs.toLowerCase().includes(busca.toLowerCase());

    const combinaFiltro = filtro === 'TODAS' || conta.status === filtro;

    return combinaBusca && combinaFiltro;
  });

  const resumo = useMemo(() => {
    const total = contas.reduce((soma, conta) => soma + conta.valor, 0);
    const pago = contas.filter((c) => c.status === 'PAGO').reduce((soma, conta) => soma + conta.valor, 0);
    const aberto = contas.filter((c) => c.status === 'EM ABERTO').reduce((soma, conta) => soma + conta.valor, 0);
    const totalReceitas = Number(receitas.salario || 0) + Number(receitas.valeAlimentacao || 0) + Number(receitas.extras || 0);

    return {
      total,
      pago,
      aberto,
      qtdAberto: contas.filter((c) => c.status === 'EM ABERTO').length,
      totalReceitas,
      saldo: totalReceitas - aberto,
    };
  }, [contas, receitas]);

  function salvarConta() {
    if (!novaConta.nome || !novaConta.valor || !novaConta.vencimento) return;

    if (editandoId) {
      setContas((atuais) =>
        atuais.map((conta) =>
          conta.id === editandoId
            ? {
                ...conta,
                nome: novaConta.nome,
                categoria: novaConta.categoria,
                valor: Number(novaConta.valor),
                vencimento: novaConta.vencimento,
                obs: novaConta.obs,
              }
            : conta
        )
      );
    } else {
      const contaCriada: Conta = {
        id: Date.now(),
        nome: novaConta.nome,
        categoria: novaConta.categoria,
        valor: Number(novaConta.valor),
        vencimento: novaConta.vencimento,
        status: 'EM ABERTO',
        obs: novaConta.obs,
      };

      setContas((atuais) => [...atuais, contaCriada]);
    }

    setNovaConta({ nome: '', categoria: 'Assinatura', valor: '', vencimento: '', obs: '' });
    setEditandoId(null);
    setModalConta(false);
  }

  function editarConta(conta: Conta) {
    setEditandoId(conta.id);
    setNovaConta({
      nome: conta.nome,
      categoria: conta.categoria,
      valor: String(conta.valor),
      vencimento: conta.vencimento,
      obs: conta.obs || '',
    });
    setModalConta(true);
  }

  function apagarConta(id: number) {
    setContas((atuais) => atuais.filter((conta) => conta.id !== id));
  }

  function alternarStatus(id: number) {
    setContas((atuais) =>
      atuais.map((conta) =>
        conta.id === id
          ? { ...conta, status: conta.status === 'PAGO' ? 'EM ABERTO' : 'PAGO' }
          : conta
      )
    );
  }

  function statusConta(conta: Conta) {
    if (conta.status === 'PAGO') return { texto: 'Pago', cor: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };

    const hoje = new Date();
    const venc = new Date(conta.vencimento + 'T00:00:00');
    const dias = Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (dias < 0) return { texto: 'Vencida', cor: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
    if (dias <= 5) return { texto: 'Vence em breve', cor: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };
    return { texto: 'Em aberto', cor: 'text-blue-300', bg: 'bg-blue-500/10 border-blue-500/30' };
  }

  function confirmarAcaoCartao() {
    const valor = Number(acaoCartao.valor);
    if (!valor || valor <= 0) return;

    setCartoes((atuais) =>
      atuais.map((cartao) =>
        cartao.id === acaoCartao.cartaoId
          ? {
              ...cartao,
              usado:
                acaoCartao.tipo === 'gasto'
                  ? cartao.usado + valor
                  : Math.max(0, cartao.usado - valor),
            }
          : cartao
      )
    );

    setModalCartao(false);
    setAcaoCartao({ tipo: '', cartaoId: 0, valor: '' });
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <div>
            <p className="text-purple-400 font-black tracking-[0.2em]">ALPHA FINANCE</p>
            <h1 className="text-4xl md:text-6xl font-black mt-2">Controle Financeiro Premium</h1>
            <p className="text-zinc-400 mt-3">App visual para controlar contas, cartões, vencimentos e pagamentos.</p>
          </div>

          <button
            onClick={() => setModalConta(true)}
            className="bg-purple-600 hover:bg-purple-700 rounded-2xl px-6 py-4 font-bold flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Nova conta
          </button>
        </header>

        <section className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-3xl bg-purple-900/50 border border-purple-500/40 p-5">
            <Wallet />
            <p className="text-zinc-300 mt-4">Total do mês</p>
            <h2 className="text-3xl font-black">{moeda(resumo.total)}</h2>
          </div>

          <div className="rounded-3xl bg-yellow-500/5 border border-yellow-500/40 p-5">
            <AlertTriangle className="text-yellow-400" />
            <p className="text-zinc-300 mt-4">Em aberto</p>
            <h2 className="text-3xl font-black text-yellow-400">{moeda(resumo.aberto)}</h2>
          </div>

          <div className="rounded-3xl bg-emerald-500/5 border border-emerald-500/40 p-5">
            <CheckCircle2 className="text-emerald-400" />
            <p className="text-zinc-300 mt-4">Pago</p>
            <h2 className="text-3xl font-black text-emerald-400">{moeda(resumo.pago)}</h2>
          </div>

          <div className="rounded-3xl bg-red-500/5 border border-red-500/40 p-5">
            <CalendarDays className="text-red-400" />
            <p className="text-zinc-300 mt-4">Contas abertas</p>
            <h2 className="text-3xl font-black text-red-400">{resumo.qtdAberto}</h2>
          </div>
        </section>

        <section className="rounded-3xl bg-zinc-950 border border-zinc-800 p-5 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-black">Entradas do mês</h2>
              <p className="text-zinc-400">Salário, vale alimentação e dinheiro extra.</p>
            </div>

            <button
              onClick={() => setModalReceitas(true)}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl px-4 py-3 font-bold"
            >
              Editar entradas
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-black rounded-2xl p-4 border border-zinc-800">
              <p className="text-zinc-400">Salário</p>
              <p className="text-2xl font-black">{moeda(Number(receitas.salario || 0))}</p>
            </div>

            <div className="bg-black rounded-2xl p-4 border border-zinc-800">
              <p className="text-zinc-400">Vale alimentação</p>
              <p className="text-2xl font-black">{moeda(Number(receitas.valeAlimentacao || 0))}</p>
            </div>

            <div className="bg-black rounded-2xl p-4 border border-zinc-800">
              <p className="text-zinc-400">Extras</p>
              <p className="text-2xl font-black">{moeda(Number(receitas.extras || 0))}</p>
            </div>

            <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/30">
              <p className="text-zinc-300">Total recebido</p>
              <p className="text-2xl font-black text-emerald-400">{moeda(resumo.totalReceitas)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-zinc-950 border border-zinc-800 p-5 md:p-6 mb-8">
          <h2 className="text-2xl font-black mb-5 flex items-center gap-2">
            <CreditCard className="text-purple-400" />
            Meus Cartões
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {cartoes.map((cartao) => {
              const usadoAutomatico =
                cartao.nome === 'Nubank'
                  ? contas
                      .filter((conta) => conta.status === 'EM ABERTO' && conta.obs?.includes('Cartão Nubank'))
                      .reduce((soma, conta) => soma + Number(conta.valor || 0), 0)
                  : cartao.usado;

              const disponivel = cartao.limite - usadoAutomatico;
              const percentual = Math.min((usadoAutomatico / cartao.limite) * 100, 100);

              return (
                <div key={cartao.id} className="bg-black rounded-3xl p-5 border border-zinc-800">
                  <p className="text-zinc-400 text-sm">Cartão</p>
                  <h3 className="text-2xl font-black">{cartao.nome}</h3>

                  <div className="mt-4 space-y-2">
                    <p>Limite total: <b>{moeda(cartao.limite)}</b></p>
                    <p>Usado: <b className="text-red-400">{moeda(usadoAutomatico)}</b></p>
                    <p>
                      Disponível:{' '}
                      <b className={disponivel >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {moeda(disponivel)}
                      </b>
                    </p>
                    <p className="text-zinc-400">Vencimento: dia {cartao.vencimento}</p>
                  </div>

                  {cartao.nome !== 'Nubank' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          setAcaoCartao({ tipo: 'gasto', cartaoId: cartao.id, valor: '' });
                          setModalCartao(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-bold"
                      >
                        + Gasto
                      </button>

                      <button
                        onClick={() => {
                          setAcaoCartao({ tipo: 'pagamento', cartaoId: cartao.id, valor: '' });
                          setModalCartao(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm font-bold"
                      >
                        - Pagamento
                      </button>
                    </div>
                  )}

                  <div className="w-full bg-zinc-800 h-3 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${percentual}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-zinc-950 border border-zinc-800 p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <CreditCard className="text-purple-400" />
                Minhas contas
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar conta..."
                    className="bg-black border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 outline-none"
                  />
                </div>

                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="bg-black border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
                >
                  <option value="TODAS">Todas</option>
                  <option value="EM ABERTO">Em aberto</option>
                  <option value="PAGO">Pago</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {contasFiltradas.map((conta) => {
                const st = statusConta(conta);

                return (
                  <div key={conta.id} className="bg-black border border-zinc-800 rounded-3xl p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">{conta.categoria}</span>
                          <span className={`px-3 py-1 rounded-full border text-sm ${st.bg} ${st.cor}`}>{st.texto}</span>
                        </div>

                        <h3 className="text-2xl font-black">{conta.nome}</h3>
                        <p className="text-zinc-400">Vence em {dataBR(conta.vencimento)} {conta.obs ? `• ${conta.obs}` : ''}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-2xl font-black">{moeda(conta.valor)}</p>

                        <button
                          onClick={() => alternarStatus(conta.id)}
                          className={conta.status === 'PAGO' ? 'bg-emerald-600 px-4 py-3 rounded-2xl font-bold' : 'bg-yellow-600 px-4 py-3 rounded-2xl font-bold'}
                        >
                          {conta.status === 'PAGO' ? 'Pago' : 'Em aberto'}
                        </button>

                        <button onClick={() => editarConta(conta)} className="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-2xl font-bold">
                          Editar
                        </button>

                        <button onClick={() => apagarConta(conta.id)} className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-2xl font-bold">
                          Apagar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="rounded-3xl bg-zinc-950 border border-zinc-800 p-5 md:p-6 h-fit">
            <h2 className="text-2xl font-black mb-5">Resumo visual</h2>

            <div className="space-y-4">
              <p className="text-zinc-400">Pago <span className="float-right text-white">{moeda(resumo.pago)}</span></p>
              <div className="w-full bg-black h-4 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${resumo.total ? (resumo.pago / resumo.total) * 100 : 0}%` }} />
              </div>

              <p className="text-zinc-400">Em aberto <span className="float-right text-white">{moeda(resumo.aberto)}</span></p>
              <div className="w-full bg-black h-4 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${resumo.total ? (resumo.aberto / resumo.total) * 100 : 0}%` }} />
              </div>

              <div className="mt-6 rounded-2xl bg-black border border-zinc-800 p-4">
                <p className="text-zinc-400">Saldo previsto</p>
                <h3 className={`text-2xl font-black ${resumo.saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {moeda(resumo.saldo)}
                </h3>
              </div>
            </div>
          </aside>
        </section>

        {modalCartao && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-purple-500/40 p-6 shadow-2xl">
              <h2 className="text-2xl font-black mb-4">
                {acaoCartao.tipo === 'gasto' ? 'Adicionar gasto' : 'Registrar pagamento'}
              </h2>

              <input
                type="number"
                value={acaoCartao.valor}
                onChange={(e) => setAcaoCartao({ ...acaoCartao, valor: e.target.value })}
                placeholder="Digite o valor"
                className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-purple-500 mb-4"
              />

              <div className="flex gap-3">
                <button onClick={confirmarAcaoCartao} className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-2xl py-3 font-bold">
                  Salvar
                </button>

                <button
                  onClick={() => {
                    setModalCartao(false);
                    setAcaoCartao({ tipo: '', cartaoId: 0, valor: '' });
                  }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 rounded-2xl py-3 font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {modalReceitas && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-emerald-500/40 p-6 shadow-2xl">
              <h2 className="text-2xl font-black mb-4">Editar entradas</h2>

              <div className="space-y-4">
                <input type="number" value={receitas.salario} onChange={(e) => setReceitas({ ...receitas, salario: Number(e.target.value) })} placeholder="Salário" className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3" />
                <input type="number" value={receitas.valeAlimentacao} onChange={(e) => setReceitas({ ...receitas, valeAlimentacao: Number(e.target.value) })} placeholder="Vale alimentação" className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3" />
                <input type="number" value={receitas.extras} onChange={(e) => setReceitas({ ...receitas, extras: Number(e.target.value) })} placeholder="Extras" className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3" />
              </div>

              <button onClick={() => setModalReceitas(false)} className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 rounded-2xl py-3 font-bold">
                Salvar
              </button>
            </div>
          </div>
        )}

        {modalConta && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-xl rounded-3xl bg-zinc-950 border border-purple-500/40 p-6 shadow-2xl">
              <h2 className="text-3xl font-black mb-5">{editandoId ? 'Editar conta' : 'Nova conta'}</h2>

              <div className="space-y-4">
                <input value={novaConta.nome} onChange={(e) => setNovaConta({ ...novaConta, nome: e.target.value })} placeholder="Nome da conta" className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3" />

                <select value={novaConta.categoria} onChange={(e) => setNovaConta({ ...novaConta, categoria: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3">
                  <option>Assinatura</option>
                  <option>Empréstimo</option>
                  <option>Financiamento</option>
                  <option>Cartão</option>
                  <option>Outros</option>
                </select>

                <input type="number" value={novaConta.valor} onChange={(e) => setNovaConta({ ...novaConta, valor: e.target.value })} placeholder="Valor" className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3" />
                <input type="date" value={novaConta.vencimento} onChange={(e) => setNovaConta({ ...novaConta, vencimento: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3" />
                <input value={novaConta.obs} onChange={(e) => setNovaConta({ ...novaConta, obs: e.target.value })} placeholder="Observação" className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3" />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={salvarConta} className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-2xl py-4 font-bold">
                  {editandoId ? 'Salvar edição' : 'Salvar conta'}
                </button>

                <button
                  onClick={() => {
                    setModalConta(false);
                    setEditandoId(null);
                    setNovaConta({ nome: '', categoria: 'Assinatura', valor: '', vencimento: '', obs: '' });
                  }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 rounded-2xl py-4 font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}