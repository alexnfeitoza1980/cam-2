/**
 * CM SOLUTION — catálogo de máquinas
 * Para incluir/alterar um modelo, edite apenas este arquivo.
 * As fotos ficam em assets/img/machines/ (fundo branco, formato WebP).
 */

window.WHATSAPP_NUMBER = "5511943619085";

window.CATEGORIES = {
  "centros": "Centro de usinagem vertical",
  "tornos-cnc": "Torno CNC",
  "tornos-conv": "Torno convencional",
  "5eixos-portal": "5 eixos e portal"
};

window.MACHINES = [
  {
    id: "vmx1020",
    name: "Centro de Usinagem VMX 1020",
    category: "centros",
    badge: "Mais procurado",
    image: "assets/img/machines/vmx1020.webp",
    tagline: "Alta rigidez e estabilidade térmica para grande remoção de cavaco com precisão geométrica.",
    highlights: ["Mesa 1.150 × 560 mm", "10.000 RPM", "24 ferramentas"],
    specs: {
      "Estrutura": "Vertical, coluna em C robusta",
      "Dimensões da mesa": "1.150 × 560 mm",
      "Curso X / Y / Z": "1.020 / 560 / 560 mm",
      "Carga máxima na mesa": "800 kg",
      "Cone": "BT40",
      "Rotação do spindle": "10.000 RPM (acoplamento direto)",
      "Magazine": "24 ferramentas, braço duplo",
      "Comando CNC": "Fanuc 0i-MF Plus / Siemens",
      "Aplicação": "Ferramentarias, matrizarias e produção seriada"
    }
  },
  {
    id: "vux400",
    name: "Centro de Usinagem 5 Eixos VUX 400",
    category: "5eixos-portal",
    badge: "5 eixos simultâneos",
    image: "assets/img/machines/vux400.webp",
    tagline: "Precisão e versatilidade para peças complexas, moldes, matrizes e setor aeroespacial.",
    highlights: ["5 eixos", "Mesa Ø 400 mm", "12.000 RPM"],
    specs: {
      "Estrutura": "Centro de usinagem vertical 5 eixos",
      "Diâmetro da mesa": "Ø 400 mm",
      "Curso X / Y / Z": "400 / 400 / 400 mm",
      "Eixo A / rotação C": "-120° a +30° / 360° contínuo",
      "Rotação do spindle": "12.000 a 15.000 RPM direct drive",
      "Cone": "BT40 / BBT40",
      "Avanço rápido": "36 / 36 / 36 m/min",
      "Comando CNC": "Heidenhain / Siemens 840D / Fanuc",
      "Aplicação": "Aeroespacial, moldes de precisão, implantes médicos"
    }
  },
  {
    id: "ftc350",
    name: "Torno CNC Barramento Inclinado FTC-350",
    category: "tornos-cnc",
    badge: "Alta produtividade",
    image: "assets/img/machines/ftc350.webp",
    tagline: "Barramento inclinado monobloco com torre servoacionada de indexação rápida.",
    highlights: ["Inclinado 30°", "Placa 8\"", "Torre 12 posições"],
    specs: {
      "Barramento": "Inclinado 30° monobloco",
      "Diâmetro máximo torneável": "Ø 350 mm",
      "Comprimento máximo": "550 mm",
      "Passagem de barra": "Ø 65 mm",
      "Placa": "8\" hidráulica",
      "Torre de ferramentas": "12 posições servoacionada",
      "Rotação do spindle": "4.500 RPM",
      "Comando CNC": "Fanuc 0i-TF / Mitsubishi / Syntec",
      "Aplicação": "Torneamento seriado de alta produção"
    }
  },
  {
    id: "fl400",
    name: "Torno CNC Barramento Paralelo FL-400",
    category: "tornos-cnc",
    badge: "Versátil",
    image: "assets/img/machines/fl400.webp",
    tagline: "Barramento paralelo com fusos de esferas e comando numérico moderno.",
    highlights: ["Ø 400 mm", "1.000 / 1.500 mm", "Torre 4–6 pos."],
    specs: {
      "Barramento": "Paralelo, temperado e retificado",
      "Diâmetro sobre o barramento": "Ø 400 mm",
      "Distância entre pontas": "1.000 / 1.500 mm",
      "Furo da árvore": "Ø 52 mm (Ø 82 mm opcional)",
      "Nariz da árvore": "A2-6",
      "Faixa de rotação": "35 a 2.500 RPM",
      "Torre de ferramentas": "4 ou 6 posições, elétrica",
      "Comando CNC": "Mitsubishi / Fanuc / Siemens",
      "Aplicação": "Manutenção, eixos longos e lotes pequenos e médios"
    }
  },
  {
    id: "ftl500",
    name: "Torno CNC Pesado FTL-500",
    category: "tornos-cnc",
    badge: "Torneamento pesado",
    image: "assets/img/machines/ftl500.webp",
    tagline: "Construção ultrarrígida para grandes eixos, flanges, tubos e cilindros industriais.",
    highlights: ["Ø 500 mm", "Até 2.000 mm", "Furo Ø 105 mm"],
    specs: {
      "Barramento": "Paralelo extralargo, 400 mm",
      "Diâmetro sobre o barramento": "Ø 500 mm",
      "Diâmetro sobre o carro": "Ø 290 mm",
      "Distância entre pontas": "1.500 a 2.000 mm",
      "Furo da árvore": "Ø 82 a Ø 105 mm",
      "Motor principal": "11 kW / 15 HP servomotor",
      "Comando CNC": "Fanuc 0i-TF / Siemens",
      "Aplicação": "Óleo e gás, mineração, cilindros hidráulicos"
    }
  },
  {
    id: "stl8ii",
    name: "Torno CNC de Alta Precisão STL-8II",
    category: "tornos-cnc",
    badge: "Alta velocidade",
    image: "assets/img/machines/stl8ii.webp",
    tagline: "Centro de torneamento compacto com guias lineares de rolos e acabamento superficial refinado.",
    highlights: ["Placa 8\"", "4.500 RPM", "Guias lineares"],
    specs: {
      "Barramento": "Guias lineares de rolos",
      "Diâmetro torneável": "Ø 320 mm",
      "Comprimento útil": "480 mm",
      "Placa": "8\" hidráulica, cilindro passante",
      "Passagem de barra": "Ø 52 mm",
      "Torre de ferramentas": "12 posições BMT ou VDI",
      "Avanço rápido": "30 m/min em X e Z",
      "Comando CNC": "Fanuc 0i-TF Plus",
      "Aplicação": "Autopeças, válvulas e conexões hidráulicas"
    }
  },
  {
    id: "tc20a",
    name: "Centro de Furação e Rosqueamento TC20A",
    category: "centros",
    badge: "Alta dinâmica",
    image: "assets/img/machines/tc20a.webp",
    tagline: "Usinagem ultrarrápida de peças pequenas em alumínio, ferro fundido e ligas leves.",
    highlights: ["20.000 RPM", "Troca em 1,2 s", "Avanço 48 m/min"],
    specs: {
      "Tipo": "Tapping center de alta dinâmica",
      "Curso X / Y / Z": "500 / 400 / 300 mm",
      "Avanço rápido": "48 / 48 / 48 m/min",
      "Aceleração dos eixos": "1,2 G",
      "Rotação máxima": "20.000 RPM direct drive",
      "Troca de ferramenta": "1,2 s (cavaco a cavaco)",
      "Magazine": "16 a 21 ferramentas, tipo tambor",
      "Comando CNC": "Mitsubishi M80 / Fanuc 0i-MF",
      "Aplicação": "Eletrônicos, autopeças em alumínio, carcaças"
    }
  },
  {
    id: "svw",
    name: "Centro de Usinagem Portal SVW",
    category: "5eixos-portal",
    badge: "Linha pesada",
    image: "assets/img/machines/svw.webp",
    tagline: "Estrutura em ponte de grande rigidez para moldes automotivos e estruturas de grande porte.",
    highlights: ["X até 3.200 mm", "Mesa até 10 t", "Cone BT50"],
    specs: {
      "Configuração": "Portal / dupla coluna monobloco",
      "Curso X": "2.200 a 3.200 mm",
      "Distância entre colunas": "1.800 mm",
      "Capacidade de carga": "Até 10.000 kg",
      "Cone": "BT50, caixa de 2 estágios",
      "Potência do spindle": "22 kW / 30 HP",
      "Comando CNC": "Fanuc 31i / Heidenhain TNC 640",
      "Aplicação": "Estampos automotivos, moldes plásticos grandes"
    }
  },
  {
    id: "quazar-c6256",
    name: "Torno Mecânico Quazar C6256ZX/2000",
    category: "tornos-conv",
    badge: "Robusto",
    image: "assets/img/machines/quazar-c6256.webp",
    tagline: "Torno convencional consagrado pela durabilidade, barramento temperado e precisão de ferramentaria.",
    highlights: ["2.000 mm entre pontas", "Ø 560 mm", "24 velocidades"],
    specs: {
      "Acionamento": "Mecânico, caixa Norton completa",
      "Distância entre pontas": "2.000 mm",
      "Diâmetro sobre o barramento": "Ø 560 mm",
      "Diâmetro na cava": "Ø 785 mm",
      "Passagem da árvore": "Ø 80 / Ø 105 mm",
      "Velocidades": "24 (9 a 1.600 RPM)",
      "Motor": "7,5 kW / 10 HP",
      "Acessórios": "Placa 3 castanhas, lunetas fixa e móvel, luz LED",
      "Aplicação": "Ferramentaria, usinagem geral e manutenção"
    }
  },
  {
    id: "quazar-c6240",
    name: "Torno Mecânico Quazar C6240ZK/1000",
    category: "tornos-conv",
    badge: "Oficina",
    image: "assets/img/machines/quazar-c6240.webp",
    tagline: "Ideal para manutenção, escolas técnicas e peças unitárias, com operação suave e confiável.",
    highlights: ["1.000 mm entre pontas", "Ø 400 mm", "Passagem Ø 52 mm"],
    specs: {
      "Equipamento": "Torno universal convencional",
      "Distância entre pontas": "1.000 mm",
      "Diâmetro sobre o barramento": "Ø 400 mm",
      "Diâmetro na cava": "Ø 630 mm",
      "Passagem da árvore": "Ø 52 mm",
      "Motor": "4 kW / 5,5 HP",
      "Acessórios": "Refrigeração, freio de pé, proteção do mandril",
      "Aplicação": "Reparos industriais, usinagem rápida e ferramentaria leve"
    }
  }
];
