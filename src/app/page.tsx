import Link from "next/link";

export const revalidate = 600;

type ApiLoteriaResponse = {
  loteria: string;
  concurso: number;
  data: string;
  dezenas: string[];
  acumulou?: boolean;
  valorEstimadoProximoConcurso?: number;
  valorPremio?: number;
};

function formatarBRL(valor?: number): string {
  const n = typeof valor === "number" && Number.isFinite(valor) ? valor : 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}

function tituloLoteria(key: string): string {
  switch (key) {
    case "megasena":
      return "Mega-Sena";
    case "lotofacil":
      return "Lotofácil";
    case "quina":
      return "Quina";
    default:
      return key;
  }
}

async function fetchLatest(key: string): Promise<ApiLoteriaResponse | null> {
  const url = `https://loteriascaixa-api.herokuapp.com/api/${key}/latest`;
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as ApiLoteriaResponse;
  } catch {
    return null;
  }
}

function Dezenas({ dezenas }: { dezenas: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {dezenas.map((d) => (
        <span
          key={d}
          className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-zinc-900 px-3 text-sm font-bold text-white"
        >
          {d}
        </span>
      ))}
    </div>
  );
}

function StatusBadge({ acumulou }: { acumulou?: boolean }) {
  const cls = acumulou ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800";
  const label = acumulou ? "Acumulou" : "Não acumulou";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function Card({ data, loteriaKey }: { data: ApiLoteriaResponse; loteriaKey: string }) {
  const dezenas = Array.isArray(data.dezenas) ? data.dezenas : [];

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">{tituloLoteria(loteriaKey)}</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Concurso <span className="font-semibold text-zinc-900">{data.concurso}</span> · {data.data}
          </p>
        </div>
        <StatusBadge acumulou={data.acumulou} />
      </div>

      <Dezenas dezenas={dezenas} />

      <div className="mt-5 grid gap-2 text-sm text-zinc-700">
        <p>
          <span className="font-medium text-zinc-900">Prêmio (quando disponível):</span> {formatarBRL(data.valorPremio)}
        </p>
        <p>
          <span className="font-medium text-zinc-900">Estimativa próximo concurso:</span>{" "}
          {formatarBRL(data.valorEstimadoProximoConcurso)}
        </p>
      </div>
    </section>
  );
}

export default async function Home() {
  const [mega, facil, quina] = await Promise.all([
    fetchLatest("megasena"),
    fetchLatest("lotofacil"),
    fetchLatest("quina"),
  ]);

  const any = mega || facil || quina;

  if (!any) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-sky-100">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <header className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Resultado da Loteria Hoje
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-zinc-700">
              Resultados temporariamente indisponíveis. Tente novamente em alguns minutos.
            </p>
          </header>

          <section className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">O que fazer agora?</h2>
            <p className="mt-3 text-zinc-700">
              Caso a fonte esteja instável, aguarde alguns minutos e atualize a página.
            </p>
            <p className="mt-3 text-xs text-zinc-500">
              Contato: <span className="font-semibold">suportcalculo@gmail.com</span>
            </p>
          </section>

          <section className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900">FAQ</h2>
            <div className="mt-6 grid gap-5">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">De onde vêm os resultados?</h3>
                <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                  Os dados são obtidos de fontes públicas e podem sofrer atrasos ou indisponibilidades.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">Este site é oficial?</h3>
                <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                  Não. Este site é apenas informativo. Sempre confirme em canais oficiais.
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-zinc-700">
              Links úteis:
              <span className="ml-2">
                <Link className="text-sky-700 hover:underline" href="/privacidade">
                  Privacidade
                </Link>
                <span className="px-2 text-zinc-400">·</span>
                <Link className="text-sky-700 hover:underline" href="/termos">
                  Termos
                </Link>
                <span className="px-2 text-zinc-400">·</span>
                <Link className="text-sky-700 hover:underline" href="/contato">
                  Contato
                </Link>
              </span>
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-sky-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Resultado da Loteria Hoje
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-zinc-700">
            Confira os resultados mais recentes de <span className="font-semibold">Mega-Sena</span>,{" "}
            <span className="font-semibold">Quina</span> e <span className="font-semibold">Lotofácil</span>.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {mega ? <Card data={mega} loteriaKey="megasena" /> : null}
          {quina ? <Card data={quina} loteriaKey="quina" /> : null}
          {facil ? <Card data={facil} loteriaKey="lotofacil" /> : null}
        </div>

        <section className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-900">Perguntas frequentes</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">O que significa “acumulou”?</h3>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                Significa que não houve ganhador na faixa principal e o prêmio acumulou para o próximo concurso.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Os valores de prêmio são exatos?</h3>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                São informativos e podem mudar conforme apuração. Para confirmação, consulte fontes oficiais.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Qual a diferença entre Mega-Sena, Quina e Lotofácil?</h3>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                Cada modalidade tem quantidade de dezenas, regras e faixas de premiação diferentes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Este site é oficial?</h3>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                Não. É um site informativo. Sempre valide informações em canais oficiais.
              </p>
            </div>
          </div>
        </section>

        <p className="mx-auto mt-8 max-w-4xl text-center text-xs text-zinc-500">
          Este site não possui vínculo com a Caixa. Resultados obtidos de fontes públicas.
        </p>
      </div>
    </div>
  );
}
