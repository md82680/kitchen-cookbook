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
      <div className={styles.cardContainer}>
        <RecipeCard {...recipes[currentIndex]} />
      </div>
      
      <div className={styles.arrowsContainer}>
        <button 
          type="button"
          className={styles.arrowButton}
          onClick={prevRecipe}
          aria-label="Previous recipe"
        >
          ‹
        </button>
        
        <button 
          type="button"
          className={styles.arrowButton}
          onClick={nextRecipe}
          aria-label="Next recipe"
        >
          ›
        </button>
      </div>
    </div>
  );
}
