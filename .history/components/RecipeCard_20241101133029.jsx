import Link from "next/link";
import Image from "next/image";
import styles from "../styles/RecipeCard.module.scss";

export default function RecipeCard({ title, link, image }) {
  return (
    <Link href={link}>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          {image && (
            <Image
              src={image}
              alt={title}
              layout="fill"
              objectFit="cover"
              className={styles.cardImage}
            />
          )}
          <h3>{title}</h3>
        </div>
      </div>
    </Link>
  );
}
