# CM SOLUTION — site

Site estático (HTML, CSS e JS), publicado na Vercel. Para ver no computador, abra `index.html` no navegador.
As páginas de cada máquina usam endereços limpos (`/maquinas/<modelo>`), então para testá-las localmente use um servidor, por exemplo `npx serve`.

## Estrutura

```
index.html                  página inicial (todas as seções)
maquinas/                   uma página por máquina (GERADAS por build.mjs — não edite à mão)
sitemap.xml, robots.txt     GERADOS por build.mjs (SEO)
build.mjs                   gerador das páginas de máquina, sitemap e robots
vercel.json                 endereços sem .html
assets/
  css/style.css             estilos (cores do logotipo em :root, no topo)
  js/data.js                CATÁLOGO de máquinas — edite aqui para incluir/alterar modelos
  js/main.js                filtros, ficha técnica, simulador, formulário, menu
  img/
    brand/                  logotipo, favicon, imagem de contato, imagem de compartilhamento
    machines/               fotos das máquinas (fundo branco, WebP)
    services/               fotos de apoio (serviços e linhas de equipamentos)
_backup_site_antigo/        versão anterior completa (pode apagar quando quiser)
```

## SEO: como atualizar

Depois de **qualquer mudança em `assets/js/data.js`** (nova máquina, texto, ficha técnica), rode na pasta do projeto:

```
node build.mjs
```

e publique também a pasta `maquinas/`, o `sitemap.xml` e o `index.html`. Cada modelo precisa de um `slug` único em `data.js` (é o endereço da página).

**Quando o site tiver domínio próprio**, troque o endereço (em `DEFAULT_SITE_URL` no topo de `build.mjs`, ou assim) e rode de novo:

```
$env:SITE_URL="https://www.seudominio.com.br"; node build.mjs
```
(no PowerShell; em outros terminais: `SITE_URL=https://www.seudominio.com.br node build.mjs`)

Isso atualiza canonical, og:image, sitemap e robots.txt de uma vez.

## Como editar

- **Telefone / WhatsApp / e-mail:** `index.html` (buscar pelo número) e `WHATSAPP_NUMBER` em `assets/js/data.js`.
- **Nova máquina:** copie um bloco em `assets/js/data.js`, ajuste os campos (inclusive `slug`) e coloque a foto em `assets/img/machines/`
  (de preferência quadrada, fundo branco, WebP/JPG ~900 px).
  O campo `type` (ex.: `torno-cnc`, `cu-3`, `cu-5`) define em qual "Tipo de máquina" o modelo aparece no formulário de proposta;
  os tipos ficam em `MACHINE_TYPES` no mesmo arquivo.
- **Cores:** variáveis `--orange-*`, `--teal-*` e `--ink-*` no início de `assets/css/style.css`.
