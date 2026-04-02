(function () {
  const pageConfig = window.INTERNAL_PORTAL_PAGE || {};

  const STATUS_META = {
    active: { label: "Ativo", className: "status-live" },
    not_delivering: { label: "Não entregando", className: "status-idle" },
    archived: { label: "Arquivado", className: "status-idle" }
  };

  const metricOptions = [
    { value: "profileVisits", label: "Visitas ao perfil" },
    { value: "followers", label: "Seguidores" },
    { value: "reach", label: "Alcance" },
    { value: "clicks", label: "Cliques no link" },
    { value: "costPerClick", label: "Custo por clique" },
    { value: "ctr", label: "CTR" },
    { value: "shares", label: "Compartilhamentos" },
    { value: "costPerResult", label: "Custo por visita" }
  ];

  const numberFormatter = new Intl.NumberFormat("pt-BR");
  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
  const percentFormatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function parseDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function formatDate(dateString) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(parseDate(dateString));
  }

  function formatMetricValue(metric, value) {
    if (metric === "costPerResult" || metric === "costPerClick" || metric === "spend") {
      return currencyFormatter.format(value || 0);
    }

    if (metric === "ctr" || metric === "frequency") {
      return metric === "frequency"
        ? `${percentFormatter.format(value || 0).replace("%", "")}x`
        : `${percentFormatter.format(value || 0)}%`;
    }

    return numberFormatter.format(Math.round(value || 0));
  }

  function formatShortPercent(value) {
    return `${Math.round(value || 0)}%`;
  }

  function getMetricLabel(metric) {
    const option = metricOptions.find((item) => item.value === metric);
    return option ? option.label : metric;
  }

  function calculateCostPerClick(entry) {
    if (!entry || !entry.clicks) {
      return 0;
    }

    return entry.spend / entry.clicks;
  }

  function isInverseMetric(metric) {
    return metric === "costPerResult" || metric === "costPerClick";
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[\[\]]/g, "")
      .trim();
  }

  function scoreMetricValue(entry, metric) {
    const currentValue = entry[metric] || 0;

    if (!currentValue) {
      return 0;
    }

    return isInverseMetric(metric) ? 1 / currentValue : currentValue;
  }

  function computeAuthoritySignals(summary) {
    return (summary.comments || 0) + (summary.shares || 0) + (summary.saves || 0);
  }

  function aggregateSummary(audiences) {
    const summary = audiences.reduce((accumulator, audience) => {
      accumulator.spend += audience.spend || 0;
      accumulator.reach += audience.reach || 0;
      accumulator.impressions += audience.impressions || 0;
      accumulator.clicks += audience.clicks || 0;
      accumulator.profileVisits += audience.profileVisits || 0;
      accumulator.followers += audience.followers || 0;
      accumulator.comments += audience.comments || 0;
      accumulator.shares += audience.shares || 0;
      accumulator.saves += audience.saves || 0;
      return accumulator;
    }, {
      spend: 0,
      reach: 0,
      impressions: 0,
      clicks: 0,
      profileVisits: 0,
      followers: 0,
      comments: 0,
      shares: 0,
      saves: 0
    });

    summary.ctr = summary.impressions ? (summary.clicks / summary.impressions) * 100 : 0;
    summary.frequency = summary.reach ? summary.impressions / summary.reach : 0;
    summary.costPerResult = summary.profileVisits ? summary.spend / summary.profileVisits : 0;
    summary.costPerClick = summary.clicks ? summary.spend / summary.clicks : 0;

    return summary;
  }

  function enrichReport(report) {
    const audiences = (report.audiences || []).map((audience) => ({
      ...audience,
      costPerClick: calculateCostPerClick(audience)
    }));

    const sourceSummary = report.summary ? { ...report.summary } : aggregateSummary(audiences);
    const summary = {
      ...sourceSummary,
      ctr: sourceSummary.ctr || (sourceSummary.impressions ? (sourceSummary.clicks / sourceSummary.impressions) * 100 : 0),
      frequency: sourceSummary.frequency || (sourceSummary.reach ? sourceSummary.impressions / sourceSummary.reach : 0),
      costPerResult: sourceSummary.costPerResult || (sourceSummary.profileVisits ? sourceSummary.spend / sourceSummary.profileVisits : 0),
      costPerClick: calculateCostPerClick(sourceSummary)
    };

    return {
      ...report,
      summary,
      audiences
    };
  }

  function getTopAudience(audiences, metric) {
    if (!audiences.length) {
      return null;
    }

    return [...audiences].sort((left, right) => scoreMetricValue(right, metric) - scoreMetricValue(left, metric))[0];
  }

  function computeDashboardScore(summary) {
    const authoritySignals = computeAuthoritySignals(summary);
    const targets = [
      summary.reach / 100000,
      summary.profileVisits / 8000,
      summary.followers / 250,
      authoritySignals / 220
    ];
    const averageProgress = targets.reduce((sum, value) => sum + Math.min(value, 1), 0) / targets.length;
    return Math.round(averageProgress * 100);
  }

  function initGate(config) {
    const root = document.querySelector("[data-access-gate]");
    const content = document.querySelector("[data-gated-content]");

    if (!root || !content || !config || !config.password) {
      return;
    }

    const passwordInput = root.querySelector("[data-gate-password]");
    const submitButton = root.querySelector("[data-gate-submit]");
    const clearButton = root.querySelector("[data-gate-clear]");
    const feedback = root.querySelector("[data-gate-feedback]");

    if (!passwordInput || !submitButton || !clearButton || !feedback) {
      return;
    }

    function unlock() {
      sessionStorage.setItem(config.storageKey, "open");
      root.hidden = true;
      content.hidden = false;
      feedback.textContent = "";
    }

    submitButton.textContent = config.submitLabel || submitButton.textContent;

    if (sessionStorage.getItem(config.storageKey) === "open") {
      unlock();
      return;
    }

    clearButton.addEventListener("click", () => {
      passwordInput.value = "";
      feedback.textContent = "";
      passwordInput.focus();
    });

    function handleSubmit() {
      if (passwordInput.value === config.password) {
        feedback.textContent = config.successMessage || "Acesso liberado.";
        unlock();
        return;
      }

      feedback.textContent = config.errorMessage || "Senha incorreta. Tente novamente.";
      passwordInput.select();
    }

    submitButton.addEventListener("click", handleSubmit);
    passwordInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    });
  }

  function renderHeroKpis(root, summary) {
    if (!root) {
      return;
    }

    const cards = [
      { label: "Alcance", value: formatMetricValue("reach", summary.reach) },
      { label: "Cliques no link", value: formatMetricValue("clicks", summary.clicks) },
      { label: "Visitas ao perfil", value: formatMetricValue("profileVisits", summary.profileVisits) },
      { label: "Seguidores", value: formatMetricValue("followers", summary.followers) }
    ];

    root.innerHTML = "";

    cards.forEach((cardData) => {
      const card = document.createElement("div");
      card.className = "metric-chip";

      const value = document.createElement("strong");
      value.textContent = cardData.value;
      card.appendChild(value);

      const label = document.createElement("span");
      label.textContent = cardData.label;
      card.appendChild(label);

      root.appendChild(card);
    });
  }

  function renderPulse(scoreRoot, gridRoot, summary, audiences, selectedMetric) {
    if (scoreRoot) {
      const dashboardScore = computeDashboardScore(summary);
      const angle = Math.round((dashboardScore / 100) * 360);
      const champion = getTopAudience(audiences, selectedMetric);

      scoreRoot.innerHTML = "";

      const ring = document.createElement("div");
      ring.className = "pulse-ring";
      ring.style.background = `conic-gradient(var(--portal-accent) 0deg ${angle}deg, rgba(255, 255, 255, 0.08) ${angle}deg 360deg)`;

      const ringCore = document.createElement("div");
      ringCore.className = "pulse-ring-core";

      const scoreValue = document.createElement("strong");
      scoreValue.textContent = dashboardScore;
      ringCore.appendChild(scoreValue);

      const scoreLabel = document.createElement("span");
      scoreLabel.textContent = "score visual";
      ringCore.appendChild(scoreLabel);
      ring.appendChild(ringCore);
      scoreRoot.appendChild(ring);

      const copy = document.createElement("div");
      copy.className = "pulse-copy";

      const title = document.createElement("strong");
      title.textContent = champion
        ? `${champion.name} lidera em ${getMetricLabel(selectedMetric).toLowerCase()}.`
        : "Painel consolidado do período.";
      copy.appendChild(title);

      const paragraph = document.createElement("p");
      paragraph.textContent = "O score considera alcance, visitas, seguidores e sinais de autoridade.";
      copy.appendChild(paragraph);

      const small = document.createElement("small");
      small.textContent = "Quanto mais perto de 100, mais consistente o mês ficou nos principais objetivos.";
      copy.appendChild(small);

      scoreRoot.appendChild(copy);
    }

    if (!gridRoot) {
      return;
    }

    const topAudience = getTopAudience(audiences, selectedMetric);
    const cards = [
      {
        label: "Melhor público",
        value: topAudience ? topAudience.name : "Sem dados",
        detail: topAudience ? `${formatMetricValue(selectedMetric, topAudience[selectedMetric])} em ${getMetricLabel(selectedMetric).toLowerCase()}` : "Aguardando filtros"
      },
      {
        label: "CTR médio",
        value: formatMetricValue("ctr", summary.ctr),
        detail: "taxa ponderada do período"
      },
      {
        label: "CPC médio",
        value: formatMetricValue("costPerClick", summary.costPerClick),
        detail: "custo por clique"
      },
      {
        label: "Investimento",
        value: formatMetricValue("spend", summary.spend),
        detail: "verba aplicada"
      }
    ];

    gridRoot.innerHTML = "";

    cards.forEach((cardData) => {
      const card = document.createElement("div");
      card.className = "pulse-mini-card";

      const label = document.createElement("span");
      label.textContent = cardData.label;
      card.appendChild(label);

      const value = document.createElement("strong");
      value.textContent = cardData.value;
      card.appendChild(value);

      const detail = document.createElement("small");
      detail.textContent = cardData.detail;
      card.appendChild(detail);

      gridRoot.appendChild(card);
    });
  }

  function renderSuccessGrid(root, summary) {
    if (!root) {
      return;
    }

    const authoritySignals = computeAuthoritySignals(summary);
    const milestones = [
      {
        title: "Alcance",
        metric: "reach",
        value: summary.reach,
        target: 100000,
        detail: "Meta visual de distribuição"
      },
      {
        title: "Visitas",
        metric: "profileVisits",
        value: summary.profileVisits,
        target: 8000,
        detail: "Fluxo até o perfil"
      },
      {
        title: "Seguidores",
        metric: "followers",
        value: summary.followers,
        target: 250,
        detail: "Crescimento de audiência"
      },
      {
        title: "Autoridade",
        metric: "authority",
        value: authoritySignals,
        target: 220,
        detail: "Compartilhamentos, salvamentos e comentários"
      }
    ];

    root.innerHTML = "";

    milestones.forEach((milestone) => {
      const progress = Math.min(milestone.value / milestone.target, 1);
      const statusText = progress >= 1 ? "Acima da meta" : progress >= 0.9 ? "Muito perto" : "Em evolução";

      const card = document.createElement("article");
      card.className = "success-card";

      const head = document.createElement("div");
      head.className = "success-head";

      const title = document.createElement("strong");
      title.textContent = milestone.title;
      head.appendChild(title);

      const status = document.createElement("span");
      status.className = "success-status";
      status.textContent = statusText;
      head.appendChild(status);
      card.appendChild(head);

      const value = document.createElement("b");
      value.textContent = milestone.metric === "authority"
        ? numberFormatter.format(milestone.value)
        : formatMetricValue(milestone.metric, milestone.value);
      card.appendChild(value);

      const detail = document.createElement("span");
      detail.textContent = milestone.detail;
      card.appendChild(detail);

      const progressTrack = document.createElement("div");
      progressTrack.className = "success-progress";

      const progressFill = document.createElement("div");
      progressFill.className = "success-fill";
      progressFill.style.width = `${Math.max(progress * 100, 8)}%`;
      progressTrack.appendChild(progressFill);
      card.appendChild(progressTrack);

      const meta = document.createElement("div");
      meta.className = "success-meta";

      const left = document.createElement("span");
      left.textContent = `Meta ${milestone.metric === "authority" ? numberFormatter.format(milestone.target) : formatMetricValue(milestone.metric, milestone.target)}`;
      meta.appendChild(left);

      const right = document.createElement("span");
      right.textContent = formatShortPercent(progress * 100);
      meta.appendChild(right);
      card.appendChild(meta);

      root.appendChild(card);
    });
  }

  function renderFunnel(root, summary) {
    if (!root) {
      return;
    }

    const maxValue = Math.max(summary.reach, summary.clicks, summary.profileVisits, summary.followers, 1);
    const steps = [
      { label: "Alcance", metric: "reach", value: summary.reach, helper: "topo do funil" },
      { label: "Cliques", metric: "clicks", value: summary.clicks, helper: "interesse direto" },
      { label: "Visitas", metric: "profileVisits", value: summary.profileVisits, helper: "chegada ao perfil" },
      { label: "Seguidores", metric: "followers", value: summary.followers, helper: "conversão de audiência" }
    ];

    root.innerHTML = "";

    steps.forEach((step) => {
      const row = document.createElement("div");
      row.className = "funnel-step";

      const head = document.createElement("div");
      head.className = "funnel-step-head";

      const title = document.createElement("strong");
      title.textContent = step.label;
      head.appendChild(title);

      const value = document.createElement("span");
      value.textContent = formatMetricValue(step.metric, step.value);
      head.appendChild(value);

      row.appendChild(head);

      const visual = document.createElement("div");
      visual.className = "funnel-visual";

      const fill = document.createElement("div");
      fill.className = "funnel-fill";
      fill.style.setProperty("--step-width", `${Math.max((step.value / maxValue) * 100, 18)}%`);

      const helper = document.createElement("span");
      helper.textContent = step.helper;
      fill.appendChild(helper);

      visual.appendChild(fill);
      row.appendChild(visual);
      root.appendChild(row);
    });
  }

  function renderEngagement(ringRoot, totalRoot, legendRoot, summary) {
    const items = [
      { label: "Compartilhamentos", value: summary.shares || 0, color: "#f88834" },
      { label: "Salvamentos", value: summary.saves || 0, color: "#7cd8c0" },
      { label: "Comentários", value: summary.comments || 0, color: "#8bb8ff" }
    ];
    const total = items.reduce((sum, item) => sum + item.value, 0);

    if (ringRoot) {
      let start = 0;
      const gradientParts = items.map((item) => {
        const share = total ? (item.value / total) * 360 : 0;
        const end = start + share;
        const part = `${item.color} ${start}deg ${end}deg`;
        start = end;
        return part;
      });
      gradientParts.push(`rgba(255, 255, 255, 0.08) ${start}deg 360deg`);
      ringRoot.style.background = `conic-gradient(${gradientParts.join(", ")})`;
    }

    if (totalRoot) {
      totalRoot.textContent = numberFormatter.format(total);
    }

    if (!legendRoot) {
      return;
    }

    legendRoot.innerHTML = "";

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "engagement-item";

      const head = document.createElement("div");
      head.className = "engagement-item-head";

      const label = document.createElement("div");
      label.className = "engagement-label";

      const swatch = document.createElement("span");
      swatch.className = "engagement-swatch";
      swatch.style.setProperty("--swatch-color", item.color);
      label.appendChild(swatch);

      const text = document.createElement("strong");
      text.textContent = item.label;
      label.appendChild(text);
      head.appendChild(label);

      const value = document.createElement("strong");
      value.textContent = numberFormatter.format(item.value);
      head.appendChild(value);
      row.appendChild(head);

      const share = document.createElement("span");
      share.textContent = total ? `${percentFormatter.format((item.value / total) * 100)} do total` : "Sem participação";
      row.appendChild(share);

      legendRoot.appendChild(row);
    });
  }

  function renderAudienceShareChart(root, audiences, metric) {
    if (!root) {
      return;
    }

    const totalScore = audiences.reduce((sum, audience) => sum + scoreMetricValue(audience, metric), 0) || 1;
    root.innerHTML = "";

    const stack = document.createElement("div");
    stack.className = "share-stack";

    audiences.forEach((audience) => {
      const segment = document.createElement("div");
      segment.className = "share-segment";
      segment.style.width = `${(scoreMetricValue(audience, metric) / totalScore) * 100}%`;
      segment.style.setProperty("--segment-color", audience.accent || "#f88834");
      stack.appendChild(segment);
    });

    root.appendChild(stack);

    const list = document.createElement("div");
    list.className = "share-list";

    audiences.forEach((audience) => {
      const shareValue = (scoreMetricValue(audience, metric) / totalScore) * 100;
      const card = document.createElement("div");
      card.className = "share-item";
      card.style.setProperty("--segment-color", audience.accent || "#f88834");

      const head = document.createElement("div");
      head.className = "share-item-head";

      const label = document.createElement("div");
      label.className = "share-label";

      const swatch = document.createElement("span");
      swatch.className = "share-swatch";
      swatch.style.setProperty("--swatch-color", audience.accent || "#f88834");
      label.appendChild(swatch);

      const name = document.createElement("strong");
      name.textContent = audience.name;
      label.appendChild(name);
      head.appendChild(label);

      const share = document.createElement("span");
      share.textContent = `${percentFormatter.format(shareValue)}`;
      head.appendChild(share);
      card.appendChild(head);

      const value = document.createElement("span");
      value.textContent = `${formatMetricValue(metric, audience[metric])} em ${getMetricLabel(metric).toLowerCase()}`;
      card.appendChild(value);

      const bar = document.createElement("div");
      bar.className = "share-item-bar";

      const fill = document.createElement("div");
      fill.className = "share-item-fill";
      fill.style.setProperty("--share-width", `${Math.max(shareValue, 8)}%`);
      bar.appendChild(fill);
      card.appendChild(bar);

      list.appendChild(card);
    });

    root.appendChild(list);
  }

  function renderScoreboard(root, summary) {
    if (!root) {
      return;
    }

    const cards = [
      { label: "Cliques", metric: "clicks", value: summary.clicks, detail: "gerados no mês" },
      { label: "CPC", metric: "costPerClick", value: summary.costPerClick, detail: "custo por clique" },
      { label: "CTR", metric: "ctr", value: summary.ctr, detail: "média consolidada" },
      { label: "Salvamentos", metric: "saves", value: summary.saves, detail: "sinal de intenção" }
    ];

    root.innerHTML = "";

    cards.forEach((cardData) => {
      const card = document.createElement("div");
      card.className = "scoreboard-card";

      const label = document.createElement("span");
      label.textContent = cardData.label;
      card.appendChild(label);

      const value = document.createElement("strong");
      value.textContent = formatMetricValue(cardData.metric, cardData.value);
      card.appendChild(value);

      const detail = document.createElement("small");
      detail.textContent = cardData.detail;
      card.appendChild(detail);

      root.appendChild(card);
    });
  }

  function renderSpotlights(root, audiences, selectedMetric, followerOrigins) {
    if (!root) {
      return;
    }

    const cards = [];
    const selectedChampion = getTopAudience(audiences, selectedMetric);

    (followerOrigins || []).slice(0, 2).forEach((origin) => {
      const audience = audiences.find((item) => normalizeText(item.name) === normalizeText(origin.audienceName));

      if (!audience) {
        return;
      }

      cards.push({
        title: origin.title,
        value: `${formatMetricValue("followers", audience.followers)} seguidores`,
        detail: origin.supportMetric
      });
    });

    if (selectedChampion) {
      cards.push({
        title: `Top em ${getMetricLabel(selectedMetric).toLowerCase()}`,
        value: selectedChampion.name,
        detail: `${formatMetricValue(selectedMetric, selectedChampion[selectedMetric])} na métrica selecionada`
      });
    }

    root.innerHTML = "";

    cards.slice(0, 3).forEach((cardData, index) => {
      const card = document.createElement("article");
      card.className = "spotlight-card";

      const head = document.createElement("div");
      head.className = "spotlight-head";

      const title = document.createElement("strong");
      title.textContent = cardData.title;
      head.appendChild(title);

      const rank = document.createElement("span");
      rank.className = "spotlight-rank";
      rank.textContent = `0${index + 1}`;
      head.appendChild(rank);
      card.appendChild(head);

      const value = document.createElement("span");
      value.textContent = cardData.value;
      card.appendChild(value);

      const detail = document.createElement("p");
      detail.textContent = cardData.detail;
      card.appendChild(detail);

      root.appendChild(card);
    });
  }

  function renderMetricBars(root, audiences, metric) {
    if (!root) {
      return;
    }

    const maxValue = Math.max(
      ...audiences.map((audience) => scoreMetricValue(audience, metric)),
      1
    );

    root.innerHTML = "";

    audiences.forEach((audience) => {
      const width = (scoreMetricValue(audience, metric) / maxValue) * 100;

      const row = document.createElement("div");
      row.className = "metric-row";

      const copy = document.createElement("div");
      copy.className = "metric-copy";

      const name = document.createElement("strong");
      name.textContent = audience.name;
      copy.appendChild(name);

      const note = document.createElement("span");
      note.textContent = audience.note || "Comparativo do conjunto";
      copy.appendChild(note);
      row.appendChild(copy);

      const track = document.createElement("div");
      track.className = "metric-track";

      const fill = document.createElement("div");
      fill.className = "metric-fill";
      fill.style.width = `${Math.max(width, 8)}%`;
      fill.style.setProperty("--bar-color", audience.accent || "#f88834");
      track.appendChild(fill);
      row.appendChild(track);

      const value = document.createElement("div");
      value.className = "metric-value";
      value.textContent = formatMetricValue(metric, audience[metric]);
      row.appendChild(value);

      root.appendChild(row);
    });
  }

  function renderAudienceCards(root, audiences, selectedMetric) {
    if (!root) {
      return;
    }

    const maxFocus = Math.max(...audiences.map((audience) => scoreMetricValue(audience, selectedMetric)), 1);
    root.innerHTML = "";

    audiences.forEach((audience) => {
      const statusMeta = STATUS_META[audience.status] || STATUS_META.archived;
      const focusWidth = (scoreMetricValue(audience, selectedMetric) / maxFocus) * 100;

      const card = document.createElement("article");
      card.className = "audience-card";

      const head = document.createElement("div");
      head.className = "audience-card-head";

      const copy = document.createElement("div");

      const title = document.createElement("h3");
      title.textContent = audience.name;
      copy.appendChild(title);

      const note = document.createElement("p");
      note.textContent = audience.note;
      copy.appendChild(note);
      head.appendChild(copy);

      const badge = document.createElement("span");
      badge.className = `status-pill ${statusMeta.className}`;
      badge.textContent = statusMeta.label;
      head.appendChild(badge);
      card.appendChild(head);

      const focus = document.createElement("div");
      focus.className = "audience-focus";

      const focusHead = document.createElement("div");
      focusHead.className = "audience-focus-head";

      const focusLabel = document.createElement("span");
      focusLabel.textContent = getMetricLabel(selectedMetric);
      focusHead.appendChild(focusLabel);

      const focusValue = document.createElement("strong");
      focusValue.textContent = formatMetricValue(selectedMetric, audience[selectedMetric]);
      focusHead.appendChild(focusValue);
      focus.appendChild(focusHead);

      const focusTrack = document.createElement("div");
      focusTrack.className = "audience-focus-track";

      const focusFill = document.createElement("div");
      focusFill.className = "audience-focus-fill";
      focusFill.style.setProperty("--focus-width", `${Math.max(focusWidth, 8)}%`);
      focusFill.style.setProperty("--focus-color", audience.accent || "#f88834");
      focusTrack.appendChild(focusFill);
      focus.appendChild(focusTrack);
      card.appendChild(focus);

      const stats = document.createElement("div");
      stats.className = "audience-stats";

      [
        { label: "Cliques", metric: "clicks", value: audience.clicks },
        { label: "CPC", metric: "costPerClick", value: audience.costPerClick },
        { label: "Visitas", metric: "profileVisits", value: audience.profileVisits },
        { label: "Seguidores", metric: "followers", value: audience.followers },
        { label: "Alcance", metric: "reach", value: audience.reach },
        { label: "Salvamentos", metric: "saves", value: audience.saves }
      ].forEach((item) => {
        const stat = document.createElement("div");
        stat.className = "mini-stat";

        const value = document.createElement("strong");
        value.textContent = formatMetricValue(item.metric, item.value);
        stat.appendChild(value);

        const label = document.createElement("span");
        label.textContent = item.label;
        stat.appendChild(label);

        stats.appendChild(stat);
      });

      card.appendChild(stats);
      root.appendChild(card);
    });
  }

  function renderDocuments(root, documents) {
    if (!root) {
      return;
    }

    root.innerHTML = "";

    documents.forEach((documentItem) => {
      const link = document.createElement("a");
      link.className = "document-link";
      link.href = documentItem.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const copy = document.createElement("span");
      copy.className = "document-copy";

      const title = document.createElement("strong");
      title.textContent = documentItem.title;
      copy.appendChild(title);

      const meta = document.createElement("span");
      meta.textContent = documentItem.meta;
      copy.appendChild(meta);

      link.appendChild(copy);

      const arrow = document.createElement("span");
      arrow.className = "document-arrow";
      arrow.textContent = "Abrir";
      link.appendChild(arrow);

      root.appendChild(link);
    });
  }

  function initReport(report) {
    const reportData = enrichReport(report);
    const startInput = document.querySelector("[data-filter-start]");
    const endInput = document.querySelector("[data-filter-end]");
    const statusSelect = document.querySelector("[data-filter-status]");
    const metricSelect = document.querySelector("[data-filter-metric]");
    const periodLabel = document.querySelector("[data-period-label]");
    const coverageNote = document.querySelector("[data-coverage-note]");
    const emptyState = document.querySelector("[data-empty-state]");
    const heroKpis = document.querySelector("[data-hero-kpis]");
    const pulseScore = document.querySelector("[data-pulse-score]");
    const pulseGrid = document.querySelector("[data-pulse-grid]");
    const successGrid = document.querySelector("[data-success-grid]");
    const funnelChart = document.querySelector("[data-funnel-chart]");
    const engagementRing = document.querySelector("[data-engagement-ring]");
    const engagementTotal = document.querySelector("[data-engagement-total]");
    const engagementLegend = document.querySelector("[data-engagement-legend]");
    const audienceShareChart = document.querySelector("[data-audience-share-chart]");
    const scoreboardGrid = document.querySelector("[data-scoreboard-grid]");
    const spotlightList = document.querySelector("[data-spotlight-list]");
    const metricBars = document.querySelector("[data-metric-bars]");
    const audienceGrid = document.querySelector("[data-audience-grid]");
    const documentList = document.querySelector("[data-document-list]");

    if (!startInput || !endInput || !statusSelect || !metricSelect) {
      return;
    }

    startInput.min = reportData.coverageStart;
    startInput.max = reportData.coverageEnd;
    startInput.value = reportData.coverageStart;

    endInput.min = reportData.coverageStart;
    endInput.max = reportData.coverageEnd;
    endInput.value = reportData.coverageEnd;

    metricSelect.innerHTML = "";
    metricOptions.forEach((option) => {
      const element = document.createElement("option");
      element.value = option.value;
      element.textContent = option.label;
      metricSelect.appendChild(element);
    });
    metricSelect.value = "profileVisits";

    renderDocuments(documentList, reportData.documents || []);

    function clearDashboard() {
      [
        heroKpis,
        pulseScore,
        pulseGrid,
        successGrid,
        funnelChart,
        audienceShareChart,
        scoreboardGrid,
        spotlightList,
        metricBars,
        audienceGrid,
        engagementLegend
      ].forEach((root) => {
        if (root) {
          root.innerHTML = "";
        }
      });

      if (engagementRing) {
        engagementRing.style.background = "conic-gradient(rgba(255, 255, 255, 0.08) 0deg 360deg)";
      }

      if (engagementTotal) {
        engagementTotal.textContent = "0";
      }
    }

    function syncReport() {
      const selectedMetric = metricSelect.value || "profileVisits";
      const selectedStatus = statusSelect.value || "all";
      let selectedStart = startInput.value || reportData.coverageStart;
      let selectedEnd = endInput.value || reportData.coverageEnd;

      if (selectedStart > selectedEnd) {
        endInput.value = selectedStart;
        selectedEnd = selectedStart;
      }

      const visibleAudiences = reportData.audiences.filter((audience) => {
        return selectedStatus === "all" ? true : audience.status === selectedStatus;
      });

      periodLabel.textContent = `${formatDate(selectedStart)} até ${formatDate(selectedEnd)}`;

      if (selectedStart !== reportData.coverageStart || selectedEnd !== reportData.coverageEnd) {
        coverageNote.textContent =
          "Este arquivo foi importado em visão consolidada mensal. O painel preserva os totais do recorte completo de março.";
      } else {
        coverageNote.textContent =
          "Painel consolidado de 01/03/2026 a 31/03/2026. A troca de status e métrica atualiza os cards do dashboard em tempo real.";
      }

      if (!visibleAudiences.length) {
        emptyState.hidden = false;
        clearDashboard();
        return;
      }

      emptyState.hidden = true;

      const currentSummary = aggregateSummary(visibleAudiences);

      renderHeroKpis(heroKpis, currentSummary);
      renderPulse(pulseScore, pulseGrid, currentSummary, visibleAudiences, selectedMetric);
      renderSuccessGrid(successGrid, currentSummary);
      renderFunnel(funnelChart, currentSummary);
      renderEngagement(engagementRing, engagementTotal, engagementLegend, currentSummary);
      renderAudienceShareChart(audienceShareChart, visibleAudiences, selectedMetric);
      renderScoreboard(scoreboardGrid, currentSummary);
      renderSpotlights(spotlightList, visibleAudiences, selectedMetric, reportData.followerOrigins || []);
      renderMetricBars(metricBars, visibleAudiences, selectedMetric);
      renderAudienceCards(audienceGrid, visibleAudiences, selectedMetric);
    }

    startInput.addEventListener("change", syncReport);
    endInput.addEventListener("change", syncReport);
    statusSelect.addEventListener("change", syncReport);
    metricSelect.addEventListener("change", syncReport);

    syncReport();
  }

  initGate(pageConfig.gate);

  if (pageConfig.report) {
    initReport(pageConfig.report);
  }
}());
