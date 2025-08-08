import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [tips, setTips] = useState([]);
  const [bets, setBets] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [showTipForm, setShowTipForm] = useState(false);
  const [tipForm, setTipForm] = useState({
    teamA: "",
    teamB: "",
    betType: "",
    betValue: "",
    returnValue: "",
    odds: "",
    league: "",
    note: "",
    market: "",
    os: "",
    ht: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchUsers();
    fetchTips();
    fetchBets();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(usersQuery);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const fetchTips = async () => {
    try {
      const tipsQuery = query(collection(db, "tips"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(tipsQuery);
      const tipsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTips(tipsData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dicas:", error);
      setLoading(false);
    }
  };

  const fetchBets = async () => {
    try {
      const betsQuery = query(
        collection(db, "bets"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(betsQuery);
      const betsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBets(betsData);
    } catch (error) {
      console.error("Erro ao buscar apostas:", error);
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        status: newStatus,
      });
      fetchUsers(); // Recarregar lista
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error);
    }
  };

  const handleTipSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tips"), {
        ...tipForm,
        date: new Date(tipForm.date),
        status: "active",
        createdAt: new Date(),
      });
      setTipForm({
        teamA: "",
        teamB: "",
        betType: "",
        betValue: "",
        returnValue: "",
        odds: "",
        league: "",
        note: "",
        market: "",
        os: "",
        ht: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowTipForm(false);
      fetchTips();
    } catch (error) {
      console.error("Erro ao criar dica:", error);
    }
  };

  const handleBetResult = async (betId, result) => {
    try {
      await updateDoc(doc(db, "bets", betId), {
        status: result,
        resultDate: new Date(),
      });
      fetchBets(); // Recarregar lista
    } catch (error) {
      console.error("Erro ao atualizar resultado da aposta:", error);
    }
  };

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

  const getStatusColor = (status) => {
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

  const getBetStatusColor = (status) => {
    switch (status) {
      case "won":
        return "bg-green-100 text-green-800";
      case "lost":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                Painel Administrativo
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Admin: {user.email}</span>
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
              onClick={() => setActiveTab("users")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Gestão de Usuários
            </button>
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
              onClick={() => setActiveTab("bets")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "bets"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Gestão de Apostas
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === "users" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestão de Usuários
                </h2>
                <p className="text-gray-600">
                  Gerencie as contas dos usuários do sistema.
                </p>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <li key={user.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {user.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                user.status
                              )}`}
                            >
                              {user.status === "active"
                                ? "Ativo"
                                : user.status === "pending"
                                ? "Pendente"
                                : "Inativo"}
                            </span>
                          </div>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            Saldo: {user.coins || 0} COINS | Criado em:{" "}
                            {user.createdAt
                              ? formatDate(user.createdAt)
                              : "N/A"}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleUserStatusChange(user.id, "active")
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Ativar
                          </button>
                          <button
                            onClick={() =>
                              handleUserStatusChange(user.id, "inactive")
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Desativar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "tips" && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Dicas Esportivas
                  </h2>
                  <p className="text-gray-600">
                    Gerencie as dicas esportivas do sistema.
                  </p>
                </div>
                <button
                  onClick={() => setShowTipForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Nova Dica
                </button>
              </div>

              {/* Tip Form Modal */}
              {showTipForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                  <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                    <div className="mt-3">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Nova Dica Esportiva
                      </h3>
                      <form onSubmit={handleTipSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Time A
                            </label>
                            <input
                              type="text"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={tipForm.teamA}
                              onChange={(e) =>
                                setTipForm({
                                  ...tipForm,
                                  teamA: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Time B
                            </label>
                            <input
                              type="text"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={tipForm.teamB}
                              onChange={(e) =>
                                setTipForm({
                                  ...tipForm,
                                  teamB: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Tipo de Lance
                            </label>
                            <input
                              type="text"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={tipForm.betType}
                              onChange={(e) =>
                                setTipForm({
                                  ...tipForm,
                                  betType: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Valor Apostado
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={tipForm.betValue}
                              onChange={(e) =>
                                setTipForm({
                                  ...tipForm,
                                  betValue: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Valor Retornado
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={tipForm.returnValue}
                              onChange={(e) =>
                                setTipForm({
                                  ...tipForm,
                                  returnValue: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Odds
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={tipForm.odds}
                              onChange={(e) =>
                                setTipForm({ ...tipForm, odds: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Liga
                            </label>
                            <input
                              type="text"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={tipForm.league}
                              onChange={(e) =>
                                setTipForm({
                                  ...tipForm,
                                  league: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Mercado OVER
                            </label>
                            <input
                              type="text"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={tipForm.market}
                              onChange={(e) =>
                                setTipForm({
                                  ...tipForm,
                                  market: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              O.S
                            </label>
                            <input
                              type="text"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={tipForm.os}
                              onChange={(e) =>
                                setTipForm({ ...tipForm, os: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              HT
                            </label>
                            <input
                              type="text"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={tipForm.ht}
                              onChange={(e) =>
                                setTipForm({ ...tipForm, ht: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Data
                            </label>
                            <input
                              type="date"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={tipForm.date}
                              onChange={(e) =>
                                setTipForm({ ...tipForm, date: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Observação
                          </label>
                          <textarea
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={tipForm.note}
                            onChange={(e) =>
                              setTipForm({ ...tipForm, note: e.target.value })
                            }
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowTipForm(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Lançar Dica
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips List */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {tips.length === 0 ? (
                    <li className="px-6 py-4 text-center text-gray-500">
                      Nenhuma dica criada ainda.
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
            </div>
          )}

          {activeTab === "bets" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestão de Apostas
                </h2>
                <p className="text-gray-600">
                  Gerencie as apostas dos usuários e defina os resultados.
                </p>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {bets.length === 0 ? (
                    <li className="px-6 py-4 text-center text-gray-500">
                      Nenhuma aposta registrada ainda.
                    </li>
                  ) : (
                    bets.map((bet) => (
                      <li key={bet.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-900">
                                {bet.tipTitle}
                              </h3>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getBetStatusColor(
                                  bet.status
                                )}`}
                              >
                                {bet.status === "won"
                                  ? "Vencedora"
                                  : bet.status === "lost"
                                  ? "Perdida"
                                  : "Pendente"}
                              </span>
                            </div>
                            <p className="text-gray-600">
                              Usuário: {bet.userName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Aposta: {bet.betAmount} COINS | Ganho Potencial:{" "}
                              {bet.potentialWin} COINS | Odds: {bet.odds} |
                              Data:{" "}
                              {bet.createdAt
                                ? formatDate(bet.createdAt)
                                : "N/A"}
                            </p>
                          </div>
                          {bet.status === "pending" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleBetResult(bet.id, "won")}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Vencedora
                              </button>
                              <button
                                onClick={() => handleBetResult(bet.id, "lost")}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                              >
                                Perdida
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
