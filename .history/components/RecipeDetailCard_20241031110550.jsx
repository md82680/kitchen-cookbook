import { useState } from "react";
import Image from "next/image";
import styles from "../styles/RecipeDetailCard.module.scss";

export default function RecipeDetailCard({
  title,
  description,
  image,
  instructions,
  ingredients
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}
      onClick={handleClick}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <div className={styles.imageContainer}>
            <Image 
              src={image} 
              alt={title} 
              layout="fill" 
              objectFit="cover"
              onError={(e) => {
                e.target.src = "/images/default-recipe.jpg"; // Fallback image
              }}
            />
          </div>
          <div className={styles.content}>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>
        <div className={styles.cardBack}>
          <div className={styles.content}>
            <h3>{title} Recipe</h3>
            <div className={styles.ingredients}>
              <h4>Ingredients:</h4>
              <ul>
                {ingredients.map((ing, index) => (
                  <li key={index}>
                    {ing.amount} {ing.unit} {ing.item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.instructions}>
              <h4>Instructions:</h4>
              <p>{instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
