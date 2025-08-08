// Função para formatar data
export const formatDate = (date) => {
  if (!date) return "N/A";

  try {
    if (date.toDate) {
      return new Date(date.toDate()).toLocaleDateString("pt-BR");
    }
    return new Date(date).toLocaleDateString("pt-BR");
  } catch {
    return "Data inválida";
  }
};

// Função para formatar moeda
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
};

// Função para obter cor do status
export const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Função para obter texto do status
export const getStatusText = (status) => {
  switch (status) {
    case "active":
      return "Ativo";
    case "pending":
      return "Pendente";
    case "inactive":
      return "Inativo";
    default:
      return "Desconhecido";
  }
};

// Função para validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar senha
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Função para validar nome
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// Função para debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Função para gerar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
