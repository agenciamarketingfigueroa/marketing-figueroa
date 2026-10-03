// Illustrative data only. Values, totals, costs and chart are updated together.
const reportWeeks = {
  current: {
    spend: 900,
    leads: 75,
    reach: 18400,
    impressions: 24000,
    clicks: 600,
    daily: [7, 9, 8, 13, 11, 12, 15],
    campaigns: [[540, 45], [360, 30]],
    weekLabel: "21 — 27 SET 2026",
    leadsNote: "+50% em relação à semana anterior",
    cplNote: "25% menor que na semana anterior",
    analysis:
      "Na simulação desta semana, as campanhas geraram 75 contatos com custo médio de R$ 12. O volume cresceu 50% e o custo por contato caiu 25% frente à semana anterior. Agora, vale cruzar esses números com a qualidade das conversas no atendimento.",
    next:
      "Comparar novas aberturas dos vídeos, manter os públicos com melhor resposta e registrar quais contatos avançaram para um orçamento. Assim, as próximas decisões consideram oportunidade real, além do clique.",
  },
  previous: {
    spend: 800,
    leads: 50,
    reach: 16000,
    impressions: 20000,
    clicks: 400,
    daily: [5, 6, 8, 6, 9, 8, 8],
    campaigns: [[480, 30], [320, 20]],
    weekLabel: "14 — 20 SET 2026",
    leadsNote: "Primeira semana desta demonstração",
    cplNote: "Base para comparação entre períodos",
    analysis:
      "O primeiro período da simulação reuniu 50 contatos com R$ 800 de investimento, a um custo médio de R$ 16. Esta semana estabelece a base de comparação. Ainda é necessário entender quais conversas se tornaram oportunidades no atendimento.",
    next:
      "Testar novas mensagens e aberturas de vídeo, acompanhar a resposta por público e revisar a qualidade dos contatos com a equipe de atendimento.",
  },
};
const brl = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const number = (value) => value.toLocaleString("pt-BR");
const periodSelect = document.querySelector("#report-period");
periodSelect.addEventListener("change", () => {
  const week = reportWeeks[periodSelect.value];
  const values = {
    ...week,
    spend: brl(week.spend),
    reach: number(week.reach),
    impressions: number(week.impressions),
    clicks: number(week.clicks),
    cpl: brl(week.spend / week.leads),
    cpc: brl(week.spend / week.clicks),
    ctr: (week.clicks / week.impressions * 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    }) + "%",
    funnelLeads: week.leads,
    leadsTotal: `${week.leads} contatos`,
    campaignOneSpend: brl(week.campaigns[0][0]),
    campaignOneLeads: week.campaigns[0][1],
    campaignOneCpl: brl(week.campaigns[0][0] / week.campaigns[0][1]),
    campaignTwoSpend: brl(week.campaigns[1][0]),
    campaignTwoLeads: week.campaigns[1][1],
    campaignTwoCpl: brl(week.campaigns[1][0] / week.campaigns[1][1]),
  };
  document.querySelectorAll("[data-metric]").forEach((element) => {
    element.textContent = values[element.dataset.metric];
  });
  document.querySelectorAll(".bar").forEach((bar, index) => {
    bar.style.setProperty("--height", `${week.daily[index] * 5}%`);
    bar.querySelector("span").textContent = week.daily[index];
  });
  const days = [
    "segunda",
    "terça",
    "quarta",
    "quinta",
    "sexta",
    "sábado",
    "domingo",
  ];
  document.querySelector(".bar-chart").setAttribute(
    "aria-label",
    "Contatos por dia: " + week.daily.map((value, index) =>
      `${days[index]} ${value}`
    ).join(", ") + ".",
  );
});
