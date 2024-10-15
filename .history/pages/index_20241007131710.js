import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import Image from "next/image";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    // After 5 seconds (animation duration + final fade in), show the homepage content
    const timer = setTimeout(() => {
      setShowHome(true);
    }, 5000); // Adjust timing for smooth fade transition
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar /> {/* Navbar always visible */}
      {!showHome && (
        <div className={styles.landingPage}>
          {/* Words scroll and cross each other */}
          <h1 className={styles.kitchen}>Kitchen</h1>
          <h1 className={styles.cookbook}>Cookbook</h1>

          {/* Final clean "Kitchen Cookbook" */}
          <h1 className={styles.finalText}>Kitchen Cookbook</h1>
        </div>
      )}
      {showHome && (
        <>
          <div className={styles.homeSection} id="home">
            <h1>
              Cooking with{" "}
              <Image src="/heart.png" alt="heart" width={40} height={40} /> is
              the best way to bring friends and family together
            </h1>
          </div>
          <div className={styles.aboutSection} id="about">
            <h2>About</h2>
            <p>
              The Kitchen Cookbook is an easy-to-reference cookbook for our
              family's favorite recipes.
            </p>
          </div>
          <div className={styles.recipeSection} id="recipes">
            <h2>Recipes</h2>
            <div className={styles.recipeCards}>
              <RecipeCard title="Breakfast" link="/recipes/breakfast" />
              <RecipeCard title="Dinner" link="/recipes/dinner" />
              <RecipeCard title="Dessert" link="/recipes/dessert" />
            </div>
          </div>
        </>
      )}
    </>
  );
}
