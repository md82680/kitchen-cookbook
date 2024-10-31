import { useState, useEffect } from "react";
import Navbar2 from "../components/Navbar2";
import RecipeDetailCard from "../components/RecipeDetailCard";
import styles from "../styles/RecipePage.module.scss";

export default function Breakfast() {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes/BREAKFAST');
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
  const breakfastRecipes = [
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
    setCurrentIndex((prevIndex) => (prevIndex + 1) % breakfastRecipes.length);
  };

  const prevRecipe = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + breakfastRecipes.length) % breakfastRecipes.length
    );
  };

  return (
    <>
      <Navbar2 />
      <div className={styles.container}>
        <h2 className={styles.title}>Breakfast Recipes</h2>
        <div className={styles.carouselContainer}>
          <button className={styles.carouselButton} onClick={prevRecipe}>
            &lt;
          </button>
          <RecipeDetailCard {...breakfastRecipes[currentIndex]} />
          <button className={styles.carouselButton} onClick={nextRecipe}>
            &gt;
          </button>
        </div>
      </div>
    </>
  );
}
