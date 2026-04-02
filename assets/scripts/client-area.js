(function () {
  const directory = window.CLIENT_ACCESS_DIRECTORY || {};
  const form = document.querySelector("[data-client-search]");
  const input = document.querySelector("[data-client-search-input]");
  const feedback = document.querySelector("[data-search-feedback]");
  const resultsRoot = document.querySelector("[data-search-results]");

  if (!form || !input || !feedback || !resultsRoot) {
    return;
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  const clients = (directory.clients || []).map((client) => {
    const aliases = Array.isArray(client.aliases) ? client.aliases : [];

    return {
      ...client,
      searchTerms: [client.name, ...aliases].map(normalizeText)
    };
  });

  function renderResults(matches) {
    resultsRoot.innerHTML = "";
    resultsRoot.hidden = false;

    matches.forEach((client) => {
      const card = document.createElement("article");
      card.className = "client-result-card";

      const head = document.createElement("div");
      head.className = "client-result-head";

      const title = document.createElement("h3");
      title.textContent = client.name;
      head.appendChild(title);

      const status = document.createElement("span");
      status.className = "client-result-status";
      status.textContent = client.status || "Disponível";
      head.appendChild(status);

      card.appendChild(head);

      const summary = document.createElement("p");
      summary.textContent = client.summary;
      card.appendChild(summary);

      if (Array.isArray(client.tags) && client.tags.length > 0) {
        const tags = document.createElement("div");
        tags.className = "client-result-tags";

        client.tags.forEach((tag) => {
          const chip = document.createElement("span");
          chip.textContent = tag;
          tags.appendChild(chip);
        });

        card.appendChild(tags);
      }

      const actions = document.createElement("div");
      actions.className = "client-result-actions";

      const link = document.createElement("a");
      link.className = "button button-primary";
      link.href = client.route;
      link.rel = "nofollow";
      link.textContent = "Entrar na minha área";
      actions.appendChild(link);

      card.appendChild(actions);
      resultsRoot.appendChild(card);
    });
  }

  function findMatches(query) {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return [];
    }

    return clients.filter((client) => {
      return client.searchTerms.some((term) => {
        return term.includes(normalizedQuery) || normalizedQuery.includes(term);
      });
    });
  }

  function handleSearch(event) {
    event.preventDefault();

    const query = input.value.trim();

    if (!query) {
      feedback.textContent = "Digite seu nome para localizar sua página.";
      resultsRoot.hidden = true;
      resultsRoot.innerHTML = "";
      return;
    }

    const normalizedQuery = normalizeText(query);
    const exactMatch = clients.find((client) => {
      return client.searchTerms.some((term) => term === normalizedQuery);
    });

    if (exactMatch) {
      window.location.href = exactMatch.route;
      return;
    }

    const matches = findMatches(query);

    if (matches.length === 0) {
      feedback.textContent = "Não encontramos uma área com esse nome. Confira a grafia e tente novamente.";
      resultsRoot.hidden = true;
      resultsRoot.innerHTML = "";
      return;
    }

    feedback.textContent = matches.length === 1
      ? "Encontramos uma área com esse nome. Use o botão abaixo para entrar."
      : `Encontramos ${matches.length} áreas relacionadas a esse nome.`;

    renderResults(matches);
  }

  form.addEventListener("submit", handleSearch);
}());
