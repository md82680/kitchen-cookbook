import Link from "next/link";
import styles from "../styles/Navbar.module.scss"; // Assuming you use SCSS for styles

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="pages/recipes/recipes">Recipes</Link>
        </li>
      </ul>
    </nav>
  );
}
