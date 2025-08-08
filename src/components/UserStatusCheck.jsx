import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const UserStatusCheck = ({ children, user }) => {
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserStatus(userData.status);
        }
      } catch (error) {
        console.error("Erro ao verificar status do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [user.uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se o usuário não for admin e estiver pendente ou inativo
  if (user.email !== "admin@codenxt.online" && userStatus !== "active") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {userStatus === "pending" ? "Conta Pendente" : "Conta Desativada"}
            </h2>
            <p className="text-gray-600 mb-6">
              {userStatus === "pending"
                ? "Sua conta está aguardando aprovação do administrador. Você receberá um e-mail quando for aprovado."
                : "Sua conta foi desativada pelo administrador. Entre em contato para mais informações."}
            </p>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default UserStatusCheck;
