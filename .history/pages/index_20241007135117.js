import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import Image from "next/image";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if the animation has already been shown
    const hasSeenAnimation = localStorage.getItem("hasSeenAnimation");

    if (!hasSeenAnimation) {
      // First-time visit: show the animation
      const timer = setTimeout(() => {
        setShowContent(true);
        localStorage.setItem("hasSeenAnimation", "true"); // Set flag in localStorage
      }, 5000); // 5-second delay for fade-in animation

      return () => clearTimeout(timer);
    } else {
      // Subsequent visit: skip the animation and show content immediately
      setShowContent(true);
    }
  }, []);

  return (
    <>
      {/* Navbar stays visible at the top */}
      <Navbar />

      {/* Landing page animation only shows on the first visit */}
      {!showContent && (
        <div className={styles.landingPage}>
          {/* Words scroll and cross each other */}
          <h1 className={styles.kitchen}>Kitchen</h1>
          <h1 className={styles.cookbook}>Cookbook</h1>

          {/* Final clean "Kitchen Cookbook" */}
          <h1 className={styles.finalText}>Kitchen Cookbook</h1>
        </div>
      )}

      {/* Main content appears after fade-in animation or immediately on subsequent visits */}
      {showContent && (
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
