# Sistema de Tipsters - Aplicativo Web Multiusuários

Um sistema completo de gestão de dicas esportivas com autenticação Firebase, sistema de apostas e interface moderna.

## 🚀 Funcionalidades

### 🔐 Autenticação e Controle de Acesso

- **Login/Cadastro** com Firebase Authentication
- **Dois perfis de acesso:**
  - **Admin** (admin@codenxt.online / 123456789)
  - **Usuário comum** (cadastro com aprovação manual)
- **Bônus de 500 COINS** para novas contas

### 👤 Dashboard do Usuário

- **Visualização do saldo em COINS** (moeda fictícia)
- **Sistema de Apostas** completo:
  - Apostar em dicas esportivas
  - Cálculo automático de ganhos potenciais
  - Histórico completo de apostas
  - Estatísticas de apostas (vencedoras/perdidas)
- **Botões estáticos** "Adicionar Saldo" e "Sacar Saldo"
- **Lista de dicas esportivas** liberadas pelo admin

### 🛠️ Painel Administrativo

- **Gestão de Usuários:**
  - Visualizar todas as contas (ativas, pendentes, desativadas)
  - Ativar/desativar contas manualmente
  - Visualizar saldo de COINS de cada usuário
- **Gestão de Dicas Esportivas:**
  - Criar novas dicas com formulário completo
  - Visualizar todas as dicas criadas
  - Campos: Time A × Time B, Tipo de lance, Valores, Odds, Liga, etc.
- **Gestão de Apostas:**
  - Visualizar todas as apostas dos usuários
  - Definir resultados (Vencedora/Perdida)
  - Acompanhar ganhos e perdas

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19 + Tailwind CSS 3
- **Backend:** Firebase Authentication + Firestore
- **Build Tool:** Vite

## 📦 Instalação e Execução

1. **Clone o repositório:**

```bash
git clone <url-do-repositorio>
cd romandoApp
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure o Firebase:**

   - O arquivo `src/services/firebase.js` já está configurado
   - Certifique-se de que o projeto Firebase está ativo

4. **Execute o projeto:**

```bash
npm run dev
```

5. **Acesse no navegador:**

```
http://localhost:5173
```

## 🔧 Configuração do Firebase

O sistema já está configurado com as seguintes coleções no Firestore:

### Coleção `users`

```javascript
{
  name: "Nome do usuário",
  email: "email@exemplo.com",
  status: "pending" | "active" | "inactive",
  coins: 500, // Saldo inicial de 500 COINS
  createdAt: Timestamp
}
```

### Coleção `tips`

```javascript
{
  teamA: "Time A",
  teamB: "Time B",
  betType: "Tipo de lance",
  betValue: 100,
  returnValue: 150,
  odds: 1.5,
  league: "Liga",
  note: "Observação",
  market: "Mercado OVER",
  os: "O.S",
  ht: "HT",
  date: Timestamp,
  status: "active",
  createdAt: Timestamp
}
```

### Coleção `bets`

```javascript
{
  userId: "ID do usuário",
  userName: "Nome do usuário",
  tipId: "ID da dica",
  tipTitle: "Time A × Time B",
  betAmount: 50,
  potentialWin: 75,
  odds: 1.5,
  status: "pending" | "won" | "lost",
  createdAt: Timestamp,
  resultDate: Timestamp // Apenas quando definido
}
```

## 👥 Fluxo de Uso

### Para Administradores:

1. Faça login com `admin@codenxt.online` / `123456789`
2. Acesse "Gestão de Usuários" para aprovar contas pendentes
3. Acesse "Dicas Esportivas" para criar novas dicas
4. Acesse "Gestão de Apostas" para definir resultados
5. Use o botão "Nova Dica" para abrir o formulário completo

### Para Usuários Comuns:

1. Faça cadastro na tela de login (recebe 500 COINS de bônus)
2. Aguarde aprovação do administrador
3. Após aprovado, faça login e visualize as dicas liberadas
4. Acesse "Sistema de Apostas" para fazer apostas
5. Acesse "Minhas Apostas" para ver histórico e estatísticas
6. Monitore seu saldo em COINS no header

## 🎯 Sistema de Apostas

### Como Funciona:

1. **Usuário visualiza dicas** disponíveis para aposta
2. **Clica em "Apostar"** na dica desejada
3. **Define valor da aposta** em COINS
4. **Sistema calcula** ganho potencial automaticamente
5. **Aposta é registrada** e COINS são deduzidos
6. **Admin define resultado** (Vencedora/Perdida)
7. **Ganhos são creditados** automaticamente (funcionalidade futura)

### Cálculo de Ganhos:

- **Ganho Potencial = Valor Apostado × Odds**
- Exemplo: 50 COINS × 1.5 = 75 COINS de ganho

### Histórico de Apostas:

- **Lista completa** de todas as apostas realizadas
- **Status visual** (Pendente/Vencedora/Perdida)
- **Cálculo de lucro/prejuízo** por aposta
- **Estatísticas gerais** (Total/Vencedoras/Perdidas)
- **Atualização automática** quando nova aposta é feita

## 🔒 Segurança

- Todas as operações são validadas no Firebase
- Usuários pendentes não conseguem acessar o sistema
- Dados separados por UID do usuário no Firestore
- Autenticação persistente com Firebase Auth
- Regras de Firestore configuradas para apostas

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- Desktop
- Tablet
- Mobile

## 🎨 Interface

- Design moderno com Tailwind CSS
- Componentes reutilizáveis
- Loading states e feedback visual
- Modal para criação de dicas e apostas
- Tabelas responsivas
- Sistema de navegação por abas
- Histórico visual de apostas

## 🚀 Deploy

Para fazer deploy em produção:

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/` e podem ser hospedados em qualquer serviço estático.

## 📞 Suporte

Para dúvidas ou problemas, verifique:

1. Console do navegador para erros
2. Regras de segurança do Firestore
3. Configuração do Firebase Authentication
4. Saldo de COINS do usuário
5. Status das apostas no painel admin
6. Histórico de apostas na aba "Minhas Apostas"
