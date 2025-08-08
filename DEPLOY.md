# 🚀 Guia de Deploy - Sistema de Tipsters

## 📋 Pré-requisitos

1. **Conta Firebase** ativa
2. **Node.js** versão 16 ou superior
3. **Git** instalado
4. **Firebase CLI** instalado globalmente

## 🔧 Configuração do Firebase

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Fazer login no Firebase

```bash
firebase login
```

### 3. Inicializar projeto Firebase (se necessário)

```bash
firebase init
```

### 4. Configurar regras do Firestore

```bash
firebase deploy --only firestore:rules
```

### 5. Configurar índices do Firestore

```bash
firebase deploy --only firestore:indexes
```

## 🏗️ Build e Deploy

### 1. Build do projeto

```bash
npm run build
```

### 2. Deploy para Firebase Hosting

```bash
firebase deploy --only hosting
```

### 3. Deploy completo (Hosting + Firestore)

```bash
firebase deploy
```

## 🌐 URLs de Acesso

Após o deploy, o sistema estará disponível em:

- **URL principal:** `https://seu-projeto.firebaseapp.com`
- **URL alternativa:** `https://seu-projeto.web.app`

## 🔐 Configuração de Segurança

### 1. Verificar regras do Firestore

As regras já estão configuradas no arquivo `firestore.rules`:

- Usuários só podem ler seus próprios dados
- Apenas admins podem gerenciar usuários e dicas
- Usuários ativos podem visualizar dicas

### 2. Configurar Authentication

No console do Firebase:

1. Vá para **Authentication** > **Sign-in method**
2. Habilite **Email/Password**
3. Configure domínios autorizados se necessário

### 3. Configurar Firestore

No console do Firebase:

1. Vá para **Firestore Database**
2. Crie as coleções `users` e `tips` se não existirem
3. Verifique se os índices foram criados corretamente

## 📊 Monitoramento

### 1. Logs do Firebase

```bash
firebase functions:log
```

### 2. Analytics (opcional)

```bash
firebase deploy --only analytics
```

## 🔄 Atualizações

Para atualizar o sistema:

1. **Fazer alterações no código**
2. **Build do projeto:**
   ```bash
   npm run build
   ```
3. **Deploy das alterações:**
   ```bash
   firebase deploy
   ```

## 🛠️ Troubleshooting

### Problema: Erro de CORS

**Solução:** Verificar configuração de domínios autorizados no Firebase Console

### Problema: Regras do Firestore não funcionam

**Solução:**

```bash
firebase deploy --only firestore:rules
```

### Problema: Build falha

**Solução:** Verificar dependências e versões do Node.js

### Problema: Autenticação não funciona

**Solução:** Verificar configuração do Firebase no arquivo `src/services/firebase.js`

## 📱 Configuração de Domínio Personalizado

### 1. Adicionar domínio no Firebase Console

1. Vá para **Hosting** > **Custom domains**
2. Clique em **Add custom domain**
3. Siga as instruções para configurar DNS

### 2. Configurar SSL

O Firebase configura SSL automaticamente para domínios personalizados.

## 🔒 Segurança Adicional

### 1. Configurar CSP (Content Security Policy)

Adicionar no `index.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self' https://firebaseapp.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com/ https://www.googleapis.com;"
/>
```

### 2. Configurar HTTPS

O Firebase Hosting já fornece HTTPS por padrão.

## 📈 Performance

### 1. Otimizações recomendadas:

- Usar lazy loading para componentes
- Implementar cache de dados
- Otimizar imagens e assets
- Usar CDN para recursos estáticos

### 2. Monitoramento de performance:

- Firebase Performance Monitoring
- Google Analytics
- Console do navegador

## 🆘 Suporte

Para problemas específicos:

1. Verificar logs do Firebase
2. Consultar documentação oficial
3. Verificar console do navegador
4. Testar em modo de desenvolvimento local
