import { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss"; // Import SCSS module for component styles

export default function Home() {
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    // After 5 seconds (animation duration + final fade in), show the homepage
    const timer = setTimeout(() => {
      setShowHome(true);
    }, 5000); // Adjust timing for smooth fade transition
    return () => clearTimeout(timer);
  }, []);

  if (showHome) {
    return (
      <div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>Home</li>
            <li>Recipes</li>
            <li>About Us</li>
          </ul>
        </nav>
        <div className={styles.recipeCards}>
          <div className={styles.card}>Dinner</div>
          <div className={styles.card}>Breakfast</div>
          <div className={styles.card}>Desserts</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.landingPage}>
      {/* Words scroll and cross each other */}
      <h1 className={styles.kitchen}>Kitchen</h1>
      <h1 className={styles.cookbook}>Cookbook</h1>

      {/* Final clean "Kitchen Cookbook" */}
      <h1 className={styles.finalText}>Kitchen ?Cookbook</h1>
    </div>
  );
}
