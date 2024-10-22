import Link from "next/link";
import Image from "next/image";
import styles from "../styles/CategoryCard.module.scss";

export default function CategoryCard({ title, link, imageSrc }) {
  return (
    <Link href={link} className={styles.cardLink}>
      <div className={styles.card}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.imageContainer}>
          <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" />
        </div>
      </div>
    </Link>
  );
}
