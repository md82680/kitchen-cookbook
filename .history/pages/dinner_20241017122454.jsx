import { useState } from "react";
import Navbar2 from "../components/Navbar2";
import RecipeDetailCard from "../components/RecipeDetailCard";
import styles from "../styles/Dinner.module.scss";

export default function Dinner() {
  const dinnerRecipes = [
    {
      title: "Spaghetti Bolognese",
      description: "A hearty meat sauce with pasta.",
      image: "/spaghetti.jpg",
      recipe: "1. Cook spaghetti. 2. Prepare meat sauce. 3. Combine and serve.",
    },
    {
      title: "Chicken Alfredo",
      description: "Creamy pasta with chicken and Alfredo sauce.",
      image: "/chicken-alfredo.jpg",
      recipe:
        "1. Cook pasta. 2. Prepare Alfredo sauce. 3. Cook chicken. 4. Combine all ingredients.",
    },
    // Add more recipes here
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextRecipe = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dinnerRecipes.length);
  };

  const prevRecipe = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + dinnerRecipes.length) % dinnerRecipes.length
    );
  };

  return (
    <>
      <Navbar2 />
      <div className={styles.container}>
        <h2>Dinner Recipes</h2>
        <div className={styles.carouselContainer}>
          <button onClick={prevRecipe}>&lt;</button>
          <RecipeDetailCard {...dinnerRecipes[currentIndex]} />
          <button onClick={nextRecipe}>&gt;</button>
        </div>
      </div>
    </>
  );
}
