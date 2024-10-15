import { useState } from "react";
import Image from "next/image";
import styles from "../styles/RecipeDetails.module.scss";

export default function RecipeDetails({ recipe }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [multiplier, setMultiplier] = useState(1);

  const toggleFlip = () => setIsFlipped(!isFlipped);

  const ingredients = [
    { name: "Spaghetti", quantity: 200, unit: "g" },
    { name: "Ground Beef", quantity: 500, unit: "g" },
    { name: "Tomato Sauce", quantity: 1, unit: "cup" },
  ]; // Add recipe ingredients

  const multiplyIngredients = (factor) => setMultiplier(factor);

  return (
    <div className={styles.card} onClick={toggleFlip}>
      {!isFlipped ? (
        <>
          <Image
            src={recipe.image}
            alt={recipe.title}
            width={300}
            height={200}
          />
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
        </>
      ) : (
        <div className={styles.recipe}>
          <h3>{recipe.title}</h3>
          <p>Servings: {multiplier}x</p>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name}: {ingredient.quantity * multiplier}{" "}
                {ingredient.unit}
              </li>
            ))}
          </ul>
          <button onClick={() => multiplyIngredients(2)}>2x</button>
          <button onClick={() => multiplyIngredients(3)}>3x</button>
          <button onClick={() => multiplyIngredients(4)}>4x</button>
        </div>
      )}
    </div>
  );
}
