import { Outlet } from "react-router-dom";
import { useState } from "react";
import styles from "./AuthLayout.module.css";

// Function to generate star data
const generateStars = () => {
  const stars = [];
  for (let i = 0; i < 50; i++) {
    stars.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    });
  }
  return stars;
};

const AuthLayout = () => {
  const [starsData] = useState(generateStars);
  return (
    <div className={styles.authContainer}>
      {/* Animated background stars */}
      <div className={styles.starsContainer}>
        {starsData.map((star) => (
          <div
            key={star.id}
            className={styles.star}
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration,
            }}
          />
        ))}
      </div>

      {/* Comet trail effect */}
      <div className={`${styles.comet} ${styles.comet1}`}>
        <div className={styles.cometCore}></div>
        <div className={`${styles.cometTrail} ${styles.trail1}`}></div>
        <div className={`${styles.cometTrail} ${styles.trail2}`}></div>
      </div>

      {/* Another comet */}
      <div className={`${styles.comet} ${styles.comet2}`}>
        <div className={`${styles.cometCore} ${styles.cometCorePink}`}></div>
        <div className={`${styles.cometTrail} ${styles.trailPink}`}></div>
      </div>

      <Outlet />

      {/* Additional cosmic elements */}
      <div className={`${styles.cosmicElement} ${styles.element1}`}></div>
      <div className={`${styles.cosmicElement} ${styles.element2}`}></div>
      <div className={`${styles.cosmicElement} ${styles.element3}`}></div>
    </div>
  );
};

export default AuthLayout;
