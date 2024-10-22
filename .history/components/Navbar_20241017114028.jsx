import Link from "next/link";
import styles from "../styles/Navbar.module.scss"; // Assuming you use SCSS for styles

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <a href="/" scroll={false}>Home</a>
        </li>
        <li>
          <Link href="/about" scroll={false}>About</Link>
        </li>
        <li>
          <Link href="/recipes" scroll={false}>Recipes</Link>
        </li>
      </ul>
    </nav>
  );
}
