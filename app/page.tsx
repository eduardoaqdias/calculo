"use client";

import React, { useEffect, useMemo, useState } from "react";

type DbRowRaw = Record<string, any>;

type DbRow = {
  base: string;
  cidade: string;
  estado: string;
  rota: string;
  imposto: string;
  unit_cost: number | null;
  cmk: number | null;
  best_days: string;
  best_window: string;
};

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function cleanText(v: any) {
  if (v === null || v === undefined) return "";
  const s = String(v).trim();
  return s.toLowerCase() === "nan" ? "" : s;
}

function cleanNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeKey(v: any) {
  return String(v || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRow(r: DbRowRaw): DbRow {
  const base = cleanText(r["Base\nAjustada"] || r["Base Ajustada"] || r.Base);
  const cidade = cleanText(r.Cidade);
  const estado = cleanText(r.Estado);
  const rota = cleanText(r["Tipo de Rota"] || r.TipoDeRota || r.Rota);
  const imposto = cleanText(r.Imposto);
  const unit = cleanNumber(r.unit_cost);
  const cmk = cleanNumber(r.cmk);
  const bestDays = cleanText(r.best_days);
  const bestWindow = cleanText(r.best_window);

  return {
    base,
    cidade,
    estado,
    rota,
    imposto,
    unit_cost: unit,
    cmk,
    best_days: bestDays,
    best_window: bestWindow,
  };
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
}

// (Opcional) Defaults de impostos por base.
// Se você quiser preencher automaticamente ISS/ICMS por base,
// adicione entradas aqui com a chave normalizada (sem acentos, minúscula).
const TAXA_BASE: Record<string, { iss?: number; icms?: number }> = {
  // "base oeste": { iss: 5.0, icms: 12.0 },
  // "campinas": { iss: 5.0, icms: 12.0 },
};

type ToastKind = "ok" | "warn" | "bad";

export default function Page() {
  const [db, setDb] = useState<DbRow[]>([]);
  const [loading, setLoading] = useState(true);

  // form
  const [cliente, setCliente] = useState("");
  const [emailDestino, setEmailDestino] = useState("");
  const [volume, setVolume] = useState<number>(25);
  const [cidade, setCidade] = useState("");
  const [base, setBase] = useState("");
  const [uf, setUf] = useState("");
  const [rota, setRota] = useState("");
  const [impostoTipo, setImpostoTipo] = useState("");

  const [taxaIss, setTaxaIss] = useState<number>(0);
  const [taxaPisCofins, setTaxaPisCofins] = useState<number>(0);
  const [taxaIcms, setTaxaIcms] = useState<number>(0);
  const [taxaOutros, setTaxaOutros] = useState<number>(0);
  const [impostoFixo, setImpostoFixo] = useState<number>(0);
  const [zerarImpostos, setZerarImpostos] = useState(false);
  const [margemPct, setMargemPct] = useState<number>(0); // em % (ex: 15)

  const [toast, setToast] = useState<{ show: boolean; msg: string; kind: ToastKind }>({
    show: false,
    msg: "",
    kind: "ok",
  });

  function showToast(msg: string, kind: ToastKind = "ok") {
    setToast({ show: true, msg, kind });
    window.clearTimeout((window as any).__t);
    (window as any).__t = window.setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800);
  }

  // Load db.json (public)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/db.json", { cache: "no-store" });
        const text = await res.text();

        // Mantém compatibilidade com "NaN" e "nan" vindos do export original.
        const clean = text.replace(/\bNaN\b/g, "null").replace(/\"nan\"/gi, "null");
        const raw = JSON.parse(clean) as DbRowRaw[];
        const normalized = raw
          .map(normalizeRow)
          .filter((r) => r.base && r.cidade && r.estado && r.rota && r.imposto && r.unit_cost !== null);

        setDb(normalized);
      } catch (e) {
        console.error(e);
        showToast("Falha ao carregar db.json. Verifique se o JSON está válido.", "warn");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Options (cascade)
  const cidadeOptions = useMemo(() => uniq(db.map((r) => r.cidade)), [db]);

  const filteredByCidade = useMemo(() => {
    const c = cidade.trim();
    if (!c) return db;
    const cNorm = normalizeKey(c);
    return db.filter((r) => normalizeKey(r.cidade).includes(cNorm));
  }, [db, cidade]);

  const baseOptions = useMemo(() => uniq(filteredByCidade.map((r) => r.base)), [filteredByCidade]);

  const filteredByBase = useMemo(() => {
    if (!base) return filteredByCidade;
    return filteredByCidade.filter((r) => r.base === base);
  }, [filteredByCidade, base]);

  const ufOptions = useMemo(() => uniq(filteredByBase.map((r) => r.estado)), [filteredByBase]);

  const filteredByUf = useMemo(() => {
    if (!uf) return filteredByBase;
    return filteredByBase.filter((r) => r.estado === uf);
  }, [filteredByBase, uf]);

  const rotaOptions = useMemo(() => uniq(filteredByUf.map((r) => r.rota)), [filteredByUf]);

  const filteredByRota = useMemo(() => {
    if (!rota) return filteredByUf;
    return filteredByUf.filter((r) => r.rota === rota);
  }, [filteredByUf, rota]);

  const impostoOptions = useMemo(() => uniq(filteredByRota.map((r) => r.imposto)), [filteredByRota]);

  // Auto-fix values if they become invalid after cascade changes
  useEffect(() => {
    if (base && !baseOptions.includes(base)) setBase("");
    if (uf && !ufOptions.includes(uf)) setUf("");
    if (rota && !rotaOptions.includes(rota)) setRota("");
    if (impostoTipo && !impostoOptions.includes(impostoTipo)) setImpostoTipo("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseOptions, ufOptions, rotaOptions, impostoOptions]);

  // Apply tax defaults when base changes (optional)
  useEffect(() => {
    const k = normalizeKey(base);
    const d = TAXA_BASE[k];
    if (!d) return;
    if (!zerarImpostos) {
      if (typeof d.iss === "number") setTaxaIss(d.iss);
      if (typeof d.icms === "number") setTaxaIcms(d.icms);
    }
  }, [base, zerarImpostos]);

  // Find match for calculation
  const match = useMemo(() => {
    if (!cidade || !base || !uf || !rota || !impostoTipo) return null;
    return db.find(
      (r) =>
        r.cidade === cidade &&
        r.base === base &&
        r.estado === uf &&
        r.rota === rota &&
        r.imposto === impostoTipo
    );
  }, [db, cidade, base, uf, rota, impostoTipo]);

  const calc = useMemo(() => {
    if (!match || match.unit_cost === null) return null;

    const vol = Number.isFinite(volume) ? Math.max(0, volume) : 0;
    const unit = match.unit_cost;

    const baseCost = unit * vol;

    const iss = zerarImpostos ? 0 : (Number.isFinite(taxaIss) ? taxaIss : 0);
    const pisCofins = zerarImpostos ? 0 : (Number.isFinite(taxaPisCofins) ? taxaPisCofins : 0);
    const icms = zerarImpostos ? 0 : (Number.isFinite(taxaIcms) ? taxaIcms : 0);
    const outros = zerarImpostos ? 0 : (Number.isFinite(taxaOutros) ? taxaOutros : 0);
    const fixo = zerarImpostos ? 0 : (Number.isFinite(impostoFixo) ? impostoFixo : 0);

    const pctTotal = (iss + pisCofins + icms + outros) / 100;
    const impostos = baseCost * pctTotal + fixo;

    const margem = (Number.isFinite(margemPct) ? margemPct : 0) / 100;
    const total = (baseCost + impostos) * (1 + margem);

    const texto = `
ORÇAMENTO • CPE (Protege)
${cliente ? `Cliente/Dependência: ${cliente}\n` : ""}
Base: ${base}
Cidade/UF: ${cidade} / ${uf}
Rota: ${rota}
Imposto: ${impostoTipo}

Parâmetros:
- Volume: ${vol || 0}
- CPE (unitário): ${brl.format(unit)}
- ISS: ${iss.toFixed(2).replace(".", ",")}%
- PIS/COFINS: ${pisCofins.toFixed(2).replace(".", ",")}%
- ICMS: ${icms.toFixed(2).replace(".", ",")}%
- Outros: ${outros.toFixed(2).replace(".", ",")}%
- Fixo: ${brl.format(fixo || 0)}
- Margem: ${(margem * 100).toFixed(1).replace(".", ",")}%

Recomendação operacional:
- Melhores dias: ${match.best_days || "-"}
- Melhor janela: ${match.best_window || "-"}

Cálculo:
- Custo base: ${brl.format(baseCost)}
- Impostos: ${brl.format(impostos)}
- Total a cobrar (com margem): ${brl.format(total)}

Observações:
- Valores estimados; podem variar conforme escopo/validação final.
- Prazo e condições de pagamento a combinar.
`.trim();

    return { baseCost, impostos, total, texto };
  }, [
    match,
    volume,
    cliente,
    base,
    cidade,
    uf,
    rota,
    impostoTipo,
    taxaIss,
    taxaPisCofins,
    taxaIcms,
    taxaOutros,
    impostoFixo,
    margemPct,
    zerarImpostos,
  ]);

  async function onCopy() {
    if (!calc?.texto) {
      showToast("Nada para copiar. Complete as seleções.", "warn");
      return;
    }
    try {
      await navigator.clipboard.writeText(calc.texto);
      showToast("Orçamento copiado para a área de transferência.", "ok");
    } catch {
      showToast("Falha ao copiar automaticamente. Selecione e copie manualmente.", "warn");
    }
  }

  function onSendEmail() {
    if (!calc?.texto) {
      showToast("Nada para enviar. Complete as seleções.", "warn");
      return;
    }

    const to = emailDestino.trim();
    const subjectBase = cliente?.trim() ? `Orçamento CPE - ${cliente.trim()}` : "Orçamento CPE";
    const subject = encodeURIComponent(subjectBase);
    const body = encodeURIComponent(calc.texto);
    const href = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;

    window.location.href = href;
    showToast("Abrindo e-mail no aplicativo padrão.", "ok");
  }

  function onReset() {
    setCliente("");
    setEmailDestino("");
    setVolume(0);
    setCidade("");
    setBase("");
    setUf("");
    setRota("");
    setImpostoTipo("");

    setTaxaIss(0);
    setTaxaPisCofins(0);
    setTaxaIcms(0);
    setTaxaOutros(0);
    setImpostoFixo(0);
    setZerarImpostos(false);
    setMargemPct(0);

    showToast("Reset realizado.", "warn");
  }

  function onExample() {
    const r = db[0];
    if (!r) return;

    setCliente("Exemplo • Dependência");
    setVolume(25);

    setBase(r.base);
    setCidade(r.cidade);
    setUf(r.estado);
    setRota(r.rota);
    setImpostoTipo(r.imposto);

    setTaxaIss(2.0);
    setTaxaPisCofins(1.65);
    setTaxaIcms(0);
    setTaxaOutros(2.35);
    setImpostoFixo(0);
    setZerarImpostos(false);
    setMargemPct(15);

    showToast("Exemplo carregado.", "ok");
  }

  const statusText = loading ? "Carregando..." : db.length ? "Pronto" : "Banco inválido/vazio";
  const matchText = match ? "Match: OK" : "Match: -";

  return (
    <>
      <div className="wrap">
        <div className="top">
          <div className="brand">
            <div className="mark" aria-hidden="true">
              <img
                className="logoImg"
                src="https://www.protege.com.br/media/ovmn4be5/main-logo.svg"
                alt="Protege"
              />
            </div>
            <div>
              <h1>Simulador de Cobrança (CPE)</h1>
              <div className="subtitle">
                Selecione <b>Base</b>, <b>Cidade</b>, <b>UF</b>, <b>Tipo de Rota</b> e <b>Imposto</b>. O sistema busca o CPE do banco e calcula o total.
              </div>
            </div>
          </div>

          <div className="chips" aria-hidden="true">
            <div className="chip">
              <span className="dot"></span> Interface Protege
            </div>
            <div className="chip">
              <span
                className="dot"
                style={{
                  background: "var(--protege-blue-2)",
                  boxShadow: "0 0 0 3px rgba(10,59,138,0.14)",
                }}
              ></span>{" "}
              Copy do orçamento
            </div>
          </div>
        </div>

        <div className="grid">
          <section className="card">
            <div className="cardHeader">
              <div>
                <div className="cardTitle">Entrada</div>
                <div className="cardDesc">
                  Defina parâmetros e impostos. O valor final é <b>custo base + tributos</b> com margem opcional.
                </div>
              </div>
              <span className="badge">{statusText}</span>
            </div>

            <div className="cardBody">
              <div className="form">
                <div className="field">
                  <label>Cliente / Dependência</label>
                  <input
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Ex.: Loja 0132 • SUP BH"
                    autoComplete="off"
                  />
                  <div className="hint">Opcional — aparece no texto final.</div>
                </div>

                <div className="field">
                  <label>E-mail destino</label>
                  <input
                    type="email"
                    value={emailDestino}
                    onChange={(e) => setEmailDestino(e.target.value)}
                    placeholder="destinatario@empresa.com.br"
                    autoComplete="off"
                  />
                  <div className="hint">Opcional. Se vazio, abre novo e-mail sem destinatário.</div>
                </div>

                <div className="field">
                  <label>Volume</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                  />
                  <div className="hint">Quantidade de volumes/atendimentos conforme sua regra.</div>
                </div>

                <div className="field">
                  <label>Cidade</label>
                  <input
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    list="cidadeList"
                    placeholder="Digite para buscar..."
                    autoComplete="off"
                  />
                  <datalist id="cidadeList">
                    {cidadeOptions.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  <div className="hint">Comece a digitar para filtrar a lista.</div>
                </div>

                <div className="field">
                  <label>Base (Ajustada)</label>
                  <select value={base} onChange={(e) => setBase(e.target.value)}>
                    <option value="">Selecione a base...</option>
                    {baseOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <div className="hint">Filtrada pela cidade digitada.</div>
                </div>

                <div className="field">
                  <label>UF</label>
                  <select value={uf} onChange={(e) => setUf(e.target.value)}>
                    <option value="">Selecione...</option>
                    {ufOptions.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <div className="hint">Filtra pela Cidade/Base.</div>
                </div>

                <div className="field">
                  <label>Tipo de Rota</label>
                  <select value={rota} onChange={(e) => setRota(e.target.value)}>
                    <option value="">Selecione...</option>
                    {rotaOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <div className="hint">Conforme banco CPE.</div>
                </div>

                <div className="field span2">
                  <label>Imposto</label>
                  <select value={impostoTipo} onChange={(e) => setImpostoTipo(e.target.value)}>
                    <option value="">Selecione...</option>
                    {impostoOptions.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  <div className="hint">{matchText}</div>
                </div>

                <div className="divider span2"></div>

                <div className="field">
                  <label>ISS (%)</label>
                  <input
                    disabled={zerarImpostos}
                    type="number"
                    step="0.01"
                    value={taxaIss}
                    onChange={(e) => setTaxaIss(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>PIS/COFINS (%)</label>
                  <input
                    disabled={zerarImpostos}
                    type="number"
                    step="0.01"
                    value={taxaPisCofins}
                    onChange={(e) => setTaxaPisCofins(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>ICMS (%)</label>
                  <input
                    disabled={zerarImpostos}
                    type="number"
                    step="0.01"
                    value={taxaIcms}
                    onChange={(e) => setTaxaIcms(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>Outros (%)</label>
                  <input
                    disabled={zerarImpostos}
                    type="number"
                    step="0.01"
                    value={taxaOutros}
                    onChange={(e) => setTaxaOutros(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>Imposto fixo (R$)</label>
                  <input
                    disabled={zerarImpostos}
                    type="number"
                    step="0.01"
                    value={impostoFixo}
                    onChange={(e) => setImpostoFixo(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>Margem (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={margemPct}
                    onChange={(e) => setMargemPct(Number(e.target.value))}
                  />
                </div>

                <div className="field span2">
                  <label className="toggleRow">
                    <input
                      type="checkbox"
                      checked={zerarImpostos}
                      onChange={(e) => setZerarImpostos(e.target.checked)}
                    />
                    Zerar impostos (simulação sem tributos)
                  </label>
                  <div className="hint">
                    Quando ativado, ISS/PIS/COFINS/ICMS/Outros/Fixo ficam 0 automaticamente.
                  </div>
                </div>

                <div className="actions span2 actionsInline">
                  <button className="primary" onClick={onCopy}>
                    Copiar orçamento
                  </button>
                  <button onClick={onSendEmail}>Enviar por e-mail</button>
                  <button onClick={onExample}>Carregar exemplo</button>
                  <button className="danger" onClick={onReset}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="card">
            <div className="cardHeader">
              <div>
                <div className="cardTitle">Resultado</div>
                <div className="cardDesc">Resumo do cálculo e texto final.</div>
              </div>
              <span className="badge">{match ? "Calculado" : "Aguardando seleção"}</span>
            </div>

            <div className="cardBody">
              <div className="kpis">
                <div className="kpi">
                  <div className="k">Custo base</div>
                  <div className="v">{calc ? brl.format(calc.baseCost) : "-"}</div>
                </div>
                <div className="kpi">
                  <div className="k">Impostos</div>
                  <div className="v">{calc ? brl.format(calc.impostos) : "-"}</div>
                </div>
                <div className="kpi kpiTotal">
                  <div className="k">Total a cobrar (com margem)</div>
                  <div className="v">{calc ? brl.format(calc.total) : "-"}</div>
                  <small>
                    Recomendações: {match?.best_days || "-"} • {match?.best_window || "-"}
                  </small>
                </div>
              </div>

              <div className="divider"></div>

              <div className="field">
                <label>Texto final</label>
                <textarea value={calc?.texto || ""} readOnly rows={14} />
                <div className="hint">Copie e cole no e-mail / proposta.</div>
              </div>

              <div className="footer">
                Azure Static Web Apps: configure <code>Output location</code> como <code>out</code>.
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className={`toast ${toast.show ? "show" : ""}`}>
        <div
          className="t"
          style={{
            background:
              toast.kind === "ok"
                ? "var(--good)"
                : toast.kind === "warn"
                ? "var(--warn)"
                : "var(--bad)",
            boxShadow:
              toast.kind === "ok"
                ? "0 0 0 3px rgba(34,197,94,0.12)"
                : toast.kind === "warn"
                ? "0 0 0 3px rgba(245,158,11,0.12)"
                : "0 0 0 3px rgba(239,68,68,0.12)",
          }}
        />
        <div className="msg">{toast.msg}</div>
      </div>
    </>
  );
}
