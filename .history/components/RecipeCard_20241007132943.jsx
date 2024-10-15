import Link from "next/link";
import styles from "../styles/RecipeCard.module.scss";

export default function RecipeCard({ title, link }) {
  return (
    <Link href={link}>
      <div className={styles.card}>
        <h3>{title}</h3>
      </div>
    </Link>
  );
}
