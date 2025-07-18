import React from "react";
import { useScoreSystem } from "../../../store/scoringSystem";
import { Caprasimo } from "next/font/google";
import accountStatsStore from "../../../store/accountStatsStore";

const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

const ScoreDisplay: React.FC = () => {
  const { totalScore, scoreHistory, getCurrentRank } = useScoreSystem();
  const accountStats = accountStatsStore();

  // Get the last 10 score events for display
  const recentScores = [...scoreHistory].reverse().slice(0, 10);

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg overflow-hidden">
      <div
        className={`${CaprasimoFont.className} bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 text-center`}
      >
        <h2 className="text-2xl">Trainer Score</h2>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-gray-200">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <div className="text-gray-500 text-sm uppercase font-semibold">
            Current Score
          </div>
          <div className="text-4xl font-bold text-indigo-700">
            {totalScore.toLocaleString()}
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <div className="text-gray-500 text-sm uppercase font-semibold">
            Current Rank
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {getCurrentRank()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b border-gray-200">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-gray-500 text-xs uppercase font-semibold mb-2">
            Collection Progress
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Seen</div>
              <div className="text-lg font-semibold">
                {accountStats.totalPokemonSeen}/151
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Caught</div>
              <div className="text-lg font-semibold">
                {accountStats.totalPokemonCaught}/151
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-lg font-semibold">
                {Math.round((accountStats.totalPokemonCaught / 151) * 100)}%
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
              style={{
                width: `${(accountStats.totalPokemonCaught / 151) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-gray-500 text-xs uppercase font-semibold mb-2">
            Battle Record
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-lg font-semibold">
                {accountStats.totalBattles}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Wins</div>
              <div className="text-lg font-semibold text-green-600">
                {accountStats.totalBattlesWon}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Losses</div>
              <div className="text-lg font-semibold text-red-600">
                {accountStats.totalBattlesLost}
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <div className="text-sm text-gray-500 mr-2">Win Rate:</div>
            <div className="text-lg font-semibold">
              {accountStats.totalBattles > 0
                ? Math.round(
                    (accountStats.totalBattlesWon / accountStats.totalBattles) *
                      100
                  )
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      {recentScores.length > 0 && (
        <div className="p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold mb-3">
            Recent Score Activity
          </h3>
          <div className="bg-white rounded-lg shadow-sm overflow-scroll h-64    ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Points
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentScores.map((score, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(score.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        score.points > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {score.points > 0 ? `+${score.points}` : score.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {score.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
