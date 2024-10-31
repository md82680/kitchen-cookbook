import { useState } from "react";
import Image from "next/image";
import styles from "../styles/RecipeDetailCard.module.scss";

export default function RecipeDetailCard({
  title,
  description,
  image,
  recipe,
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
            <Image src={image} alt={title} layout="fill" objectFit="cover" />
          </div>
          <div className={styles.content}>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>
        <div className={styles.cardBack}>
          <div className={styles.content}>
            <h3>{title} Recipe</h3>
            <p>{recipe}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
