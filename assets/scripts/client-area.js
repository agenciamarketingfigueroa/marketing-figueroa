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

  function renderEmptyState(title, body) {
    resultsRoot.innerHTML = "";

    const card = document.createElement("div");
    card.className = "client-result-empty";

    const strong = document.createElement("strong");
    strong.textContent = title;
    card.appendChild(strong);

    const paragraph = document.createElement("p");
    paragraph.textContent = body;
    card.appendChild(paragraph);

    resultsRoot.appendChild(card);
  }

  function renderResults(matches) {
    resultsRoot.innerHTML = "";

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
      renderEmptyState(
        "Digite seu nome",
        "Exemplo de busca: Victor Lopes. Depois de localizar sua área, a senha é solicitada dentro da própria página."
      );
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
      renderEmptyState(
        "Nenhuma área encontrada",
        "Se preferir, fale direto com a equipe para confirmar o nome usado no cadastro da sua página."
      );
      return;
    }

    feedback.textContent = matches.length === 1
      ? "Encontramos uma área com esse nome. Use o botão abaixo para entrar."
      : `Encontramos ${matches.length} áreas relacionadas a esse nome.`;

    renderResults(matches);
  }

  form.addEventListener("submit", handleSearch);

  renderEmptyState(
    "Busque seu nome",
    "Digite seu nome completo para localizar sua página. Quando o nome bater, você entra na área reservada e desbloqueia o conteúdo com a senha recebida."
  );
}());
