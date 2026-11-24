/**
 * CM SOLUTION — gerador das páginas de SEO
 *
 * Lê o catálogo em assets/js/data.js e gera:
 *   - maquinas/<slug>.html   uma página própria para cada máquina
 *   - sitemap.xml            lista de todas as páginas (para o Google)
 *   - robots.txt             libera os buscadores e aponta o sitemap
 *   - blocos marcados em index.html: canonical, Open Graph, dados estruturados
 *     (<!-- SEO:START --> … <!-- SEO:END -->) e links dos modelos
 *     (<!-- MODELOS:START --> … <!-- MODELOS:END -->)
 *
 * Uso (precisa do Node 18+, nenhuma dependência):
 *   node build.mjs
 *
 * Quando o site ganhar domínio próprio, troque o endereço e rode de novo:
 *   SITE_URL=https://www.cmsolution.com.br node build.mjs
 * (ou mude o valor padrão em DEFAULT_SITE_URL abaixo)
 *
 * Rode este comando sempre que alterar assets/js/data.js, antes de publicar.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SITE_URL = "https://cam-2-iota.vercel.app";
const SITE = (process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

const BRAND = {
  name: "CM SOLUTION",
  phone: "+55 11 95844-6116",
  phoneHref: "+5511958446116",
  phoneLabel: "+55 (11) 95844-6116",
  whatsapp: "5511943619085",
  whatsappLabel: "(11) 94361-9085",
  email: "prof.carllosmelo@gmail.com",
  ogImage: "/assets/img/brand/og-image.jpg",
  logo: "/assets/img/brand/logo-cm.png",
};

/* ---------- dados ---------- */
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js/data.js"), "utf8"), sandbox);
const { MACHINES, CATEGORIES, MACHINE_TYPES } = sandbox.window;

const slugs = new Set();
for (const m of MACHINES) {
  if (!m.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(m.slug)) throw new Error(`Modelo "${m.id}" sem slug válido em data.js`);
  if (slugs.has(m.slug)) throw new Error(`Slug repetido: ${m.slug}`);
  slugs.add(m.slug);
  if (!fs.existsSync(path.join(ROOT, m.image))) throw new Error(`Imagem não encontrada: ${m.image}`);
}

/* ---------- utilitários ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => SITE + (p.startsWith("/") ? p : "/" + p);
const pageUrl = (m) => `${abs("/maquinas/" + m.slug)}`;
const pagePath = (m) => `/maquinas/${m.slug}`;
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const waLink = (text) => `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
const jsonLd = (obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n  </script>`;
const trim = (s, max) => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
};
const write = (rel, content) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
};

const typeLabel = (m) => MACHINE_TYPES[m.type] || CATEGORIES[m.category];

/* ---------- peças de HTML compartilhadas ---------- */
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
    <defs>
      <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>
      <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></symbol>
      <symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></symbol>
      <symbol id="i-arrow-right" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></symbol>
      <symbol id="i-arrow-left" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></symbol>
      <symbol id="i-arrow-up-right" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></symbol>
      <symbol id="i-chevron-down" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></symbol>
    </defs>
  </svg>`;

const icon = (id, cls = "") => `<svg class="icon${cls ? " " + cls : ""}"><use href="#i-${id}"/></svg>`;

function head({ title, description, canonical, ogImage, ogImageAlt, schema }) {
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#102A35">
  <link rel="canonical" href="${esc(canonical)}">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="${BRAND.name}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(ogImageAlt)}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" type="image/png" sizes="64x64" href="/assets/img/brand/favicon-64.png">
  <link rel="apple-touch-icon" href="/assets/img/brand/favicon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/machine.css">

  ${jsonLd(schema)}
</head>`;
}

const brandLink = (label) => `<a href="/" class="brand" aria-label="${label}">
          <img src="/assets/img/brand/logo-cm.png" alt="" class="brand__mark" width="42" height="49">
          <span class="brand__text">
            <span class="brand__name"><b>CM</b> SOLUTION</span>
            <span class="brand__sub">Soluções CNC</span>
          </span>
        </a>`;

const footer = () => `<footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        ${brandLink("CM SOLUTION — página inicial")}
        <p>Máquinas CNC, consultoria de processos, programação e capacitação técnica para a indústria metalmecânica brasileira.</p>
      </div>

      <nav class="footer__col" aria-label="Equipamentos">
        <h4>Equipamentos</h4>
        <a href="/#maquinas">Centros de usinagem</a>
        <a href="/#maquinas">Tornos CNC</a>
        <a href="/#maquinas">Tornos convencionais</a>
        <a href="/#maquinas">5 eixos e portal</a>
      </nav>

      <nav class="footer__col" aria-label="Serviços">
        <h4>Serviços</h4>
        <a href="/#servicos">Consultoria de processos</a>
        <a href="/#servicos">Programação CNC</a>
        <a href="/#servicos">Treinamentos</a>
        <a href="/#faq">Dúvidas frequentes</a>
      </nav>

      <div class="footer__col">
        <h4>Contato</h4>
        <a href="tel:${BRAND.phoneHref}">${BRAND.phoneLabel}</a>
        <a href="https://wa.me/${BRAND.whatsapp}" target="_blank" rel="noopener">WhatsApp ${BRAND.whatsappLabel}</a>
        <a href="mailto:${BRAND.email}">${BRAND.email}</a>
        <span>Prof. Carlos Melo</span>
      </div>
    </div>

    <div class="container footer__bottom">
      <p>© ${new Date().getFullYear()} CM SOLUTION. Todos os direitos reservados.</p>
      <p>Marcas e modelos citados pertencem aos seus respectivos fabricantes.</p>
    </div>
  </footer>`;

/* ---------- página de uma máquina ---------- */
function relatedOf(m) {
  const others = MACHINES.filter((x) => x.id !== m.id);
  const score = (x) => (x.category === m.category ? 0 : x.type === m.type ? 1 : 2);
  return others.map((x, i) => ({ x, i })).sort((a, b) => score(a.x) - score(b.x) || a.i - b.i).slice(0, 3).map((o) => o.x);
}

function machinePage(m) {
  const url = pageUrl(m);
  const type = typeLabel(m);
  const app = m.specs["Aplicação"];
  const cnc = m.specs["Comando CNC"];
  const quoteMsg = `Olá! Vim pelo site da CM SOLUTION e gostaria de uma cotação do ${m.name}.`;

  const title = `${m.name}: ficha técnica e cotação | ${BRAND.name}`;
  const description = trim(`${m.name}: ${m.tagline} ${m.highlights.join(", ")}. Ficha técnica completa e cotação com a ${BRAND.name}.`, 158);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url + "#pagina",
        url,
        name: title,
        description,
        inLanguage: "pt-BR",
        isPartOf: { "@id": abs("/") + "#site" },
        primaryImageOfPage: { "@type": "ImageObject", url: abs(m.image), caption: m.name },
        breadcrumb: { "@id": url + "#migalhas" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": url + "#migalhas",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: abs("/") },
          { "@type": "ListItem", position: 2, name: "Máquinas", item: abs("/#maquinas") },
          { "@type": "ListItem", position: 3, name: m.name, item: url },
        ],
      },
    ],
  };

  const faq = [
    [`Qual o preço do ${m.name}?`,
      `O valor depende do comando CNC, dos acessórios e das condições comerciais escolhidas. Peça a cotação pelo WhatsApp e enviamos a proposta para a configuração que você precisa.`],
    cnc && [`Quais comandos CNC estão disponíveis no ${m.name}?`,
      `${cnc}. Ajudamos a escolher o comando mais adequado à sua aplicação e à equipe que vai operar a máquina.`],
    [`Como saber se o ${m.name} serve para a minha peça?`,
      `Envie o tamanho e o peso da peça, o material e as tolerâncias. Analisamos o seu portfólio e indicamos se este é o modelo ideal ou se outro do catálogo atende melhor.`],
    [`Existe financiamento para o ${m.name}?`,
      `Auxiliamos no direcionamento para linhas como Finame, Cartão BNDES e leasing, conforme as condições vigentes.`],
    [`A CM SOLUTION faz a instalação e o treinamento?`,
      `Sim. Orientamos a infraestrutura civil e elétrica, acompanhamos o nivelamento e fazemos a entrega técnica presencial, usinando a primeira peça de validação. Também oferecemos treinamento de operação e programação para a sua equipe.`],
  ].filter(Boolean);

  const related = relatedOf(m).map((r) => `
        <article class="mc">
          <a class="mc__media" href="${pagePath(r)}" aria-label="Ver ${esc(r.name)}">
            <span class="mc__badge">${esc(r.badge)}</span>
            <img src="/${r.image}" alt="${esc(r.name)}" loading="lazy" width="900" height="900">
          </a>
          <div class="mc__body">
            <p class="mc__cat">${esc(CATEGORIES[r.category])}</p>
            <h3 class="mc__name"><a href="${pagePath(r)}">${esc(r.name)}</a></h3>
            <p class="mc__tag">${esc(r.tagline)}</p>
            <ul class="mc__chips">${r.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
            <div class="mc__actions">
              <a class="btn btn--outline btn--sm" href="${pagePath(r)}">Ver ficha técnica</a>
            </div>
          </div>
        </article>`).join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
${head({ title, description, canonical: url, ogImage: abs(BRAND.ogImage), ogImageAlt: `${m.name} — ${BRAND.name}`, schema })}
<body>

  ${SPRITE}

  <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>

  <div class="topbar">
    <div class="container topbar__inner">
      <p class="topbar__tag">${icon("pin")} Atendimento em todo o Brasil</p>
      <div class="topbar__links">
        <a href="tel:${BRAND.phoneHref}">${icon("phone")} (11) 95844-6116</a>
        <a href="https://wa.me/${BRAND.whatsapp}" target="_blank" rel="noopener">${icon("chat")} ${BRAND.whatsappLabel}</a>
        <a href="mailto:${BRAND.email}" class="topbar__mail">${icon("mail")} ${BRAND.email}</a>
      </div>
    </div>
  </div>

  <header class="header is-scrolled">
    <div class="container header__inner">
      ${brandLink("CM SOLUTION — página inicial")}
      <div class="mp-header__actions">
        <a href="/#maquinas" class="mp-header__back">${icon("arrow-left")} Todas as máquinas</a>
        <a href="${waLink(quoteMsg)}" target="_blank" rel="noopener" class="btn btn--primary btn--sm">Solicitar cotação</a>
      </div>
    </div>
  </header>

  <main id="conteudo">

    <section class="mp-hero">
      <div class="container">
        <nav class="crumbs" aria-label="Você está em">
          <ol>
            <li><a href="/">Início</a></li>
            <li><a href="/#maquinas">Máquinas</a></li>
            <li aria-current="page">${esc(m.name)}</li>
          </ol>
        </nav>

        <div class="mp-hero__grid">
          <div class="mp-hero__media">
            <span class="mc__badge">${esc(m.badge)}</span>
            <img src="/${m.image}" alt="${esc(m.name)}" width="900" height="900" fetchpriority="high">
          </div>

          <div class="mp-hero__info">
            <p class="eyebrow">${esc(type)}</p>
            <h1 class="mp-title">${esc(m.name)}</h1>
            <p class="mp-lead">${esc(m.tagline)}</p>
            <ul class="mc__chips mp-chips">${m.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>

            <div class="mp-actions">
              <a href="${waLink(quoteMsg)}" target="_blank" rel="noopener" class="btn btn--primary btn--lg">${icon("chat")} Solicitar cotação</a>
              <a href="tel:${BRAND.phoneHref}" class="btn btn--ghost btn--lg">${icon("phone")} Ligar agora</a>
            </div>
            <p class="mp-note">Resposta direta com o especialista, pelo WhatsApp ou telefone. Atendimento em todo o Brasil.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--light mp-section">
      <div class="container mp-cols">
        <div class="mp-specs">
          <h2 class="mp-h2">Ficha técnica do ${esc(m.name)}</h2>
          <table class="specs mp-table">
            <caption class="sr-only">Especificações técnicas do ${esc(m.name)}</caption>
            <tbody>
              ${Object.entries(m.specs).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("\n              ")}
            </tbody>
          </table>
          <p class="mp-note">Configurações de comando, cone e acessórios podem ser especificadas sob consulta.</p>
        </div>

        <div class="mp-about">
          <h2 class="mp-h2">Sobre o ${esc(m.name)}</h2>
          <p>O <strong>${esc(m.name)}</strong> é um ${esc(lowerFirst(type))} fornecido pela ${BRAND.name}. ${esc(m.tagline)}</p>
          <p><strong>Principais características:</strong> ${esc(m.highlights.join(" · "))}.</p>
          ${app ? `<p><strong>Aplicações indicadas:</strong> ${esc(lowerFirst(app))}.</p>` : ""}
          ${cnc ? `<p><strong>Comandos CNC disponíveis:</strong> ${esc(cnc)}.</p>` : ""}
          <p>Antes de fechar o pedido, a ${BRAND.name} ajuda a dimensionar o modelo para as suas peças, materiais e tolerâncias, e acompanha a entrega técnica, a programação e o treinamento da equipe, para que a máquina produza bem desde o primeiro dia.</p>
          <ul class="ticks mp-ticks">
            <li>Dimensionamento por aplicação, com o Prof. Carlos Melo</li>
            <li>Apoio com Finame, BNDES e financiamentos</li>
            <li>Entrega técnica, programação e treinamento in-company</li>
          </ul>
          <a href="${waLink(quoteMsg)}" target="_blank" rel="noopener" class="btn btn--whatsapp btn--lg">${icon("chat")} Pedir cotação pelo WhatsApp</a>
        </div>
      </div>
    </section>

    <section class="section section--white mp-section">
      <div class="container container--narrow">
        <h2 class="mp-h2">Dúvidas sobre o ${esc(m.name)}</h2>
        <div class="mp-faq">
          ${faq.map(([q, a]) => `<details>
            <summary><span>${esc(q)}</span>${icon("chevron-down")}</summary>
            <p>${esc(a)}</p>
          </details>`).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section section--light mp-section">
      <div class="container">
        <h2 class="mp-h2">Outras máquinas do catálogo</h2>
        <div class="mp-related">${related}
        </div>
        <p class="mp-all"><a class="link-btn" href="/#maquinas">Ver o catálogo completo ${icon("arrow-right")}</a></p>
      </div>
    </section>
  </main>

  ${footer()}

  <a href="${waLink(quoteMsg)}" target="_blank" rel="noopener" class="fab fab--wa" aria-label="Falar no WhatsApp sobre o ${esc(m.name)}">
    ${icon("chat", "icon--xl")}
  </a>
</body>
</html>
`;
}

/* ---------- blocos injetados no index.html ---------- */
function seoBlock() {
  const home = abs("/");
  const title = "CM SOLUTION | Máquinas CNC, Centros de Usinagem e Consultoria";
  const description = "CM SOLUTION: tornos CNC, centros de usinagem e tornos mecânicos, com consultoria de processos, programação CNC e treinamento de equipes. Atendimento em todo o Brasil.";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": home + "#empresa",
        name: BRAND.name,
        url: home,
        logo: abs(BRAND.logo),
        image: abs(BRAND.ogImage),
        description: "Máquinas CNC, consultoria de processos e treinamento em usinagem.",
        email: BRAND.email,
        telephone: BRAND.phone,
        areaServed: "BR",
        founder: { "@type": "Person", name: "Carlos Melo", jobTitle: "Professor e consultor de usinagem" },
        contactPoint: [{
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: BRAND.phone,
          email: BRAND.email,
          areaServed: "BR",
          availableLanguage: "pt-BR",
        }],
      },
      {
        "@type": "WebSite",
        "@id": home + "#site",
        url: home,
        name: BRAND.name,
        inLanguage: "pt-BR",
        publisher: { "@id": home + "#empresa" },
      },
    ],
  };
  return `<link rel="canonical" href="${home}">
  <meta name="robots" content="index, follow, max-image-preview:large">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="${BRAND.name}">
  <meta property="og:url" content="${home}">
  <meta property="og:title" content="CM SOLUTION | Máquinas CNC e engenharia de usinagem">
  <meta property="og:description" content="Tornos CNC, centros de usinagem, consultoria de processos e treinamento para a sua fábrica.">
  <meta property="og:image" content="${abs(BRAND.ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="CM SOLUTION — máquinas CNC e centros de usinagem">
  <meta name="twitter:card" content="summary_large_image">

  ${jsonLd(schema)}`;
}

function modelLinksBlock() {
  return `<nav class="model-links" aria-label="Página de cada modelo">
          <h3>Página de cada modelo</h3>
          <ul>
            ${MACHINES.map((m) => `<li><a href="${pagePath(m)}">${esc(m.name)}</a></li>`).join("\n            ")}
          </ul>
        </nav>`;
}

function inject(html, name, content) {
  const re = new RegExp(`(<!-- ${name}:START -->)[\\s\\S]*?(<!-- ${name}:END -->)`);
  if (!re.test(html)) throw new Error(`index.html: marcador ${name} não encontrado`);
  const eol = html.includes("\r\n") ? "\r\n" : "\n";
  const body = content.replace(/\r?\n/g, eol);
  return html.replace(re, (_, a, b) => `${a}${eol}  ${body}${eol}  ${b}`);
}

/* ---------- execução ---------- */
const outDir = path.join(ROOT, "maquinas");
fs.rmSync(outDir, { recursive: true, force: true });
for (const m of MACHINES) write(`maquinas/${m.slug}.html`, machinePage(m));

const indexFile = path.join(ROOT, "index.html");
let index = fs.readFileSync(indexFile, "utf8");
index = inject(index, "SEO", seoBlock());
index = inject(index, "MODELOS", modelLinksBlock());
fs.writeFileSync(indexFile, index, "utf8");

const urls = [
  `  <url>\n    <loc>${abs("/")}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
  ...MACHINES.map((m) =>
    `  <url>\n    <loc>${pageUrl(m)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n` +
    `    <image:image>\n      <image:loc>${abs(m.image)}</image:loc>\n      <image:title>${esc(m.name)}</image:title>\n    </image:image>\n  </url>`),
];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>
`);

write("robots.txt", `User-agent: *
Allow: /

Sitemap: ${abs("/sitemap.xml")}
`);

console.log(`Site: ${SITE}`);
console.log(`Geradas ${MACHINES.length} páginas em maquinas/, sitemap.xml, robots.txt e blocos do index.html.`);
