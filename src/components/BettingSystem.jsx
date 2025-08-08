import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../services/firebase";

const BettingSystem = ({ user, userData, onUpdateBalance, onBetPlaced }) => {
  const [selectedTip, setSelectedTip] = useState(null);
  const [betAmount, setBetAmount] = useState("");
  const [showBetModal, setShowBetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [availableTips, setAvailableTips] = useState([]);

  useEffect(() => {
    fetchAvailableTips();
  }, []);

  const fetchAvailableTips = async () => {
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
      setAvailableTips(tipsData);
    } catch (error) {
      console.error("Erro ao buscar dicas:", error);
    }
  };

  const handleBet = async () => {
    if (!selectedTip || !betAmount || betAmount <= 0) {
      setMessage("Por favor, selecione uma dica e insira um valor válido.");
      return;
    }

    const amount = parseFloat(betAmount);
    if (amount > userData.coins) {
      setMessage("Saldo insuficiente para esta aposta.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Calcular ganho potencial
      const potentialWin = amount * parseFloat(selectedTip.odds);

      // Criar aposta no Firestore
      await addDoc(collection(db, "bets"), {
        userId: user.uid,
        userName: userData.name,
        tipId: selectedTip.id,
        tipTitle: `${selectedTip.teamA} × ${selectedTip.teamB}`,
        betAmount: amount,
        potentialWin: potentialWin,
        odds: selectedTip.odds,
        status: "pending", // pendente até resultado
        createdAt: new Date(),
      });

      // Deduzir COINS do usuário
      const newBalance = userData.coins - amount;
      await updateDoc(doc(db, "users", user.uid), {
        coins: newBalance,
      });

      setMessage("Aposta realizada com sucesso! Boa sorte!");
      setShowBetModal(false);
      setSelectedTip(null);
      setBetAmount("");

      // Atualizar saldo no componente pai
      onUpdateBalance(newBalance);

      // Notificar que uma nova aposta foi feita
      if (onBetPlaced) {
        onBetPlaced();
      }

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Erro ao realizar aposta: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculatePotentialWin = (amount, odds) => {
    return (parseFloat(amount) * parseFloat(odds)).toFixed(2);
  };

  const formatDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString("pt-BR");
  };

  const openBetModal = (tip) => {
    setSelectedTip(tip);
    setShowBetModal(true);
    setBetAmount("");
    setMessage("");
  };

  return (
    <div>
      {/* Modal de Aposta */}
      {showBetModal && selectedTip && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Fazer Aposta
              </h3>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {selectedTip.teamA} × {selectedTip.teamB}
                </h4>
                <p className="text-sm text-gray-600">
                  Tipo: {selectedTip.betType} | Odds: {selectedTip.odds}
                </p>
                <p className="text-sm text-gray-600">
                  Liga: {selectedTip.league}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor da Aposta (COINS)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={userData.coins}
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Máximo: ${userData.coins} COINS`}
                  />
                </div>

                {betAmount && betAmount > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Ganho Potencial:</span>{" "}
                      {calculatePotentialWin(betAmount, selectedTip.odds)} COINS
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Se a aposta for vencedora
                    </p>
                  </div>
                )}

                {message && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      message.includes("sucesso")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBetModal(false);
                      setSelectedTip(null);
                      setBetAmount("");
                      setMessage("");
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleBet}
                    disabled={
                      loading ||
                      !betAmount ||
                      betAmount <= 0 ||
                      betAmount > userData.coins
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Processando..." : "Fazer Aposta"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Dicas Disponíveis para Aposta */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Dicas Disponíveis para Aposta
          </h3>
          <p className="text-sm text-gray-600">
            Clique em "Apostar" para fazer sua aposta
          </p>
        </div>

        <ul className="divide-y divide-gray-200">
          {availableTips.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              Nenhuma dica disponível para aposta no momento.
            </li>
          ) : (
            availableTips.map((tip) => (
              <li key={tip.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {tip.teamA} × {tip.teamB}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {formatDate(tip.date)}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full">
                          Odds: {tip.odds}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Tipo:</span>{" "}
                        {tip.betType}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Liga:</span>{" "}
                        {tip.league}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Mercado:
                        </span>{" "}
                        {tip.market}
                      </div>
                    </div>
                    {tip.note && (
                      <div className="mt-2">
                        <span className="font-medium text-gray-700">
                          Observação:
                        </span>
                        <p className="text-gray-600 mt-1 text-sm">{tip.note}</p>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => openBetModal(tip)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      Apostar
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default BettingSystem;
