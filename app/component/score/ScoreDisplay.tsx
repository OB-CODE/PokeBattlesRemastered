"use client";
import React, { useEffect, useState } from 'react';
import { useScoreSystem } from '../../../store/scoringSystem';
import { Caprasimo } from 'next/font/google';
import accountStatsStore from '../../../store/accountStatsStore';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from '../../utils/apiCallsNext';

interface GameRun {
  stat: string;
  value: number;
  status: string;
  startedAt: string;
  endedAt?: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  status: string;
  startedAt: string;
  endedAt?: string;
}

const CaprasimoFont = Caprasimo({ subsets: ['latin'], weight: ['400'] });

const ScoreDisplay: React.FC = () => {
  const { totalScore, scoreHistory, getCurrentRank } = useScoreSystem();
  const accountStats = accountStatsStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [pastRuns, setPastRuns] = useState<GameRun[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'myScore' | 'leaderboard'>('myScore');
  const { user } = useAuth0();

  const playerRanks = [
    { threshold: 0, rank: 'Novice Trainer' },
    { threshold: 1000, rank: 'Beginner Trainer' },
    { threshold: 3000, rank: 'Intermediate Trainer' },
    { threshold: 6000, rank: 'Advanced Trainer' },
    { threshold: 10000, rank: 'Expert Trainer' },
    { threshold: 15000, rank: 'Elite Trainer' },
    { threshold: 20000, rank: 'Master Trainer' },
    { threshold: 25000, rank: 'Champion Trainer' },
    { threshold: 30000, rank: 'Legendary Trainer' },
    { threshold: 40000, rank: 'Pokémon Master' },
  ];

  const currentRank = getCurrentRank();

  const totalPokemonSeen = accountStatsStore((state) => state.totalPokemonSeen);

  const totalPokemonCaught = accountStatsStore(
    (state) => state.totalPokemonCaught
  );
  const totalBattles = accountStatsStore((state) => state.totalBattles);
  const totalBattlesWon = accountStatsStore((state) => state.totalBattlesWon);
  const totalBattlesLost = accountStatsStore((state) => state.totalBattlesLost);
  // Get the last 10 score events for display
  const recentScores = [...scoreHistory].reverse().slice(0, 10);

  // Fetch past game runs
  useEffect(() => {
    if (user?.sub) {
      api.getGameRuns(user.sub).then((runs) => {
        // Sort by startedAt descending (most recent first)
        const sorted = [...runs].sort((a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        );
        setPastRuns(sorted);
      }).catch((err) => console.error('Failed to fetch game runs:', err));
    }
  }, [user]);

  // Fetch leaderboard when tab switches
  useEffect(() => {
    if (activeTab === 'leaderboard') {
      api.getLeaderboard(50).then((entries) => {
        setLeaderboard(entries);
      }).catch((err) => console.error('Failed to fetch leaderboard:', err));
    }
  }, [activeTab]);

  const getRankForScore = (score: number) => {
    for (let i = playerRanks.length - 1; i >= 0; i--) {
      if (score >= playerRanks[i].threshold) return playerRanks[i].rank;
    }
    return playerRanks[0].rank;
  };

  const bestRun = pastRuns.length > 0
    ? pastRuns.reduce((best, run) => run.value > best.value ? run : best, pastRuns[0])
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg overflow-hidden min-h-[500px]">
      <div className={`${CaprasimoFont.className} bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 text-center`}>
        <h2 className="text-2xl">{activeTab === 'myScore' ? 'Trainer Score' : 'High Scores'}</h2>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('myScore')}
          className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'myScore'
              ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white'
              : 'text-gray-500 hover:text-gray-700 bg-gray-50'
          }`}
        >
          My Score
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'leaderboard'
              ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white'
              : 'text-gray-500 hover:text-gray-700 bg-gray-50'
          }`}
        >
          Leaderboard
        </button>
      </div>

      {activeTab === 'leaderboard' ? (
        <div className="p-6">
          {leaderboard.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No scores yet. Be the first!</div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboard.map((entry) => (
                    <tr key={`${entry.username}-${entry.rank}`} className={entry.rank <= 3 ? 'bg-yellow-50' : ''}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-700">
                        {entry.rank === 1 ? '1st' : entry.rank === 2 ? '2nd' : entry.rank === 3 ? '3rd' : entry.rank}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.username}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-indigo-700">
                        {entry.score.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-700">
                        {getRankForScore(entry.score)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {entry.status === 'active' ? 'In Progress' : 'Completed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
      <>
      <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-gray-200">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <div className="text-gray-500 text-sm uppercase font-semibold">
            Current Score
          </div>
          <div className="text-4xl font-bold text-indigo-700">
            {totalScore.toLocaleString()}
          </div>
        </div>
        <div
          className="relative flex flex-col items-center md:items-end"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center gap-1 text-gray-500 text-sm uppercase font-semibold">
            Current Rank
            <AiOutlineInfoCircle className="text-lg cursor-pointer hover:text-gray-700" />
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {currentRank}
          </div>
          {showTooltip && (
            <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
              <ul className="text-sm text-gray-700">
                {playerRanks.map((rank) => (
                  <li
                    key={rank.rank}
                    className={`py-1 ${rank.rank === currentRank
                        ? 'font-bold text-purple-700'
                        : ''
                      }`}
                  >
                    {rank.rank === 'Novice Trainer' ? (
                      <>
                        <span>{rank.rank}</span> <div>&lt; 1000 points</div>
                      </>
                    ) : (
                      <>
                        <span>{rank.rank}</span>{' '}
                        <div>≥ {rank.threshold} points</div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
                {totalPokemonSeen}/151
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Caught</div>
              <div className="text-lg font-semibold">
                {totalPokemonCaught}/151
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-lg font-semibold">
                {Math.round((totalPokemonCaught / 151) * 100)}%
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
              style={{
                width: `${(totalPokemonCaught / 151) * 100}%`,
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
              <div className="text-lg font-semibold">{totalBattles}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Wins</div>
              <div className="text-lg font-semibold text-green-600">
                {totalBattlesWon}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Losses</div>
              <div className="text-lg font-semibold text-red-600">
                {totalBattlesLost}
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <div className="text-sm text-gray-500 mr-2">Win Rate:</div>
            <div className="text-lg font-semibold">
              {totalBattles > 0
                ? Math.round((totalBattlesWon / totalBattles) * 100)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      {recentScores.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-500 text-sm uppercase font-semibold mb-3">
            Recent Score Activity
          </h3>
          <div className="bg-white rounded-lg shadow-sm overflow-scroll h-64">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentScores.map((score, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(score.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${score.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
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

      {pastRuns.length > 0 && (
        <div className="p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold mb-3">
            Past Game Runs
          </h3>
          <div className="bg-white rounded-lg shadow-sm overflow-auto max-h-64">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pastRuns.map((run) => {
                  const isBest = bestRun && run.stat === bestRun.stat && run.status === 'completed';
                  return (
                    <tr key={run.stat} className={isBest ? 'bg-yellow-50' : ''}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(run.startedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-700">
                        {isBest && <span className="mr-1" title="Best score">*</span>}
                        {run.value.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-700">
                        {getRankForScore(run.value)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          run.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {run.status === 'active' ? 'In Progress' : 'Completed'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default ScoreDisplay;
