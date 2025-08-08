import { useState, useEffect, useCallback } from "react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import BettingSystem from "./BettingSystem";
import UserBets from "./UserBets";

const UserDashboard = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tips");
  const [refreshBets, setRefreshBets] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    const fetchTips = async () => {
      try {
        const tipsQuery = query(
          collection(db, "tips"),
          where("status", "==", "active")
        );
        const querySnapshot = await getDocs(tipsQuery);
        const tipsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTips(tipsData);
      } catch (error) {
        console.error("Erro ao buscar dicas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchTips();
  }, [user.uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString("pt-BR");
  };

  const updateBalance = (newBalance) => {
    setUserData((prev) => ({ ...prev, coins: newBalance }));
  };

  const handleBetPlaced = useCallback(() => {
    // Força o recarregamento das apostas
    setRefreshBets((prev) => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard do Usuário
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                <span className="text-yellow-800 font-semibold">
                  Saldo: {userData?.coins || 0} COINS
                </span>
              </div>
              <button
                onClick={() => alert("Funcionalidade em desenvolvimento")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Adicionar Saldo
              </button>
              <button
                onClick={() => alert("Funcionalidade em desenvolvimento")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Sacar Saldo
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("tips")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tips"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dicas Esportivas
            </button>
            <button
              onClick={() => setActiveTab("betting")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "betting"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Sistema de Apostas
            </button>
            <button
              onClick={() => setActiveTab("mybets")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "mybets"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Minhas Apostas
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Bem-vindo, {userData?.name || user.email}!
            </h2>
            <p className="text-gray-600">
              {activeTab === "tips"
                ? "Aqui estão as dicas esportivas liberadas pelo administrador."
                : activeTab === "betting"
                ? "Faça suas apostas nas dicas disponíveis e ganhe COINS!"
                : "Acompanhe o histórico completo das suas apostas e resultados."}
            </p>
          </div>

          {activeTab === "tips" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {tips.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    Nenhuma dica disponível no momento.
                  </li>
                ) : (
                  tips.map((tip) => (
                    <li key={tip.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {tip.teamA} × {tip.teamB}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {formatDate(tip.date)}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">
                                Tipo:
                              </span>{" "}
                              {tip.betType}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Valor:
                              </span>{" "}
                              R$ {tip.betValue}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Retorno:
                              </span>{" "}
                              R$ {tip.returnValue}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Odds:
                              </span>{" "}
                              {tip.odds}
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">
                                Liga:
                              </span>{" "}
                              {tip.league}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Mercado:
                              </span>{" "}
                              {tip.market}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                O.S:
                              </span>{" "}
                              {tip.os}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                HT:
                              </span>{" "}
                              {tip.ht}
                            </div>
                          </div>
                          {tip.note && (
                            <div className="mt-2">
                              <span className="font-medium text-gray-700">
                                Observação:
                              </span>
                              <p className="text-gray-600 mt-1">{tip.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {activeTab === "betting" && (
            <BettingSystem
              user={user}
              userData={userData}
              onUpdateBalance={updateBalance}
              onBetPlaced={handleBetPlaced}
            />
          )}

          {activeTab === "mybets" && <UserBets user={user} key={refreshBets} />}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
