import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar"; // Import the search bar component
import Image from "next/image";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  const recipes = [
    {
      title: "Spaghetti Bolognese",
      description: "A hearty meat sauce with pasta.",
      slug: "spaghetti-bolognese",
    },
    {
      title: "Oat Flour Chocolate Chip Cookies",
      description: "Delicious and healthy oat flour cookies.",
      slug: "oat-flour-chocolate-chip-cookies",
    },
    {
      title: "Chicken Alfredo",
      description: "Creamy pasta with chicken and Alfredo sauce.",
      slug: "chicken-alfredo",
    },
    // Add more recipes here
  ];

  useEffect(() => {
    const hasSeenAnimation = localStorage.getItem("hasSeenAnimation");

    if (!hasSeenAnimation) {
      const timer = setTimeout(() => {
        setShowContent(true);
        localStorage.setItem("hasSeenAnimation", "true");
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowContent(true);
    }
  }, []);

  return (
    <>
      <Navbar />

      {!showContent && (
        <div className={styles.landingPage}>
          <h1 className={styles.kitchen}>Kitchen</h1>
          <h1 className={styles.cookbook}>Cookbook</h1>
          <h1 className={styles.finalText}>Kitchen Cookbook</h1>
        </div>
      )}

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
            {/* Search bar embedded under the Recipes heading */}
            <SearchBar recipes={recipes} />{" "}
            {/* Pass recipes data to the SearchBar component */}
            {/* Default recipe cards */}
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
