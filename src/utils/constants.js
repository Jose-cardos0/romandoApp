// Configurações do sistema
export const SYSTEM_CONFIG = {
  ADMIN_EMAIL: "admin@codenxt.online",
  ADMIN_PASSWORD: "123456789",
  DEFAULT_COINS: 0,
  USER_STATUS: {
    PENDING: "pending",
    ACTIVE: "active",
    INACTIVE: "inactive",
  },
  TIP_STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
  },
};

// Mensagens do sistema
export const MESSAGES = {
  LOGIN_SUCCESS: "Login realizado com sucesso!",
  LOGIN_ERROR: "Erro no login. Verifique suas credenciais.",
  REGISTER_SUCCESS:
    "Conta criada com sucesso! Aguarde a aprovação do administrador.",
  REGISTER_ERROR: "Erro no cadastro. Tente novamente.",
  USER_APPROVED: "Usuário aprovado com sucesso!",
  USER_DEACTIVATED: "Usuário desativado com sucesso!",
  TIP_CREATED: "Dica criada com sucesso!",
  TIP_ERROR: "Erro ao criar dica. Tente novamente.",
  ACCOUNT_PENDING: "Sua conta está aguardando aprovação do administrador.",
  ACCOUNT_INACTIVE: "Sua conta foi desativada pelo administrador.",
  LOGOUT_SUCCESS: "Logout realizado com sucesso!",
};

// Validações
export const VALIDATIONS = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
};
