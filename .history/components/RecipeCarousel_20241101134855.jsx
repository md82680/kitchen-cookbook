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
    <div className={`${styles.carouselContainer} ${isMobile ? styles.mobile : ''}`}>
      <button 
        type="button"
        className={`${styles.arrowButton} ${styles.leftArrow}`} 
        onClick={prevRecipe}
      >
        ←
      </button>
      
      <div className={styles.cardContainer}>
        <RecipeCard {...recipes[currentIndex]} />
      </div>
      
      <button 
        type="button"
        className={`${styles.arrowButton} ${styles.rightArrow}`} 
        onClick={nextRecipe}
      >
        →
      </button>
    </div>
  );
}
