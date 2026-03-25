# 🚀 Missão Rotina teste

> Jogo educativo interativo para crianças do 1º e 2º ano do Ensino Fundamental, desenvolvido para introduzir conceitos de **lógica de programação** e **pensamento computacional** por meio de atividades da rotina diária.

---

## 📸 Preview

![Missão Rotina Preview](Missao_Rotina/image.png)

---

## 📖 Sobre o Projeto

O **Missão Rotina** é um software educativo desenvolvido em HTML, CSS e JavaScript. As crianças recebem blocos com imagens e nomes de ações do cotidiano e devem organizá-los na sequência correta — desenvolvendo raciocínio lógico de forma lúdica e acessível.

O jogo foi planejado para ser jogado no navegador, sem necessidade de instalação, e conta com **narração em áudio** para apoiar crianças em fase de alfabetização.

---

## 🎯 Habilidades BNCC Atendidas

| Código | Descrição |
|--------|-----------|
| **EF01CO02** | Identificar e seguir sequências de passos aplicados no dia a dia para resolver problemas. |
| **EF02CO02** | Criar e simular algoritmos com sequências e repetições simples com base em instruções preestabelecidas. |

---

## 🕹️ Como Jogar

1. Escolha uma fase no menu de navegação.
2. Leia ou **ouça** 🔊 a missão da fase.
3. Arraste os blocos do painel esquerdo para os espaços numerados, montando a sequência correta.
4. Clique em **Verificar!** para checar sua resposta.
5. Use **Dica** se precisar de ajuda (reduz a pontuação).
6. Complete todas as 5 fases para ganhar 100 pontos! 🏆

---

## 🗺️ Fases do Jogo

| Fase | Tema | Sequência |
|------|------|-----------|
| 🌅 Fase 1 | Começar o Dia | Levantar da cama → Arrumar a cama → Trocar de roupa → Escovar os dentes → Arrumar a mochila → Ir para a escola |
| 📚 Fase 2 | Tarefa de Casa | Arrumar o material → Organizar a mesa → Abrir o caderno → Resolver a atividade → Finalizar a tarefa → Guardar os materiais |
| 🎮 Fase 3 | Hora de Brincar | Pegar a caixa → Escolher brinquedos → Brincar → Dividir com amigos → Organizar brinquedos → Guardar na caixa |
| 🥪 Fase 4 | Hora do Lanche | Ir à cozinha → Separar ingredientes → Pegar um prato → Pegar o pão → Pão no prato → Montar o sanduíche → Sentar à mesa → Comer o lanche |
| 💻 Fase 5 | Computação | Criar o arquivo → Salvar o arquivo → Enviar pela internet → Servidor receber → Guardar no sistema |

---

## 🏆 Sistema de Pontuação

- Cada fase vale **20 pontos**.
- Completar todas as fases corretamente soma **100 pontos**.
- Usar dicas **desconta 5 pontos** por dica utilizada (mínimo 5 pontos por fase).
- O progresso é salvo no navegador via **localStorage**.
- A interface exibe pontos totais e ⭐ estrelas conforme o avanço.

---

## 🔊 Recursos de Acessibilidade

- **Narração por áudio** — cada bloco fala seu nome ao ser clicado.
- **Leitura da missão** — botão 🔊 lê em voz alta o objetivo de cada fase.
- **Ouvir sequência** — botão 🎧 lê em voz alta os blocos já posicionados.
- Utiliza a **Web Speech API** nativa do navegador (sem dependências externas).
- Idioma configurado para **pt-BR**.

---

## 🎨 Paleta de Cores

| Nome | Hex | Uso no jogo |
|------|-----|-------------|
| 🔵 Azul | `#84E6F8` | Blocos arrastáveis, botão de áudio |
| 🟣 Roxo | `#AE5ABF` | Header, navegação de fases |
| 🟢 Verde | `#5BB751` | Botão verificar, animação de acerto |
| 🔴 Vermelho | `#C62A2A` | Animação de erro, Fase 3 |
| 🩷 Rosa | `#F29CA3` | Botão recomeçar |
| 🟡 Amarelo | `#F9E784` | Slots da sequência, fala do personagem |

---

## 🗂️ Estrutura do Projeto

```
Missao_Rotina/
├── index.html      # Estrutura HTML da página
├── style.css       # Estilos, cores e animações
├── game.js         # Lógica do jogo, fases e áudio
├── assets/
│   └── preview.png # Screenshot do jogo (adicione após rodar)
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** — estrutura visual do jogo
- **CSS3** — estilização, animações e responsividade
- **JavaScript (ES6+)** — lógica de jogo, drag & drop, pontuação e fases
- **Web Speech API** — narração em áudio nativa do navegador
- **Google Fonts** — fonte [Nunito](https://fonts.google.com/specimen/Nunito)

---

## 🚀 Como Executar

Não é necessário instalar nada. Basta:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/missao-rotina.git

# Acesse a pasta
cd missao-rotina
```

Depois abra o arquivo `index.html` diretamente no navegador.

> ⚠️ A narração por áudio pode não funcionar em alguns navegadores ao abrir via `file://`. Para garantir o funcionamento completo, sirva com um servidor local:

```bash
# Com Python 3
python -m http.server 8000
# Acesse: http://localhost:8000

# Ou com Node.js (npx)
npx serve .
# Acesse: http://localhost:3000
```

---

## 📋 Requisitos

- Navegador moderno com suporte a **Web Speech API** (Chrome, Edge ou Firefox).
- Conexão com a internet apenas para carregar a fonte Nunito (opcional — o jogo funciona sem ela).

---

## 👩‍💻 Autores

| Nome | Curso |
|------|-------|
| **Eduardo Scorpioni** | ADS — AMS |
| **Ester de Almeida Girotto** | ADS — AMS |

---

## 📄 Licença

Este projeto foi desenvolvido para fins **educacionais e acadêmicos**.  
Sinta-se livre para estudar, adaptar e compartilhar com atribuição aos autores.

---

<p align="center">
  Feito com 💜 para crianças que estão aprendendo a pensar de forma lógica.
</p>