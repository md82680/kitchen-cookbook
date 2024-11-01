import { useState } from "react";
import RecipeCard from "./RecipeCard";
import styles from "../styles/RecipeCarousel.module.scss";

export default function RecipeCarousel({ recipes }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextRecipe = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const prevRecipe = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length
    );
  };

  return (
    <div className={styles.carouselContainer}>
      <button 
        type="button"
        className={`${styles.arrowButton} ${styles.leftArrow}`} 
        onClick={prevRecipe}
        aria-label="Previous recipe"
      >
        ‹
      </button>
      
      <div className={styles.cardContainer}>
        <RecipeCard {...recipes[currentIndex]} />
      </div>
      
      <button 
        type="button"
        className={`${styles.arrowButton} ${styles.rightArrow}`} 
        onClick={nextRecipe}
        aria-label="Next recipe"
      >
        ›
      </button>
    </div>
  );
}
