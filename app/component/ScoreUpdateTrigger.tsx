"use client";
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from '../utils/apiCallsNext';
import scoringSystem from '../../store/scoringSystem';

const ScoreUpdateTrigger = () => {
    const { user } = useAuth0();
    const currentScore = scoringSystem((state) => state.totalScore);
    const currentRunId = scoringSystem((state) => state.currentRunId);

    useEffect(() => {
        const updateScore = async () => {
            if (!user || !user.sub) return;

            try {
                if (currentRunId) {
                    // Persist score to the active game run
                    await api
                        .updateGameRun(user.sub, currentRunId, currentScore)
                        .catch((error) =>
                            console.error('Failed to update game run score:', error)
                        );
                } else {
                    // Fallback: persist as generic Score stat (guest or legacy)
                    await api
                        .updateUserAccountStats(user.sub, 'Score', currentScore)
                        .catch((error) =>
                            console.error('Failed to update score:', error)
                        );
                }
            } catch (error) {
                console.error('Error updating score:', error);
            }
        };

        updateScore();
    }, [user, currentScore, currentRunId]);

    return null;
};

export default ScoreUpdateTrigger;