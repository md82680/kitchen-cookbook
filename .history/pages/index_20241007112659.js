import { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss"; // Importing the SCSS module
import sty

export default function Home() {
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    // After 3 seconds (animation duration), show the homepage
    const timer = setTimeout(() => {
      setShowHome(true);
    }, 3000); // Adjust timing for smooth fade transition
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
      <h1 className={styles.kitchen}>Kitchen</h1>
      <h1 className={styles.cookbook}>Cookbook</h1>
    </div>
  );
}
