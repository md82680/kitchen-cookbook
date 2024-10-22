import { useState } from 'react';
import Image from 'next/image';
import styles from "../styles/RecipeCard.module.scss";

export default function RecipeCard({ title, description, image, recipe }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={styles.cardContainer} onClick={handleClick}>
      <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}>
        <div className={styles.front}>
          <div className={styles.imageContainer}>
            <Image src={image} alt={title} layout="fill" objectFit="cover" />
          </div>
          <div className={styles.content}>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>
        <div className={styles.back}>
          <h3>{title} Recipe</h3>
          <p>{recipe}</p>
        </div>
      </div>
    </div>
  );
}
