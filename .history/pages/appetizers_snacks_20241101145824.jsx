import { useState, useEffect } from "react";
import Navbar2 from "../components/Navbar2";
import RecipeDetailCard from "../components/RecipeDetailCard";
import styles from "../styles/RecipePage.module.scss";

export default function AppetizersSnacks() {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false); // Add mobile state

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes/SNACK_APPETIZER');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const nextRecipe = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const prevRecipe = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (recipes.length === 0) return <div>No recipes found</div>;

  return (
    <>
      <Navbar2 />
      <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
        <h2 className={styles.title}>Appetizers/Snacks Recipes</h2>
        <div className={styles.pageWrapper}>
          <div className={`${styles.carouselContainer} ${isMobile ? styles.mobile : ''}`}>
            <RecipeDetailCard 
              title={recipes[currentIndex].recipeTitle}
              description={recipes[currentIndex].recipeDescription}
              image={recipes[currentIndex].recipeImage}
              instructions={recipes[currentIndex].recipeInstructions}
              ingredients={recipes[currentIndex].ingredients}
              isMobile={isMobile}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button 
              className={styles.carouselButton} 
              onClick={prevRecipe}
              disabled={recipes.length <= 1}
              aria-label="Previous recipe"
            >
              ←
            </button>
            <button 
              className={styles.carouselButton} 
              onClick={nextRecipe}
              disabled={recipes.length <= 1}
              aria-label="Next recipe"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
