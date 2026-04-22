# Debuguinho — Aprenda Sequências

Jogo educacional de ordenação de sequências cotidianas, desenvolvido para a plataforma educacional e alinhado ao Manual de Padronização de Jogos v1.

## Alinhamento BNCC

**Habilidade:** EF01CO02 — Identificar e ordenar sequências de ações para a realização de uma tarefa.
O jogo desenvolve raciocínio sequencial (pensamento computacional) ao pedir que o aluno organize etapas de rotinas do dia a dia na ordem correta.

---

## Mecânica Principal

O jogador recebe um conjunto de **blocos de ação** embaralhados e deve arrastá-los (ou clicar) para preencher os **slots numerados** na sequência correta. Ao verificar, o jogo indica acertos (verde) e erros (vermelho) com feedback visual e auditivo. Cada fase possui tema e contexto próprios (manhã, lição de casa, brincadeira, lanche, computador).

### Fluxo de jogo

1. Carregamento assíncrono das fases via `assets/data/phases.json`
2. Blocos são embaralhados e exibidos na área inferior
3. O jogador monta a sequência nos slots por drag-and-drop ou teclado
4. Ao clicar em **Verificar**, o sistema calcula a pontuação da fase
5. A tela de conclusão exibe estrelas, pontos e detalhes
6. Ao fim das 5 fases, `sendFinalScore()` envia a pontuação (0–100) à plataforma

---

## Níveis de Dificuldade

O jogo implementa **3 níveis**, conforme padrão do manual:

| Nível   | Comportamento |
|---------|--------------|
| Fácil   | Blocos exibidos na ordem correta; penalidades reduzidas em 50% |
| Médio   | Blocos embaralhados; penalidades padrão |
| Difícil | Blocos embaralhados; dicas desativadas; penalidades aumentadas em 50% |

A dificuldade pode vir da plataforma via query string (`?difficulty=Médio`) ou ser selecionada pelo jogador na barra de controles.

---

## Sistema de Pontuação (escala 0–100)

Cada fase pontua internamente de 0 a 30 pontos (20 base + 10 bônus). Ao fim do jogo, a soma total é convertida para a escala 0–100:

```
finalScore = min(100, round((somaFases / (numFases × 30)) × 100))
```

**Penalidades por fase:**
- Mais de 3 erros: −5 pts (×multiplicador de dificuldade)
- Menos de 25% de acertos: −3 pts (×multiplicador de dificuldade)

**Bônus por fase:**
- Sequência perfeita sem erros: +10 pts
- Sequência perfeita com erros (persistência): +3 pts

O score final é enviado **uma única vez** ao fim do jogo via `sendFinalScore()`.

---

## Comunicação com a Plataforma

```javascript
sendFinalScore({ score: 0–100, difficulty: getPlatformDifficulty() });
```

- Evento: `C4A_GAME_SCORE`
- Controlado por `scoreSent` (envio único)
- Disparado ao concluir a última fase

---

## Acessibilidade

- Todos os elementos interativos são operáveis por teclado (Tab, Enter, Espaço, Delete)
- Atributos ARIA completos: `role`, `aria-label`, `aria-live`, `aria-pressed`, `aria-expanded`
- Skip link "Pular para os blocos"
- Foco visível em todos os elementos (WCAG 2.1 AA)
- Menu de acessibilidade dedicado (botão ♿): alto contraste e 3 tamanhos de fonte
- Suporte a `prefers-reduced-motion`
- Feedback auditivo via Web Speech API (pt-BR) com controle de volume e mute

### Atalhos de teclado

| Tecla | Ação |
|-------|------|
| V | Verificar sequência |
| D | Pedir dica |
| R | Recomeçar fase |
| O | Ouvir sequência atual |
| M | Silenciar / ativar áudio |
| A | Abrir painel de acessibilidade |
| Esc | Fechar painel de acessibilidade |

---

## Estrutura de Arquivos

```
debuguinho/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── game.js
│   ├── img/
│   │   └── (imagens das fases)
│   ├── audio/
│   │   └── (reservado para efeitos sonoros futuros)
│   └── data/
│       └── phases.json   ← conteúdo dinâmico desacoplado
├── index.html
└── README.md
```

---

## Dependências

- **Google Fonts — Nunito** (carregada via CDN; sem instalação local)
- **Web Speech API** (nativa nos navegadores modernos; sem biblioteca externa)
- Sem outras dependências ou bibliotecas de terceiros

---

## Parametrização Externa

Todo o conteúdo dinâmico (fases, blocos, sequências, textos de missão) está em `assets/data/phases.json`. Para adicionar ou editar fases, basta modificar esse arquivo sem alterar o código-fonte.

**Exemplo de entrada no JSON:**
```json
{
  "id": 1,
  "icon": "🌅",
  "title": "Começar o Dia!",
  "mission": "Hora de começar o dia!...",
  "blocks": [ { "id": "lb", "name": "Levantar da cama", "icon": "🛏️", "img": "" } ],
  "sequence": ["lb", "ab", "tr", "es", "mo", "ir"]
}
```
