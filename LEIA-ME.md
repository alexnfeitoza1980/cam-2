# CM SOLUTION — site

Abra `index.html` no navegador (não precisa instalar nada).

## Estrutura

```
index.html                  página única (todas as seções)
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

## Como editar

- **Telefone / WhatsApp / e-mail:** `index.html` (buscar pelo número) e `WHATSAPP_NUMBER` em `assets/js/data.js`.
- **Nova máquina:** copie um bloco em `assets/js/data.js`, ajuste os campos e coloque a foto em `assets/img/machines/`
  (de preferência quadrada, fundo branco, WebP/JPG ~900 px).
  O campo `type` (ex.: `torno-cnc`, `cu-3`, `cu-5`) define em qual "Tipo de máquina" o modelo aparece no formulário de proposta;
  os tipos ficam em `MACHINE_TYPES` no mesmo arquivo.
- **Cores:** variáveis `--orange-*`, `--teal-*` e `--ink-*` no início de `assets/css/style.css`.
