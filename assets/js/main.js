/**
 * CM SOLUTION — comportamento do site
 * Depende de assets/js/data.js (MACHINES, CATEGORIES, WHATSAPP_NUMBER).
 */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const brl = (n) => n.toLocaleString("pt-BR");

  const state = { filter: "todos", query: "" };
  let lastFocus = null;

  /* ---------- WhatsApp ---------- */
  function openWhatsApp(message) {
    const text = message || "Olá! Vim pelo site da CM SOLUTION e gostaria de falar com um especialista.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  /* ---------- Catálogo ---------- */
  function cardTemplate(m) {
    return `
      <article class="mc reveal">
        <button class="mc__media" data-open="${m.id}" aria-label="Ver ficha técnica: ${m.name}">
          <span class="mc__badge">${m.badge}</span>
          <img src="${m.image}" alt="${m.name}" loading="lazy" width="900" height="900">
        </button>
        <div class="mc__body">
          <p class="mc__cat">${CATEGORIES[m.category]}</p>
          <h3 class="mc__name">${m.name}</h3>
          <p class="mc__tag">${m.tagline}</p>
          <ul class="mc__chips">${m.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
          <div class="mc__actions">
            <button class="btn btn--outline btn--sm" data-open="${m.id}">Ficha técnica</button>
            <button class="btn btn--primary btn--sm" data-quote="${m.name}">Cotação</button>
          </div>
        </div>
      </article>`;
  }

  // card final: ocupa o espaço que sobra na última linha da grade (3 colunas)
  function ctaTemplate(count) {
    const span = [3, 2, 1][count % 3];
    return `
      <article class="mc mc--cta reveal" style="--span:${span}">
        <img src="assets/img/brand/logo-cm.png" alt="" width="64" height="74">
        <h3>Não achou o <span>modelo ideal?</span></h3>
        <p>Informe a peça, o material e o volume. Indicamos a máquina certa, inclusive linhas que não estão no catálogo.</p>
        <button class="btn btn--primary" data-whatsapp="Olá! Preciso de ajuda para escolher a máquina ideal para a minha usinagem.">Falar com especialista <svg class="icon"><use href="#i-arrow-up-right"/></svg></button>
      </article>`;
  }

  function filteredMachines() {
    const q = state.query.trim().toLowerCase();
    return MACHINES.filter((m) => {
      if (state.filter !== "todos" && m.category !== state.filter) return false;
      if (!q) return true;
      const haystack = [m.name, m.tagline, CATEGORIES[m.category], ...m.highlights, ...Object.values(m.specs)]
        .join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }

  function renderCatalog() {
    const list = filteredMachines();
    const grid = $("#grid");
    grid.innerHTML = list.map(cardTemplate).join("") + ctaTemplate(list.length);
    $("#empty").hidden = list.length > 0;
    grid.hidden = list.length === 0;
    if (!list.length) grid.innerHTML = "";
    $("#resultCount").textContent = `${list.length} ${list.length === 1 ? "equipamento" : "equipamentos"}`;
    $$(".reveal", grid).forEach((el) => requestAnimationFrame(() => el.classList.add("is-in")));
  }

  function setFilter(filter) {
    state.filter = filter;
    $$(".chip").forEach((c) => {
      const on = c.dataset.filter === filter;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", on);
    });
    renderCatalog();
  }

  function initCatalog() {
    $$("[data-count]").forEach((el) => {
      const n = MACHINES.filter((m) => m.category === el.dataset.count).length;
      el.textContent = `${n} ${n === 1 ? "modelo" : "modelos"}`;
    });

    $("#filters").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (chip) setFilter(chip.dataset.filter);
    });

    $("#search").addEventListener("input", (e) => {
      state.query = e.target.value;
      renderCatalog();
    });

    // atalhos que abrem uma linha específica do catálogo
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-line]");
      if (!trigger) return;
      e.preventDefault();
      setFilter(trigger.dataset.line);
      $("#maquinas").scrollIntoView({ behavior: "smooth" });
    });

    renderCatalog();
  }

  /* ---------- Ficha técnica (modal) ---------- */
  function openModal(id) {
    const m = MACHINES.find((x) => x.id === id);
    if (!m) return;
    lastFocus = document.activeElement;

    $("#modalImg").src = m.image;
    $("#modalImg").alt = m.name;
    $("#modalCat").textContent = CATEGORIES[m.category];
    $("#modalTitle").textContent = m.name;
    $("#modalTagline").textContent = m.tagline;
    $("#modalSpecs").innerHTML = Object.entries(m.specs)
      .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("");
    $("#modalQuote").onclick = () => { closeModal(); prefillQuote(m.name); };

    const modal = $("#modal");
    modal.hidden = false;
    document.body.classList.add("is-locked");
    requestAnimationFrame(() => modal.classList.add("is-open"));
    $("#modalClose").focus();
  }

  function closeModal() {
    const modal = $("#modal");
    if (modal.hidden) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    setTimeout(() => { modal.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  function initModal() {
    $("#modalClose").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeModal(); closeMenu(); }
      if (e.key === "Tab" && !$("#modal").hidden) trapFocus(e);
    });
  }

  function trapFocus(e) {
    const focusables = $$("button, [href], input, select, textarea", $("#modal")).filter((el) => !el.disabled);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Tipo de máquina / modelo no formulário ---------- */
  const OTHER_MODEL = "__outro";

  function fillModels(type, selected) {
    const model = $("#machineModel");
    const list = MACHINES.filter((m) => m.type === type);
    const placeholder = !type ? "Escolha o tipo primeiro" : "Selecione o modelo";

    model.innerHTML = `<option value="">${placeholder}</option>` +
      list.map((m) => `<option value="${m.id}">${m.name}</option>`).join("") +
      (type ? `<option value="${OTHER_MODEL}">Outro modelo / sob consulta</option>` : "");
    model.disabled = !type;
    model.value = selected || "";
    syncOtherModel();
  }

  function syncOtherModel() {
    const show = $("#machineModel").value === OTHER_MODEL ||
      ($("#machineType").value === "outro");
    $("#modelOtherField").hidden = !show;
    if (!show) $("#modelOther").value = "";
  }

  function initMachineFields() {
    const type = $("#machineType");
    type.addEventListener("change", () => {
      // "outro" não tem lista de modelos: só o campo livre
      if (type.value === "outro") {
        $("#machineModel").innerHTML = `<option value="">Informe abaixo</option>`;
        $("#machineModel").disabled = true;
        syncOtherModel();
      } else {
        fillModels(type.value);
      }
    });
    $("#machineModel").addEventListener("change", syncOtherModel);

    // Serviços (consultoria, mentoria…) não precisam de máquina
    $("#interest").addEventListener("change", syncMachineVisibility);
    syncMachineVisibility();
  }

  function syncMachineVisibility() {
    const isMachine = !/consultoria|mentoria|treinamento|outro assunto/i.test($("#interest").value);
    $("#machineFields").hidden = !isMachine;
    if (!isMachine) {
      $("#machineType").value = "";
      fillModels("");
    }
  }

  /* ---------- Cotação: pré-preenche o formulário ---------- */
  function prefillQuote(subject) {
    const machine = MACHINES.find((m) => m.name === subject);
    const isService = !machine && /consultoria|mentoria|treinamento|simulador/i.test(subject);
    const interest = $("#interest");
    const details = $("#details");
    const wanted = isService
      ? (/treinamento/i.test(subject) ? "Treinamento de equipe de usinagem"
        : /mentoria/i.test(subject) ? "Mentoria em programação CNC"
        : "Consultoria de processos industriais")
      : "Compra de máquina CNC / equipamento";
    interest.value = wanted;
    syncMachineVisibility();

    if (machine) {
      $("#machineType").value = machine.type;
      fillModels(machine.type, machine.id);
      details.value = "Olá! Gostaria de receber proposta e disponibilidade deste equipamento.";
    } else {
      details.value = isService
        ? `Olá! Tenho interesse em: ${subject}.`
        : `Olá! Gostaria de receber proposta e disponibilidade do equipamento: ${subject}.`;
    }

    $("#contato").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => $("#name").focus({ preventScroll: true }), 650);
  }

  /* ---------- Cliques por delegação ---------- */
  function initActions() {
    document.addEventListener("click", (e) => {
      const open = e.target.closest("[data-open]");
      if (open) return openModal(open.dataset.open);

      const quote = e.target.closest("[data-quote]");
      if (quote) return prefillQuote(quote.dataset.quote);

      const wa = e.target.closest("[data-whatsapp]");
      if (wa) return openWhatsApp(wa.dataset.whatsapp);
    });

    // "showcase" do hero é um figure com role=button
    $(".showcase").addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(e.currentTarget.dataset.open); }
    });
  }

  /* ---------- Simulador ---------- */
  function paintRange(input) {
    const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty("--fill", pct + "%");
  }

  function initSimulator() {
    const ids = ["calcShifts", "calcParts", "calcCycle", "calcOptim"];
    const inputs = Object.fromEntries(ids.map((id) => [id, $("#" + id)]));

    function update() {
      const shifts = +inputs.calcShifts.value;
      const parts = +inputs.calcParts.value;
      const cycle = +inputs.calcCycle.value;
      const gain = +inputs.calcOptim.value / 100;

      const hours = (parts * cycle * gain) / 60;
      const extra = Math.round((parts * gain) / (1 - gain));
      const days = hours / (shifts * 8);

      $("#calcShiftsVal").textContent = shifts === 1 ? "1 turno (8 h)" : `${shifts} turnos (${shifts * 8} h/dia)`;
      $("#calcPartsVal").textContent = `${brl(parts)} peças`;
      $("#calcCycleVal").textContent = `${brl(cycle)} min/peça`;
      $("#calcOptimVal").textContent = `${Math.round(gain * 100)}%`;

      $("#resHours").textContent = brl(Math.round(hours));
      $("#resExtraParts").textContent = `+${brl(extra)} peças`;
      $("#resDays").textContent = `${days.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} dias`;

      ids.forEach((id) => paintRange(inputs[id]));
    }

    ids.forEach((id) => inputs[id].addEventListener("input", update));
    update();
  }

  /* ---------- Formulário → WhatsApp ---------- */
  function initForm() {
    const form = $("#quoteForm");
    const phone = $("#phone");

    phone.addEventListener("input", () => {
      const d = phone.value.replace(/\D/g, "").slice(0, 11);
      phone.value = d.length > 6
        ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`
        : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const error = $("#formError");
      const required = ["name", "phone", "interest"].map((id) => $("#" + id));
      let valid = true;

      required.forEach((el) => {
        const ok = el.value.trim() !== "" && (el.id !== "phone" || el.value.replace(/\D/g, "").length >= 10);
        el.closest(".field").classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });

      error.hidden = valid;
      if (!valid) {
        error.textContent = "Preencha nome, WhatsApp com DDD e o interesse principal.";
        return required.find((el) => el.closest(".field").classList.contains("is-invalid")).focus();
      }

      const v = (id) => $("#" + id).value.trim();
      const typeSel = $("#machineType");
      const modelSel = $("#machineModel");
      const machineHidden = $("#machineFields").hidden;
      const machineType = machineHidden || !typeSel.value ? "" : typeSel.selectedOptions[0].textContent.trim();
      const machineModel = machineHidden || !typeSel.value ? ""
        : (modelSel.value === OTHER_MODEL || typeSel.value === "outro")
          ? v("modelOther")
          : modelSel.value ? modelSel.selectedOptions[0].textContent.trim() : "";
      const lines = [
        "*Solicitação de proposta — CM SOLUTION*",
        "",
        `*Nome:* ${v("name")}`,
        v("company") ? `*Empresa/cidade:* ${v("company")}` : null,
        `*WhatsApp:* ${v("phone")}`,
        `*Interesse:* ${v("interest")}`,
        machineType ? `*Tipo de máquina:* ${machineType}` : null,
        machineModel ? `*Modelo:* ${machineModel}` : null,
        v("details") ? `*Detalhes:* ${v("details")}` : null,
        "",
        "_Enviado pelo site da CM SOLUTION_"
      ].filter((l) => l !== null);

      openWhatsApp(lines.join("\n"));
    });

    form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("is-invalid"));
  }

  /* ---------- FAQ ---------- */
  function initFaq() {
    $("#faqList").addEventListener("click", (e) => {
      const btn = e.target.closest(".faq__q");
      if (!btn) return;
      const item = btn.closest(".faq__item");
      const willOpen = !item.classList.contains("is-open");
      $$(".faq__item.is-open").forEach((i) => {
        i.classList.remove("is-open");
        $(".faq__q", i).setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  }

  /* ---------- Cabeçalho, menu e scroll ---------- */
  const header = () => $("#header");
  function closeMenu() {
    header().classList.remove("is-menu-open");
    document.body.classList.remove("is-locked");
    $("#burger").setAttribute("aria-expanded", "false");
    $("#burger").setAttribute("aria-label", "Abrir menu");
  }

  function initNav() {
    const burger = $("#burger");
    burger.addEventListener("click", () => {
      // o menu abre logo abaixo do cabeçalho, esteja a página no topo ou rolada
      header().style.setProperty("--nav-top", header().getBoundingClientRect().bottom + "px");
      const open = header().classList.toggle("is-menu-open");
      document.body.classList.toggle("is-locked", open);
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    $$(".nav a").forEach((a) => a.addEventListener("click", closeMenu));
    window.matchMedia("(min-width: 961px)").addEventListener("change", closeMenu);

    // link ativo conforme a seção visível
    const links = new Map($$(".nav__link").map((a) => [a.getAttribute("href").slice(1), a]));
    const sections = Array.from(links.keys()).map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.remove("is-active"));
        links.get(en.target.id)?.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));

    const toTop = $("#toTop");
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    const onScroll = () => {
      header().classList.toggle("is-scrolled", window.scrollY > 40);
      toTop.classList.toggle("is-visible", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Animação de entrada ---------- */
  function initReveal() {
    const targets = $$(".section-head, .facts__grid, .line, .service, .step, .sim > *, .about > *, .contact > *, .faq__item, .showcase");
    targets.forEach((el) => el.classList.add("reveal"));
    if (!("IntersectionObserver" in window)) return targets.forEach((el) => el.classList.add("is-in"));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- Início ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    $("#year").textContent = new Date().getFullYear();
    initCatalog();
    initModal();
    initActions();
    initSimulator();
    initForm();
    initMachineFields();
    initFaq();
    initNav();
    initReveal();
  });
})();
