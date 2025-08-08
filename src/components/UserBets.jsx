import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

const UserBets = ({ user }) => {
  const [userBets, setUserBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBets();
  }, [user.uid]);

  const fetchUserBets = async () => {
    try {
      const betsQuery = query(
        collection(db, "bets"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(betsQuery);
      const betsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserBets(betsData);
    } catch (error) {
      console.error("Erro ao buscar apostas do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case "won":
        return "Vencedora";
      case "lost":
        return "Perdida";
      case "pending":
        return "Pendente";
      default:
        return "Desconhecido";
    }
  };

  const calculateProfit = (bet) => {
    if (bet.status === "won") {
      return bet.potentialWin - bet.betAmount;
    } else if (bet.status === "lost") {
      return -bet.betAmount;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Minhas Apostas</h3>
        <p className="text-sm text-gray-600">
          Histórico completo das suas apostas
        </p>
      </div>

      <ul className="divide-y divide-gray-200">
        {userBets.length === 0 ? (
          <li className="px-6 py-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-lg font-medium">
              Nenhuma aposta realizada ainda
            </p>
            <p className="text-sm">
              Faça sua primeira aposta na aba "Sistema de Apostas"
            </p>
          </li>
        ) : (
          userBets.map((bet) => {
            const profit = calculateProfit(bet);
            return (
              <li key={bet.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {bet.tipTitle}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {formatDate(bet.createdAt)}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            bet.status
                          )}`}
                        >
                          {getStatusText(bet.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Aposta:
                        </span>{" "}
                        {bet.betAmount} COINS
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Odds:</span>{" "}
                        {bet.odds}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Ganho Potencial:
                        </span>{" "}
                        {bet.potentialWin} COINS
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Resultado:
                        </span>{" "}
                        <span
                          className={
                            profit > 0
                              ? "text-green-600 font-semibold"
                              : profit < 0
                              ? "text-red-600 font-semibold"
                              : "text-gray-600"
                          }
                        >
                          {profit > 0 ? "+" : ""}
                          {profit} COINS
                        </span>
                      </div>
                    </div>

                    {bet.resultDate && (
                      <div className="mt-2 text-xs text-gray-500">
                        Resultado definido em: {formatDate(bet.resultDate)}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>

      {/* Resumo das apostas */}
      {userBets.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {userBets.length}
              </div>
              <div className="text-gray-600">Total de Apostas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {userBets.filter((bet) => bet.status === "won").length}
              </div>
              <div className="text-gray-600">Apostas Vencedoras</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {userBets.filter((bet) => bet.status === "lost").length}
              </div>
              <div className="text-gray-600">Apostas Perdidas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBets;
