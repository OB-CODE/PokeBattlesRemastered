import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { battleLogStore } from "../../../../store/battleLogStore";

interface IHealthLost {
  isPlayer: boolean;
  playerDamageSustained: number;
  opponentDamageSustained: number;
}

const HealthLostAnimation = ({
  isPlayer,
  playerDamageSustained,
  opponentDamageSustained,
}: IHealthLost) => {
  const springProps = useSpring({
    from: { transform: "scale(1)" },
    to: { transform: "scale(1.3)" },
    config: { tension: 120, friction: 21 },
    reset: true, // Reset the animation every time the value changes
  });

  const currentMessageLog = battleLogStore((state) => state.messageLog);
  const [hasFirstAttackStarted, setHasFirstAttackStarted] = useState(false);
  useEffect(() => {
    if (currentMessageLog.length > 1) {
      setHasFirstAttackStarted(true);
    }
  }, [currentMessageLog]);

  return (
    <div className="absolute z-20 top-0 left-0">
      <animated.div
        style={springProps}
        className="text-red-600 font-bold text-lg"
      >
        {isPlayer ? (
          playerDamageSustained > 0 ? (
            "-" + playerDamageSustained
          ) : hasFirstAttackStarted ? (
            <div className="text-black">0</div>
          ) : null
        ) : opponentDamageSustained > 0 ? (
          "-" + opponentDamageSustained
        ) : hasFirstAttackStarted ? (
          <div className="text-black">0</div>
        ) : null}
      </animated.div>
    </div>
  );
};

export default HealthLostAnimation;
