import React from "react";
import { useSpring, animated } from "@react-spring/web";

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

  return (
    <div className="absolute z-20">
      {(isPlayer && playerDamageSustained > 0) ||
      (!isPlayer && opponentDamageSustained > 0) ? (
        <animated.div
          style={springProps}
          className={` ${isPlayer ? "mr-[10rem]" : "ml-[10rem]"} mb-[7vh] text-red-600`}
        >
          - {isPlayer ? playerDamageSustained : opponentDamageSustained}
        </animated.div>
      ) : null}
    </div>
  );
};

export default HealthLostAnimation;
