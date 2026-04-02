(function () {
  const pageConfig = window.INTERNAL_PORTAL_PAGE || {};
  const study = pageConfig.study;

  if (!study || !Array.isArray(study.personas) || !study.personas.length) {
    return;
  }

  const numberFormatter = new Intl.NumberFormat("pt-BR");

  const personaSelect = document.querySelector("[data-study-persona]");
  const studyLabel = document.querySelector("[data-study-label]");
  const activeLabel = document.querySelector("[data-study-active-label]");
  const activeNote = document.querySelector("[data-study-active-note]");
  const kpisRoot = document.querySelector("[data-study-kpis]");
  const pulseScoreRoot = document.querySelector("[data-study-pulse-score]");
  const pulseGridRoot = document.querySelector("[data-study-pulse-grid]");
  const coreRoot = document.querySelector("[data-study-core]");
  const signalsRoot = document.querySelector("[data-study-signals]");
  const objectionsRoot = document.querySelector("[data-study-objections]");
  const triggersRoot = document.querySelector("[data-study-triggers]");
  const languageRoot = document.querySelector("[data-study-language]");
  const symbolsRoot = document.querySelector("[data-study-symbols]");
  const curiositiesRoot = document.querySelector("[data-study-curiosities]");
  const journeyRoot = document.querySelector("[data-study-journey]");
  const documentsRoot = document.querySelector("[data-study-documents]");

  if (!personaSelect) {
    return;
  }

  const personas = study.personas;
  const personaMap = new Map(personas.map((persona) => [persona.id, persona]));

  function renderKpis(persona) {
    if (!kpisRoot) {
      return;
    }

    const cards = [
      { value: persona.ageRange, label: "faixa etária" },
      { value: persona.incomeRange, label: "faixa de renda" },
      { value: persona.investmentRange, label: "bolso ou ticket mental" },
      { value: persona.focusValue, label: persona.focusLabel }
    ];

    kpisRoot.innerHTML = "";

    cards.forEach((cardData) => {
      const card = document.createElement("div");
      card.className = "metric-chip";

      const value = document.createElement("strong");
      value.textContent = cardData.value;
      card.appendChild(value);

      const label = document.createElement("span");
      label.textContent = cardData.label;
      card.appendChild(label);

      kpisRoot.appendChild(card);
    });
  }

  function renderPulse(persona) {
    if (pulseScoreRoot) {
      pulseScoreRoot.innerHTML = "";

      const angle = Math.round((persona.readinessScore / 100) * 360);

      const ring = document.createElement("div");
      ring.className = "pulse-ring";
      ring.style.background = `conic-gradient(var(--portal-accent) 0deg ${angle}deg, rgba(255, 255, 255, 0.08) ${angle}deg 360deg)`;

      const ringCore = document.createElement("div");
      ringCore.className = "pulse-ring-core";

      const scoreValue = document.createElement("strong");
      scoreValue.textContent = persona.readinessScore;
      ringCore.appendChild(scoreValue);

      const scoreLabel = document.createElement("span");
      scoreLabel.textContent = "fit comercial";
      ringCore.appendChild(scoreLabel);

      ring.appendChild(ringCore);
      pulseScoreRoot.appendChild(ring);

      const copy = document.createElement("div");
      copy.className = "pulse-copy";

      const title = document.createElement("strong");
      title.textContent = persona.readinessTitle;
      copy.appendChild(title);

      const paragraph = document.createElement("p");
      paragraph.textContent = persona.readinessBody;
      copy.appendChild(paragraph);

      const small = document.createElement("small");
      small.textContent = persona.primaryGoal;
      copy.appendChild(small);

      pulseScoreRoot.appendChild(copy);
    }

    if (!pulseGridRoot) {
      return;
    }

    const cards = [
      {
        label: "Urgência",
        value: `${persona.scores.urgency}/100`,
        detail: "dor imediata para agir"
      },
      {
        label: "Prova",
        value: `${persona.scores.proof}/100`,
        detail: "quanto precisa de casos e dados"
      },
      {
        label: "Pressão social",
        value: `${persona.scores.social}/100`,
        detail: "peso do julgamento externo"
      },
      {
        label: "Disposição de investimento",
        value: `${persona.scores.investment}/100`,
        detail: "abertura para comprar solução premium"
      }
    ];

    pulseGridRoot.innerHTML = "";

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

      pulseGridRoot.appendChild(card);
    });
  }

  function renderCore(persona) {
    if (!coreRoot) {
      return;
    }

    const cards = [
      { title: "Objetivo principal", body: persona.primaryGoal },
      { title: "Queixa principal", body: persona.primaryPain },
      { title: "Medo último", body: persona.deepFear },
      { title: "Soluções falsas", body: persona.falseSolutions.join(", ") }
    ];

    coreRoot.innerHTML = "";

    cards.forEach((cardData) => {
      const card = document.createElement("article");
      card.className = "objective-card";

      const title = document.createElement("strong");
      title.textContent = cardData.title;
      card.appendChild(title);

      const paragraph = document.createElement("p");
      paragraph.textContent = cardData.body;
      card.appendChild(paragraph);

      coreRoot.appendChild(card);
    });
  }

  function renderSignals(persona) {
    if (!signalsRoot) {
      return;
    }

    const items = [
      {
        title: "Urgência de decisão",
        value: persona.scores.urgency,
        note: "quanto a dor empurra a compra"
      },
      {
        title: "Medo de perda",
        value: persona.scores.fear,
        note: "quanto o risco de perder carreira, dinheiro ou status pesa"
      },
      {
        title: "Dependência de prova",
        value: persona.scores.proof,
        note: "força de cases, dados e validação externa"
      },
      {
        title: "Pressão social",
        value: persona.scores.social,
        note: "impacto de torcida, pares, família ou mercado"
      },
      {
        title: "Apetite para investir",
        value: persona.scores.investment,
        note: "disposição real para pagar pela solução"
      }
    ];

    signalsRoot.innerHTML = "";

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "metric-row";

      const copy = document.createElement("div");
      copy.className = "metric-copy";

      const name = document.createElement("strong");
      name.textContent = item.title;
      copy.appendChild(name);

      const note = document.createElement("span");
      note.textContent = item.note;
      copy.appendChild(note);
      row.appendChild(copy);

      const track = document.createElement("div");
      track.className = "metric-track";

      const fill = document.createElement("div");
      fill.className = "metric-fill";
      fill.style.width = `${Math.max(item.value, 8)}%`;
      fill.style.setProperty("--bar-color", "var(--portal-accent)");
      track.appendChild(fill);
      row.appendChild(track);

      const value = document.createElement("div");
      value.className = "metric-value";
      value.textContent = `${numberFormatter.format(item.value)}/100`;
      row.appendChild(value);

      signalsRoot.appendChild(row);
    });
  }

  function renderSpotlights(root, items) {
    if (!root) {
      return;
    }

    root.innerHTML = "";

    items.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "spotlight-card";

      const head = document.createElement("div");
      head.className = "spotlight-head";

      const title = document.createElement("strong");
      title.textContent = item.title;
      head.appendChild(title);

      const rank = document.createElement("span");
      rank.className = "spotlight-rank";
      rank.textContent = `0${index + 1}`;
      head.appendChild(rank);
      card.appendChild(head);

      const detail = document.createElement("p");
      detail.textContent = item.detail;
      card.appendChild(detail);

      root.appendChild(card);
    });
  }

  function renderLanguage(persona) {
    if (!languageRoot) {
      return;
    }

    const cards = [
      {
        title: "Estilo de comunicação",
        body: persona.communicationStyle,
        tags: persona.verbalTriggers.slice(0, 4)
      },
      {
        title: "Promessa que acende",
        body: persona.promise,
        tags: persona.promiseTags
      },
      {
        title: "Evidência que convence",
        body: persona.evidence,
        tags: persona.evidenceTags
      },
      {
        title: "Resultado percebido",
        body: persona.benefit,
        tags: persona.resultTags
      }
    ];

    languageRoot.innerHTML = "";

    cards.forEach((cardData) => {
      const card = document.createElement("article");
      card.className = "insight-card";

      const title = document.createElement("strong");
      title.textContent = cardData.title;
      card.appendChild(title);

      const paragraph = document.createElement("p");
      paragraph.textContent = cardData.body;
      card.appendChild(paragraph);

      if (Array.isArray(cardData.tags) && cardData.tags.length) {
        const tags = document.createElement("div");
        tags.className = "mini-tag-row";

        cardData.tags.forEach((tagText) => {
          const tag = document.createElement("span");
          tag.className = "tag";
          tag.textContent = tagText;
          tags.appendChild(tag);
        });

        card.appendChild(tags);
      }

      languageRoot.appendChild(card);
    });
  }

  function renderSymbols(persona) {
    if (!symbolsRoot) {
      return;
    }

    const cards = [
      { title: "Tribo", body: persona.tribe },
      { title: "Inimigo comum", body: persona.enemy },
      { title: "Modelos de referência", body: persona.models.join(", ") },
      { title: "Anti-modelos", body: persona.antiModels.join(", ") }
    ];

    symbolsRoot.innerHTML = "";

    cards.forEach((cardData) => {
      const card = document.createElement("article");
      card.className = "audience-card";

      const title = document.createElement("h3");
      title.textContent = cardData.title;
      card.appendChild(title);

      const paragraph = document.createElement("p");
      paragraph.textContent = cardData.body;
      card.appendChild(paragraph);

      symbolsRoot.appendChild(card);
    });
  }

  function renderJourney(persona) {
    if (!journeyRoot) {
      return;
    }

    journeyRoot.innerHTML = "";

    persona.journey.forEach((step, index) => {
      const item = document.createElement("div");
      item.className = "timeline-item";

      const marker = document.createElement("span");
      marker.className = "timeline-index";
      marker.textContent = `0${index + 1}`;
      item.appendChild(marker);

      const copy = document.createElement("div");

      const title = document.createElement("strong");
      title.textContent = step.title;
      copy.appendChild(title);

      const paragraph = document.createElement("p");
      paragraph.textContent = step.body;
      copy.appendChild(paragraph);

      item.appendChild(copy);
      journeyRoot.appendChild(item);
    });
  }

  function renderDocuments(documents) {
    if (!documentsRoot) {
      return;
    }

    documentsRoot.innerHTML = "";

    documents.forEach((documentItem) => {
      const link = document.createElement("a");
      link.className = "document-link";
      link.href = documentItem.href;
      if (documentItem.href.startsWith("http") || documentItem.href.endsWith(".docx")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

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

      documentsRoot.appendChild(link);
    });
  }

  function syncStudy() {
    const persona = personaMap.get(personaSelect.value) || personas[0];

    if (studyLabel) {
      studyLabel.textContent = persona.label;
    }

    if (activeLabel) {
      activeLabel.textContent = persona.label;
    }

    if (activeNote) {
      activeNote.textContent = persona.summary;
    }

    renderKpis(persona);
    renderPulse(persona);
    renderCore(persona);
    renderSignals(persona);
    renderSpotlights(objectionsRoot, persona.objections);
    renderSpotlights(triggersRoot, persona.triggers);
    renderLanguage(persona);
    renderSymbols(persona);
    renderSpotlights(curiositiesRoot, persona.curiosities);
    renderJourney(persona);
    renderDocuments(study.documents || []);
  }

  personaSelect.innerHTML = "";
  personas.forEach((persona) => {
    const option = document.createElement("option");
    option.value = persona.id;
    option.textContent = persona.label;
    personaSelect.appendChild(option);
  });

  personaSelect.value = personas[0].id;
  personaSelect.addEventListener("change", syncStudy);

  syncStudy();
}());
