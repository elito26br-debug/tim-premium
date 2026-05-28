'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, AlertTriangle, CheckCircle2, CalendarDays, Plus, Search, TrendingDown, PieChart, Smartphone } from 'lucide-react';

const contasIniciais = [
  { id: 1, categoria: 'Empréstimo', nome: 'Mercado Pago', valor: 1606.79, vencimento: '2026-06-05', status: 'EM ABERTO', obs: '' },
  { id: 2, categoria: 'Empréstimo', nome: 'Mercado Pago', valor: 456.12, vencimento: '2026-06-25', status: 'EM ABERTO', obs: '6 parcelas • 3 pagas • 3 restantes' },
  { id: 3, categoria: 'Empréstimo', nome: 'Mercado Pago', valor: 162.41, vencimento: '2026-06-17', status: 'EM ABERTO', obs: '9 parcelas • 4 pagas • 5 restantes' },
  { id: 4, categoria: 'Assinatura', nome: 'Canva', valor: 35.00, vencimento: '2026-06-11', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 5, categoria: 'Assinatura', nome: 'Gran Cursos Online', valor: 74.90, vencimento: '2026-06-11', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 6, categoria: 'Assinatura', nome: 'Roku TV / Crunchyroll', valor: 19.90, vencimento: '2026-06-05', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 7, categoria: 'Assinatura', nome: 'Serasa', valor: 23.90, vencimento: '2026-06-23', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 8, categoria: 'Assinatura', nome: 'Gmail / Google', valor: 14.99, vencimento: '2026-06-23', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 9, categoria: 'Assinatura', nome: 'DramaWave', valor: 69.99, vencimento: '2026-06-14', status: 'EM ABERTO', obs: 'Cartão Nubank' },
  { id: 10, categoria: 'Empréstimo', nome: 'Cartão Malu', valor: 133.16, vencimento: '2026-06-10', status: 'EM ABERTO', obs: '6 parcelas • 3 pagas • 3 restantes' },
  { id: 11, categoria: 'Financiamento', nome: 'Moto', valor: 0, vencimento: '2026-06-25', status: 'EM ABERTO', obs: '36 parcelas • 10 pagas • 26 restantes' },
  { id: 12, categoria: 'Empréstimo', nome: 'Denilson', valor: 1040.00, vencimento: '2026-06-08', status: 'EM ABERTO', obs: 'Inclui juros de 30%' },
];

function moeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function dataBR(data: string) {
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

function alerta(conta: any) {
  if (conta.status === 'PAGO') return { texto: 'Pago', cor: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  const hoje = new Date('2026-06-01T00:00:00');
  const venc = new Date(conta.vencimento + 'T00:00:00');
  const dias = Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  if (dias < 0) return { texto: 'Vencida', cor: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
  if (dias <= 5) return { texto: 'Vence em breve', cor: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };
  return { texto: 'Em aberto', cor: 'text-blue-300', bg: 'bg-blue-500/10 border-blue-500/30' };
}

export default function AppFinanceiroPremiumAlpha() {
  const [contas, setContas] = useState(contasIniciais);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('TODAS');
  const [receitas, setReceitas] = useState({ salario: 0, valeAlimentacao: 0, extras: 0 });
  const [modalReceitasAberto, setModalReceitasAberto] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [novaConta, setNovaConta] = useState({
    nome: '',
    categoria: 'Assinatura',
    valor: '',
    vencimento: '',
    obs: '',
  });

  useEffect(() => {
    const contasSalvas = localStorage.getItem('alpha-finance-contas');
    const receitasSalvas = localStorage.getItem('alpha-finance-receitas');

    if (contasSalvas) {
      setContas(JSON.parse(contasSalvas));
    }

    if (receitasSalvas) {
      setReceitas(JSON.parse(receitasSalvas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('alpha-finance-contas', JSON.stringify(contas));
  }, [contas, receitas]);

  useEffect(() => {
    localStorage.setItem('alpha-finance-receitas', JSON.stringify(receitas));
  }, [receitas]);

  const contasFiltradas = contas.filter((conta) => {
    const combinaBusca = conta.nome.toLowerCase().includes(busca.toLowerCase()) || conta.categoria.toLowerCase().includes(busca.toLowerCase());
    const combinaFiltro = filtro === 'TODAS' || conta.status === filtro;
    return combinaBusca && combinaFiltro;
  });

  const resumo = useMemo(() => {
    const total = contas.reduce((soma, item) => soma + Number(item.valor || 0), 0);
    const aberto = contas.filter((item) => item.status === 'EM ABERTO').reduce((soma, item) => soma + Number(item.valor || 0), 0);
    const pago = contas.filter((item) => item.status === 'PAGO').reduce((soma, item) => soma + Number(item.valor || 0), 0);
    const qtdAberto = contas.filter((item) => item.status === 'EM ABERTO').length;
    const totalReceitas = Number(receitas.salario || 0) + Number(receitas.valeAlimentacao || 0) + Number(receitas.extras || 0);
    const saldoFinal = totalReceitas - aberto;
    return { total, aberto, pago, qtdAberto, totalReceitas, saldoFinal };
  }, [contas]);

  function alternarStatus(id: number) {
    setContas((atuais) => atuais.map((conta) => conta.id === id ? { ...conta, status: conta.status === 'PAGO' ? 'EM ABERTO' : 'PAGO' } : conta));
  }

  function salvarConta() {
    if (!novaConta.nome || !novaConta.valor || !novaConta.vencimento) return;

    if (editandoId) {
      setContas((atuais) =>
        atuais.map((conta) =>
          conta.id === editandoId
            ? {
              ...conta,
              categoria: novaConta.categoria,
              nome: novaConta.nome,
              valor: Number(novaConta.valor),
              vencimento: novaConta.vencimento,
              obs: novaConta.obs,
            }
            : conta
        )
      );
    } else {
      const contaCriada = {
        id: Date.now(),
        categoria: novaConta.categoria,
        nome: novaConta.nome,
        valor: Number(novaConta.valor),
        vencimento: novaConta.vencimento,
        status: 'EM ABERTO',
        obs: novaConta.obs,
      };

      setContas((atuais) => [...atuais, contaCriada]);
    }

    setNovaConta({ nome: '', categoria: 'Assinatura', valor: '', vencimento: '', obs: '' });
    setEditandoId(null);
    setModalAberto(false);
  }

  function editarConta(conta: any) { 
    setEditandoId(conta.id);
    setNovaConta({
      nome: conta.nome,
      categoria: conta.categoria,
      valor: String(conta.valor),
      vencimento: conta.vencimento,
      obs: conta.obs || '',
    });
    setModalAberto(true);
  }

  function apagarConta(id) {
    setContas((atuais) => atuais.filter((conta) => conta.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <div>
            <p className="text-purple-400 font-semibold tracking-widest">ALPHA FINANCE</p>
            <h1 className="text-4xl md:text-6xl font-black mt-2">Controle Financeiro Premium</h1>
            <p className="text-zinc-400 mt-3 max-w-2xl">App visual para controlar contas, empréstimos, cartões, vencimentos e pagamentos.</p>
          </div>
          <button
            onClick={() => {
              setEditandoId(null);
              setNovaConta({ nome: '', categoria: 'Assinatura', valor: '', vencimento: '', obs: '' });
              setModalAberto(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 justify-center"
          >
            <Plus size={20} /> Nova conta
          </button>
        </header>

        <section className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-5 bg-gradient-to-br from-purple-700 to-zinc-950 border border-purple-500/30 shadow-xl">
            <Wallet className="text-purple-200 mb-4" />
            <p className="text-zinc-300">Receitas do mês</p>
            <h2 className="text-3xl font-black mt-1">{moeda(resumo.totalReceitas)}</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-3xl p-5 bg-zinc-950 border border-yellow-500/30 shadow-xl">
            <AlertTriangle className="text-yellow-400 mb-4" />
            <p className="text-zinc-300">Contas em aberto</p>
            <h2 className="text-3xl font-black mt-1 text-yellow-400">{moeda(resumo.aberto)}</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`rounded-3xl p-5 bg-zinc-950 border shadow-xl ${resumo.saldoFinal >= 0 ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
            <CheckCircle2 className={resumo.saldoFinal >= 0 ? 'text-emerald-400 mb-4' : 'text-red-400 mb-4'} />
            <p className="text-zinc-300">Saldo previsto</p>
            <h2 className={`text-3xl font-black mt-1 ${resumo.saldoFinal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{moeda(resumo.saldoFinal)}</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-3xl p-5 bg-zinc-950 border border-red-500/30 shadow-xl">
            <CalendarDays className="text-red-400 mb-4" />
            <p className="text-zinc-300">Contas abertas</p>
            <h2 className="text-3xl font-black mt-1 text-red-400">{resumo.qtdAberto}</h2>
          </motion.div>
        </section>

        <section className="rounded-3xl bg-zinc-950 border border-zinc-800 p-5 md:p-6 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-black">Entradas do mês</h2>
              <p className="text-zinc-400 text-sm mt-1">Salário, vale alimentação e dinheiro extra fora do salário.</p>
            </div>
            <button onClick={() => setModalReceitasAberto(true)} className="bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-2xl font-bold">
              Editar entradas
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-black rounded-2xl p-4 border border-zinc-800">
              <p className="text-zinc-400">Salário</p>
              <p className="text-2xl font-black mt-1">{moeda(Number(receitas.salario || 0))}</p>
            </div>
            <div className="bg-black rounded-2xl p-4 border border-zinc-800">
              <p className="text-zinc-400">Vale alimentação</p>
              <p className="text-2xl font-black mt-1">{moeda(Number(receitas.valeAlimentacao || 0))}</p>
            </div>
            <div className="bg-black rounded-2xl p-4 border border-zinc-800">
              <p className="text-zinc-400">Extras</p>
              <p className="text-2xl font-black mt-1">{moeda(Number(receitas.extras || 0))}</p>
            </div>
            <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/30">
              <p className="text-zinc-300">Total recebido</p>
              <p className="text-2xl font-black mt-1 text-emerald-400">{moeda(resumo.totalReceitas)}</p>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 rounded-3xl bg-zinc-950 border border-zinc-800 p-5 md:p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <h2 className="text-2xl font-black flex items-center gap-2"><CreditCard className="text-purple-400" /> Minhas contas</h2>
              <div className="flex gap-3 flex-col sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
                  <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar conta..." className="bg-black border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 outline-none focus:border-purple-500 w-full" />
                </div>
                <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="bg-black border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-purple-500">
                  <option value="TODAS">Todas</option>
                  <option value="EM ABERTO">Em aberto</option>
                  <option value="PAGO">Pago</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {contasFiltradas.map((conta) => {
                const info = alerta(conta);
                return (
                  <div key={conta.id} className="rounded-3xl bg-black border border-zinc-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-500/50 transition-all">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">{conta.categoria}</span>
                        <span className={`text-xs px-3 py-1 rounded-full border ${info.bg} ${info.cor}`}>{info.texto}</span>
                      </div>
                      <h3 className="text-xl font-black mt-2">{conta.nome}</h3>
                      <p className="text-zinc-400 text-sm mt-1">Vence em {dataBR(conta.vencimento)} {conta.obs ? `• ${conta.obs}` : ''}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <p className="text-2xl font-black text-right">{conta.valor ? moeda(conta.valor) : 'Valor não informado'}</p>
                      <button onClick={() => alternarStatus(conta.id)} className={`rounded-2xl px-5 py-3 font-bold transition-all ${conta.status === 'PAGO' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}>
                        {conta.status === 'PAGO' ? 'Pago' : 'Em aberto'}
                      </button>
                      <button onClick={() => editarConta(conta)} className="rounded-2xl px-5 py-3 font-bold transition-all bg-purple-600 hover:bg-purple-700">
                        Editar
                      </button>
                      <button onClick={() => apagarConta(conta.id)} className="rounded-2xl px-5 py-3 font-bold transition-all bg-red-600 hover:bg-red-700">
                        Apagar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl">
              <h2 className="text-2xl font-black mb-5 flex items-center gap-2"><PieChart className="text-purple-400" /> Resumo visual</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-zinc-400 mb-2"><span>Pago</span><span>{moeda(resumo.pago)}</span></div>
                  <div className="h-4 bg-black rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${resumo.total ? (resumo.pago / resumo.total) * 100 : 0}%` }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-zinc-400 mb-2"><span>Em aberto</span><span>{moeda(resumo.aberto)}</span></div>
                  <div className="h-4 bg-black rounded-full overflow-hidden"><div className="h-full bg-yellow-500 rounded-full" style={{ width: `${resumo.total ? (resumo.aberto / resumo.total) * 100 : 0}%` }} /></div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-zinc-950 to-purple-950 border border-purple-500/20 p-6 shadow-2xl">
              <Smartphone className="text-purple-300 mb-4" />
              <h2 className="text-2xl font-black">Versão mobile</h2>
              <p className="text-zinc-400 mt-2">Layout pronto para abrir no celular, com botões grandes e visual de aplicativo.</p>
            </div>

            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl">
              <h2 className="text-2xl font-black flex items-center gap-2"><TrendingDown className="text-red-400" /> Próximo passo</h2>
              <p className="text-zinc-400 mt-3">Adicionar cadastro de novas contas, calendário financeiro e salvamento automático.</p>
            </div>
          </div>
        </section>
        {modalReceitasAberto && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-xl rounded-3xl bg-zinc-950 border border-emerald-500/40 p-6 shadow-2xl">
              <h2 className="text-3xl font-black mb-5">Editar entradas</h2>

              <div className="space-y-4">
                <input
                  type="number"
                  value={receitas.salario}
                  onChange={(e) => setReceitas({ ...receitas, salario: Number(e.target.value) })}
                  placeholder="Salário"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500"
                />

                <input
                  type="number"
                  value={receitas.valeAlimentacao}
                  onChange={(e) => setReceitas({ ...receitas, valeAlimentacao: Number(e.target.value) })}
                  placeholder="Vale alimentação"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500"
                />

                <input
                  type="number"
                  value={receitas.extras}
                  onChange={(e) => setReceitas({ ...receitas, extras: Number(e.target.value) })}
                  placeholder="Dinheiro extra"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setModalReceitasAberto(false)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-2xl py-4 font-bold">
                  Salvar entradas
                </button>
                <button onClick={() => setModalReceitasAberto(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 rounded-2xl py-4 font-bold">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {modalAberto && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-xl rounded-3xl bg-zinc-950 border border-purple-500/40 p-6 shadow-2xl">
              <h2 className="text-3xl font-black mb-5">{editandoId ? 'Editar conta' : 'Nova conta'}</h2>

              <div className="space-y-4">
                <input
                  value={novaConta.nome}
                  onChange={(e) => setNovaConta({ ...novaConta, nome: e.target.value })}
                  placeholder="Nome da conta"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-purple-500"
                />

                <select
                  value={novaConta.categoria}
                  onChange={(e) => setNovaConta({ ...novaConta, categoria: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-purple-500"
                >
                  <option>Assinatura</option>
                  <option>Empréstimo</option>
                  <option>Financiamento</option>
                  <option>Cartão</option>
                  <option>Conta fixa</option>
                </select>

                <input
                  type="number"
                  value={novaConta.valor}
                  onChange={(e) => setNovaConta({ ...novaConta, valor: e.target.value })}
                  placeholder="Valor"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-purple-500"
                />

                <input
                  type="date"
                  value={novaConta.vencimento}
                  onChange={(e) => setNovaConta({ ...novaConta, vencimento: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-purple-500"
                />

                <input
                  value={novaConta.obs}
                  onChange={(e) => setNovaConta({ ...novaConta, obs: e.target.value })}
                  placeholder="Observação"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={salvarConta} className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-2xl py-4 font-bold">
                  {editandoId ? 'Salvar edição' : 'Salvar conta'}
                </button>
                <button
                  onClick={() => {
                    setModalAberto(false);
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
    </div>
  );
}