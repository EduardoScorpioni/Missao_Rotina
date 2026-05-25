window.DEBUGUINHO_PHASES = [
  {
    "id": 1,
    "icon": "🌅",
    "title": "Começar o Dia",
    "bg": "linear-gradient(135deg,#84E6F8,#3EC8E8)",
    "pbColor": "#0AACCC",
    "difficulty": "Muito Fácil",
    "desc": "Organize as rotinas para começar o dia",
    "subphases": [
      {
        "id": 1,
        "title": "Acordar",
        "desc": "Coloque em ordem os passos para acordar",
        "mission": "Hora de acordar! Organize os passos na ordem correta.",
        "blocks": [
          {
            "id": "olhos",
            "name": "Abrir os olhos",
            "icon": "👀",
            "img": "fase-1/sub-fase-1/acordar.png"
          },
          {
            "id": "sentar",
            "name": "Sentar na cama",
            "icon": "🛏️",
            "img": "fase-1/sub-fase-1/sentar_na_cama.png"
          },
          {
            "id": "levantar",
            "name": "Levantar",
            "icon": "🚶",
            "img": "fase-1/sub-fase-1/levantar.png"
          },
          {
            "id": "chinelo",
            "name": "Calçar chinelo",
            "icon": "🩴",
            "img": "fase-1/sub-fase-1/calçar_o_sapato.png"
          }
        ],
        "sequence": [
          "olhos",
          "sentar",
          "levantar",
          "chinelo"
        ]
      },
      {
        "id": 2,
        "title": "Higiene da manhã",
        "desc": "Organize os passos da higiene da manhã",
        "mission": "Vamos cuidar da higiene! Coloque tudo na ordem correta.",
        "blocks": [
          {
            "id": "banheiro",
            "name": "Ir ao banheiro",
            "icon": "🚪",
            "img": "fase-1/sub-fase-2/ir_banheiro.png"
          },
          {
            "id": "escova",
            "name": "Pegar a escova",
            "icon": "🪥",
            "img": "fase-1/sub-fase-2/pegar_escova.png"
          },
          {
            "id": "pasta",
            "name": "Colocar pasta",
            "icon": "🧴",
            "img": "fase-1/sub-fase-2/colocar_pasta.png"
          },
          {
            "id": "dentes",
            "name": "Escovar os dentes",
            "icon": "😁",
            "img": "fase-1/sub-fase-2/escovar_dentes.png"
          },
          {
            "id": "rosto",
            "name": "Lavar o rosto",
            "icon": "🧼",
            "img": "fase-1/sub-fase-2/lavar_rosto.png"
          }
        ],
        "sequence": [
          "banheiro",
          "escova",
          "pasta",
          "dentes",
          "rosto"
        ]
      },
      {
        "id": 3,
        "title": "Vestir-se",
        "desc": "Organize os passos para se vestir",
        "mission": "Hora de se vestir! Coloque as ações na ordem certa.",
        "blocks": [
          {
            "id": "roupa",
            "name": "Escolher roupa",
            "icon": "👕",
            "img": "fase-1/sub-fase-3/escolher_roupa.png"
          },
          {
            "id": "camiseta",
            "name": "Vestir camiseta",
            "icon": "👚",
            "img": "fase-1/sub-fase-3/vestir_blusa.png"
          },
          {
            "id": "calca",
            "name": "Vestir calça",
            "icon": "👖",
            "img": "fase-1/sub-fase-3/vestir_calça.png"
          },
          {
            "id": "sapato",
            "name": "Calçar sapato",
            "icon": "👟",
            "img": "fase-1/sub-fase-3/calçar_sapatos.png"
          }
        ],
        "sequence": [
          "roupa",
          "camiseta",
          "calca",
          "sapato"
        ]
      },
      {
        "id": 4,
        "title": "Sair para escola",
        "desc": "Organize os passos para sair para a escola",
        "mission": "Vamos para a escola! Organize os passos corretamente.",
        "blocks": [
          {
            "id": "mochila",
            "name": "Pegar mochila",
            "icon": "🎒",
            "img": "fase-1/sub-fase-4/pegar_mochila.png"
          },
          {
            "id": "material",
            "name": "Conferir material",
            "icon": "📚",
            "img": "fase-1/sub-fase-4/arrumar_mochila.png"
          },
          {
            "id": "cafe",
            "name": "Tomar café",
            "icon": "☕",
            "img": "fase-1/sub-fase-4/tomar_cafe.png"
          },
          {
            "id": "porta",
            "name": "Ir para a porta",
            "icon": "🚪",
            "img": "fase-1/sub-fase-4/sair_de_casa.png"
          },
          {
            "id": "escola",
            "name": "Ir para escola",
            "icon": "🏫",
            "img": "fase-1/sub-fase-4/ir_pra_escola.png"
          }
        ],
        "sequence": [
          "mochila",
          "material",
          "cafe",
          "porta",
          "escola"
        ]
      }
    ]
  },
  {
    "id": 2,
    "icon": "📚",
    "title": "Tarefa de Casa",
    "bg": "linear-gradient(135deg,#B0E3AC,#5BB751)",
    "pbColor": "#3A8C32",
    "difficulty": "Fácil",
    "desc": "Organize as etapas da tarefa de casa",
    "subphases": [
      {
        "id": 1,
        "title": "Preparar ambiente",
        "desc": "Prepare o local para estudar",
        "mission": "Antes da tarefa, organize o ambiente de estudo.",
        "blocks": [
          {
            "id": "guardarDistracoes",
            "name": "Guardar distrações",
            "icon": "🧸",
            "img": "fase-2/sub-fase-1/recorte-1.png"
          },
          {
            "id": "cadeira",
            "name": "Sentar na cadeira",
            "icon": "🪑",
            "img": "fase-2/sub-fase-1/recorte-2.png"
          },
          {
            "id": "mesa",
            "name": "Limpar a mesa",
            "icon": "🧽",
            "img": "fase-2/sub-fase-1/recorte-3.png"
          },
          {
            "id": "lapis",
            "name": "Pegar lápis",
            "icon": "✏️",
            "img": "fase-2/sub-fase-1/recorte-4.png"
          },
          {
            "id": "caderno",
            "name": "Pegar caderno",
            "icon": "📓",
            "img": "fase-2/sub-fase-1/recorte-5.png"
          }
        ],
        "sequence": [
          "guardarDistracoes",
          "cadeira",
          "mesa",
          "lapis",
          "caderno"
        ]
      },
      {
        "id": 2,
        "title": "Começar atividade",
        "desc": "Organize o início da atividade",
        "mission": "Agora vamos começar a tarefa de casa.",
        "blocks": [
          {
            "id": "abrir",
            "name": "Abrir caderno",
            "icon": "📖",
            "img": "fase-2/sub-fase-2/abrir_caderno.png"
          },
          {
            "id": "localizar",
            "name": "Localizar atividade",
            "icon": "🔎",
            "img": "fase-2/sub-fase-2/localizar_atividade.png"
          },
          {
            "id": "ler",
            "name": "Ler enunciado",
            "icon": "👓",
            "img": "fase-2/sub-fase-2/ler_enunciado.png"
          },
          {
            "id": "pensar",
            "name": "Pensar na resposta",
            "icon": "🤔",
            "img": "fase-2/sub-fase-2/pensar_resposta.png"
          },
          {
            "id": "escrever",
            "name": "Começar a escrever",
            "icon": "✍️",
            "img": "fase-2/sub-fase-2/começar_escrever.png"
          }
        ],
        "sequence": [
          "abrir",
          "localizar",
          "ler",
          "pensar",
          "escrever"
        ]
      },
      {
        "id": 3,
        "title": "Resolver tarefa",
        "desc": "Resolva e corrija a tarefa",
        "mission": "Resolva a tarefa com atenção.",
        "blocks": [
          {
            "id": "ex1",
            "name": "Fazer exercício 1",
            "icon": "1️⃣",
            "img": "fase-2/sub-fase-3/fazer_exercicio.png"
          },
          {
            "id": "ex2",
            "name": "Fazer exercício 2",
            "icon": "2️⃣",
            "img": "fase-2/sub-fase-3/ver_exercicio.png"
          },
          {
            "id": "conferir",
            "name": "Conferir respostas",
            "icon": "🔍",
            "img": "fase-2/sub-fase-3/conferir_resposta.png"
          },
          {
            "id": "apagar",
            "name": "Apagar erro",
            "icon": "🧽",
            "img": "fase-2/sub-fase-3/apagar_resposta.png"
          },
          {
            "id": "corrigir",
            "name": "Corrigir resposta",
            "icon": "✅",
            "img": "fase-2/sub-fase-3/corrigir_resposta.png"
          }
        ],
        "sequence": [
          "ex1",
          "ex2",
          "conferir",
          "apagar",
          "corrigir"
        ]
      },
      {
        "id": 4,
        "title": "Finalizar estudo",
        "desc": "Finalize e organize os materiais",
        "mission": "Depois de estudar, organize tudo novamente.",
        "blocks": [
          {
            "id": "revisar",
            "name": "Revisar tarefa",
            "icon": "🔍",
            "img": "fase-2/sub-fase-4/recorte-1.png"
          },
          {
            "id": "fechar",
            "name": "Fechar caderno",
            "icon": "📕",
            "img": "fase-2/sub-fase-4/recorte-2.png"
          },
          {
            "id": "guardarLapis",
            "name": "Guardar lápis",
            "icon": "✏️",
            "img": "fase-2/sub-fase-4/recorte-3.png"
          },
          {
            "id": "guardarMaterial",
            "name": "Guardar material",
            "icon": "🎒",
            "img": "fase-2/sub-fase-4/recorte-4.png"
          },
          {
            "id": "limparMesa",
            "name": "Limpar mesa",
            "icon": "🧼",
            "img": "fase-2/sub-fase-4/recorte-5.png"
          }
        ],
        "sequence": [
          "revisar",
          "fechar",
          "guardarLapis",
          "guardarMaterial",
          "limparMesa"
        ]
      }
    ]
  },
  {
    "id": 3,
    "icon": "🎮",
    "title": "Hora de Brincar",
    "bg": "linear-gradient(135deg,#F29CA3,#E06070)",
    "pbColor": "#C62A2A",
    "difficulty": "Médio",
    "desc": "Organize o momento de brincar",
    "subphases": [
      {
        "id": 1,
        "title": "Escolher brincadeira",
        "desc": "Escolha uma brincadeira",
        "mission": "Vamos escolher uma brincadeira legal.",
        "blocks": [
          {
            "id": "ver",
            "name": "Ver brinquedos",
            "icon": "👀",
            "img": "fase-3/sub-fase-1/olhar_os_brinquedos.png"
          },
          {
            "id": "pensarEspaco",
            "name": "Pensar no espaço",
            "icon": "🏠",
            "img": "fase-3/sub-fase-1/esolher_onde_brincar.png"
          },
          {
            "id": "escolher",
            "name": "Escolher brinquedo",
            "icon": "🧸",
            "img": "fase-3/sub-fase-1/escolher_brinquedos.png"
          },
          {
            "id": "pegar",
            "name": "Pegar brinquedo",
            "icon": "🤲",
            "img": "fase-3/sub-fase-1/pegar_brinquedos.png"
          },
          {
            "id": "espaco",
            "name": "Preparar espaço",
            "icon": "🏠",
            "img": "fase-3/sub-fase-1/brincar.png"
          }
        ],
        "sequence": [
          "ver",
          "pensarEspaco",
          "escolher",
          "pegar",
          "espaco"
        ]
      },
      {
        "id": 2,
        "title": "Brincar sozinho",
        "desc": "Organize uma brincadeira individual",
        "mission": "Agora vamos brincar sozinho usando a imaginação.",
        "blocks": [
          {
            "id": "separarPecas",
            "name": "Separar peças",
            "icon": "🧩",
            "img": "fase-3/sub-fase-2/separar_peças.png"
          },
          {
            "id": "montar",
            "name": "Montar brinquedo",
            "icon": "🧩",
            "img": "fase-3/sub-fase-2/montar_peças.png"
          },
          {
            "id": "historia",
            "name": "Inventar história",
            "icon": "📖",
            "img": "fase-3/sub-fase-2/inventar_historia.png"
          },
          {
            "id": "brincar",
            "name": "Brincar",
            "icon": "🎮",
            "img": "fase-3/sub-fase-2/brincar.png"
          },
          {
            "id": "terminar",
            "name": "Terminar brincadeira",
            "icon": "✅",
            "img": "fase-3/sub-fase-2/parar_de_brincar.png"
          }
        ],
        "sequence": [
          "separarPecas",
          "montar",
          "historia",
          "brincar",
          "terminar"
        ]
      },
      {
        "id": 3,
        "title": "Brincar com amigos",
        "desc": "Organize a brincadeira com amigos",
        "mission": "Brincar com amigos também precisa de organização.",
        "blocks": [
          {
            "id": "chamar",
            "name": "Chamar amigo",
            "icon": "🙋",
            "img": "fase-3/sub-fase-3/chamar_amigo.png"
          },
          {
            "id": "dividir",
            "name": "Dividir brinquedo",
            "icon": "🤝",
            "img": "fase-3/sub-fase-3/divirdir_brinquedos.png"
          },
          {
            "id": "regras",
            "name": "Combinar regras",
            "icon": "📋",
            "img": "fase-3/sub-fase-3/separar_regras.png"
          },
          {
            "id": "esperarVez",
            "name": "Esperar a vez",
            "icon": "⏳",
            "img": "fase-3/sub-fase-3/esperar_vez.png"
          },
          {
            "id": "juntos",
            "name": "Brincar juntos",
            "icon": "👧👦",
            "img": "fase-3/sub-fase-3/brincar_juntos.png"
          }
        ],
        "sequence": [
          "chamar",
          "dividir",
          "regras",
          "esperarVez",
          "juntos"
        ]
      },
      {
        "id": 4,
        "title": "Guardar brinquedos",
        "desc": "Guarde os brinquedos depois de brincar",
        "mission": "Depois da brincadeira, organize os brinquedos.",
        "blocks": [
          {
            "id": "separar",
            "name": "Separar brinquedos",
            "icon": "🧸",
            "img": "fase-3/sub-fase-4/separar_brinquedos.png"
          },
          {
            "id": "procurarPerdidos",
            "name": "Procurar peças perdidas",
            "icon": "🔎",
            "img": "fase-3/sub-fase-4/procurar_peças_perdidas.png"
          },
          {
            "id": "caixa",
            "name": "Colocar na caixa",
            "icon": "📦",
            "img": "fase-3/sub-fase-4/guardar_na_caixa.png"
          },
          {
            "id": "fecharCaixa",
            "name": "Fechar caixa",
            "icon": "📫",
            "img": "fase-3/sub-fase-4/fechar_caixa.png"
          },
          {
            "id": "guardarLugar",
            "name": "Guardar no lugar",
            "icon": "📍",
            "img": "fase-3/sub-fase-4/guardar_a_caixa.png"
          }
        ],
        "sequence": [
          "separar",
          "procurarPerdidos",
          "caixa",
          "fecharCaixa",
          "guardarLugar"
        ]
      }
    ]
  },
  {
    "id": 4,
    "icon": "🥪",
    "title": "Hora do Lanche",
    "bg": "linear-gradient(135deg,#F9E784,#F0C800)",
    "pbColor": "#D4A800",
    "difficulty": "Difícil",
    "desc": "Organize o lanche da tarde",
    "subphases": [
      {
        "id": 1,
        "title": "Preparar cozinha",
        "desc": "Prepare tudo antes do lanche",
        "mission": "Vamos preparar a cozinha para fazer o lanche.",
        "blocks": [
          {
            "id": "cozinha",
            "name": "Ir à cozinha",
            "icon": "🚶",
            "img": "fase-4/sub-fase-1/ir_ate_cozinha.png"
          },
          {
            "id": "maos",
            "name": "Lavar as mãos",
            "icon": "🧼",
            "img": "fase-4/sub-fase-1/lavar_mãos.png"
          },
          {
            "id": "limparBancada",
            "name": "Limpar bancada",
            "icon": "🧽",
            "img": "fase-4/sub-fase-1/limpar_balcão.png"
          },
          {
            "id": "prato",
            "name": "Pegar prato",
            "icon": "🍽️",
            "img": "fase-4/sub-fase-1/pegar_prato.png"
          },
          {
            "id": "ingredientes",
            "name": "Separar ingredientes",
            "icon": "🥗",
            "img": "fase-4/sub-fase-1/separar_ingredientes.png"
          },
          {
            "id": "conferirIngredientes",
            "name": "Conferir ingredientes",
            "icon": "👀",
            "img": "fase-4/sub-fase-1/conferiri_ingredientes.png"
          }
        ],
        "sequence": [
          "cozinha",
          "maos",
          "limparBancada",
          "prato",
          "ingredientes",
          "conferirIngredientes"
        ]
      },
      {
        "id": 2,
        "title": "Montar sanduíche",
        "desc": "Monte o sanduíche passo a passo",
        "mission": "Agora vamos montar um sanduíche.",
        "blocks": [
          {
            "id": "pao",
            "name": "Pegar pão",
            "icon": "🍞",
            "img": "fase-4/sub-fase-2/pegar_pão.png"
          },
          {
            "id": "abrirPao",
            "name": "Abrir o pão",
            "icon": "🥖",
            "img": "fase-4/sub-fase-2/abrir_pão.png"
          },
          {
            "id": "queijo",
            "name": "Colocar queijo",
            "icon": "🧀",
            "img": "fase-4/sub-fase-2/colocar_queijo.png"
          },
          {
            "id": "presunto",
            "name": "Colocar presunto",
            "icon": "🥓",
            "img": "fase-4/sub-fase-2/colocar_presunto.png"
          },
          {
            "id": "salada",
            "name": "Colocar salada",
            "icon": "🥬",
            "img": "fase-4/sub-fase-2/colocar_salada.png"
          },
          {
            "id": "fecharSanduiche",
            "name": "Fechar sanduíche",
            "icon": "🥪",
            "img": "fase-4/sub-fase-2/fechar_sanduíche.png"
          }
        ],
        "sequence": [
          "pao",
          "abrirPao",
          "queijo",
          "presunto",
          "salada",
          "fecharSanduiche"
        ]
      },
      {
        "id": 3,
        "title": "Comer lanche",
        "desc": "Organize a hora de comer",
        "mission": "Hora de comer o lanche com calma.",
        "blocks": [
          {
            "id": "mesa",
            "name": "Levar prato à mesa",
            "icon": "🍽️",
            "img": "fase-4/sub-fase-3/levar_prato_mesa.png"
          },
          {
            "id": "sentar",
            "name": "Sentar",
            "icon": "🪑",
            "img": "fase-4/sub-fase-3/sentar.png"
          },
          {
            "id": "guardanapo",
            "name": "Pegar guardanapo",
            "icon": "🧻",
            "img": "fase-4/sub-fase-3/pegar_guardanapos.png"
          },
          {
            "id": "comer",
            "name": "Comer lanche",
            "icon": "😋",
            "img": "fase-4/sub-fase-3/morder.png"
          },
          {
            "id": "mastigar",
            "name": "Mastigar com calma",
            "icon": "🙂",
            "img": "fase-4/sub-fase-3/mastigar.png"
          },
          {
            "id": "suco",
            "name": "Beber suco",
            "icon": "🧃",
            "img": "fase-4/sub-fase-3/beber_suco.png"
          }
        ],
        "sequence": [
          "mesa",
          "sentar",
          "guardanapo",
          "comer",
          "mastigar",
          "suco"
        ]
      },
      {
        "id": 4,
        "title": "Limpar depois",
        "desc": "Organize tudo depois do lanche",
        "mission": "Depois do lanche, é hora de limpar.",
        "blocks": [
          {
            "id": "pia",
            "name": "Levar prato à pia",
            "icon": "🚰",
            "img": "fase-4/sub-fase-4/levar_prato_pia.png"
          },
          {
            "id": "lixo",
            "name": "Jogar guardanapo no lixo",
            "icon": "🗑️",
            "img": "fase-4/sub-fase-4/jogar_lixo.png"
          },
          {
            "id": "limpar",
            "name": "Limpar mesa",
            "icon": "🧽",
            "img": "fase-4/sub-fase-4/limpar_mesa.png"
          },
          {
            "id": "guardar",
            "name": "Guardar ingredientes",
            "icon": "🥗",
            "img": "fase-4/sub-fase-4/guardar_ingredientes.png"
          },
          {
            "id": "lavarMaosFim",
            "name": "Lavar as mãos novamente",
            "icon": "🧼",
            "img": "fase-4/sub-fase-4/lavar_as_maos.png"
          },
          {
            "id": "conferirCozinha",
            "name": "Conferir cozinha limpa",
            "icon": "✅",
            "img": "fase-4/sub-fase-4/conferir_cozinha.png"
          }
        ],
        "sequence": [
          "pia",
          "lixo",
          "limpar",
          "guardar",
          "lavarMaosFim",
          "conferirCozinha"
        ]
      }
    ]
  },
  {
    "id": 5,
    "icon": "💻",
    "title": "Usando o Computador",
    "bg": "linear-gradient(135deg,#D8A8E8,#AE5ABF)",
    "pbColor": "#7B2FA0",
    "difficulty": "Muito Difícil",
    "desc": "Organize o uso do computador",
    "subphases": [
      {
        "id": 1,
        "title": "Ligar computador",
        "desc": "Organize os passos para ligar o computador",
        "mission": "Vamos ligar o computador com cuidado.",
        "blocks": [
          {
            "id": "organizarMesa",
            "name": "Organizar a mesa",
            "icon": "🧹",
            "img": "fase-5/sub-fase-1/organizar_mesa.png"
          },
          {
            "id": "cadeira",
            "name": "Sentar na cadeira",
            "icon": "🪑",
            "img": "fase-5/sub-fase-1/sentra_cadeira.png"
          },
          {
            "id": "postura",
            "name": "Ajustar postura",
            "icon": "🧍",
            "img": "fase-5/sub-fase-1/ajustar_postura.png"
          },
          {
            "id": "cabos",
            "name": "Conferir cabos",
            "icon": "🔌",
            "img": "fase-5/sub-fase-1/conferir_cabos.png"
          },
          {
            "id": "botao",
            "name": "Apertar botão",
            "icon": "🔘",
            "img": "fase-5/sub-fase-1/ligar_pc.png"
          },
          {
            "id": "iniciar",
            "name": "Esperar iniciar",
            "icon": "⏳",
            "img": "fase-5/sub-fase-1/esperar.png"
          },
          {
            "id": "area",
            "name": "Abrir área de trabalho",
            "icon": "🖥️",
            "img": "fase-5/sub-fase-1/abrir_area_de_trabalho.png"
          }
        ],
        "sequence": [
          "organizarMesa",
          "cadeira",
          "postura",
          "cabos",
          "botao",
          "iniciar",
          "area"
        ]
      },
      {
        "id": 2,
        "title": "Fazer atividade",
        "desc": "Organize uma atividade no computador",
        "mission": "Agora vamos fazer uma atividade no computador.",
        "blocks": [
          {
            "id": "programa",
            "name": "Abrir programa",
            "icon": "📂",
            "img": "fase-5/sub-fase-2/abrir_programa.png"
          },
          {
            "id": "arquivo",
            "name": "Criar arquivo",
            "icon": "📄",
            "img": "fase-5/sub-fase-2/abirir_arquivo.png"
          },
          {
            "id": "nomear",
            "name": "Nomear arquivo",
            "icon": "🏷️",
            "img": "fase-5/sub-fase-2/nomear_arquivo.png"
          },
          {
            "id": "texto",
            "name": "Digitar texto",
            "icon": "⌨️",
            "img": "fase-5/sub-fase-2/digitar_texto.png"
          },
          {
            "id": "revisarTexto",
            "name": "Revisar texto",
            "icon": "🔍",
            "img": "fase-5/sub-fase-2/revisar_texto.png"
          },
          {
            "id": "imagem",
            "name": "Inserir imagem",
            "icon": "🖼️",
            "img": "fase-5/sub-fase-2/inserir_imagem.png"
          },
          {
            "id": "organizarConteudo",
            "name": "Organizar conteúdo",
            "icon": "🧩",
            "img": "fase-5/sub-fase-2/organizar_conteudo.png"
          }
        ],
        "sequence": [
          "programa",
          "arquivo",
          "nomear",
          "texto",
          "revisarTexto",
          "imagem",
          "organizarConteudo"
        ]
      },
      {
        "id": 3,
        "title": "Salvar trabalho",
        "desc": "Organize os passos para salvar",
        "mission": "É importante salvar o trabalho antes de sair.",
        "blocks": [
          {
            "id": "revisar",
            "name": "Revisar trabalho",
            "icon": "🔍",
            "img": "fase-5/sub-fase-3/revisar_trabalho.png"
          },
          {
            "id": "salvar",
            "name": "Clicar em salvar",
            "icon": "💾",
            "img": "fase-5/sub-fase-3/clicar_em_salvar.png"
          },
          {
            "id": "pasta",
            "name": "Escolher pasta",
            "icon": "📁",
            "img": "fase-5/sub-fase-3/escolher_opção.png"
          },
          {
            "id": "nomeCorreto",
            "name": "Conferir nome do arquivo",
            "icon": "🏷️",
            "img": "fase-5/sub-fase-3/nomear_arquivo.png"
          },
          {
            "id": "confirmar",
            "name": "Confirmar salvamento",
            "icon": "✅",
            "img": "fase-5/sub-fase-3/cinformar_salvamento.png"
          },
          {
            "id": "verificarArquivo",
            "name": "Verificar arquivo salvo",
            "icon": "👀",
            "img": "fase-5/sub-fase-3/verificar_arquivo.png"
          },
          {
            "id": "backup",
            "name": "Fazer cópia de segurança",
            "icon": "🛡️",
            "img": "fase-5/sub-fase-3/fazer_copia.png"
          }
        ],
        "sequence": [
          "revisar",
          "salvar",
          "pasta",
          "nomeCorreto",
          "confirmar",
          "verificarArquivo",
          "backup"
        ]
      },
      {
        "id": 4,
        "title": "Encerrar uso",
        "desc": "Organize os passos para encerrar o uso",
        "mission": "Depois de usar, desligue tudo corretamente.",
        "blocks": [
          {
            "id": "salvo",
            "name": "Confirmar que salvou",
            "icon": "✅",
            "img": "fase-5/sub-fase-4/confirmar_salvamento.png"
          },
          {
            "id": "fechar",
            "name": "Fechar programa",
            "icon": "❎",
            "img": "fase-5/sub-fase-4/fechar_programa.png"
          },
          {
            "id": "organizarArquivos",
            "name": "Organizar arquivos",
            "icon": "📁",
            "img": "fase-5/sub-fase-4/organizar_arquivos.png"
          },
          {
            "id": "desligar",
            "name": "Desligar computador",
            "icon": "🔌",
            "img": "fase-5/sub-fase-4/desligar_pc.png"
          },
          {
            "id": "tela",
            "name": "Esperar apagar tela",
            "icon": "🖥️",
            "img": "fase-5/sub-fase-4/esperar_desligar.png"
          },
          {
            "id": "arrumarMesa",
            "name": "Arrumar a mesa",
            "icon": "🧹",
            "img": "fase-5/sub-fase-4/organizar_mesa.png"
          },
          {
            "id": "sair",
            "name": "Sair da cadeira",
            "icon": "🚶",
            "img": "fase-5/sub-fase-4/sair_da_cadeira.png"
          }
        ],
        "sequence": [
          "salvo",
          "fechar",
          "organizarArquivos",
          "desligar",
          "tela",
          "arrumarMesa",
          "sair"
        ]
      }
    ]
  }
];
