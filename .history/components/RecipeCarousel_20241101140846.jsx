import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import styles from "../styles/RecipeCarousel.module.scss";

export default function RecipeCarousel({ recipes }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextRecipe = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const prevRecipe = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length
    );
  };

  return (
    <div className={`${styles.carouselWrapper} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.cardContainer}>
        <RecipeCard {...recipes[currentIndex]} />
      </div>
      
      <div className={styles.navigationButtons}>
        <div className={styles.arrowsContainer}>
          <button 
            type="button"
            className={`${styles.arrowButton} ${styles.prevArrow}`}
            onClick={prevRecipe}
            aria-label="Previous recipe"
          >
            ←
          </button>
          <button 
            type="button"
            className={`${styles.arrowButton} ${styles.nextArrow}`}
            onClick={nextRecipe}
            aria-label="Next recipe"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
