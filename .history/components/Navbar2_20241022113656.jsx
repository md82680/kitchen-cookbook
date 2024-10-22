import Link from "next/link";
im

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/" scroll={false}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/" scroll={false}>
            About
          </Link>
        </li>
        <li>
          <Link href="/" scroll={false}>
            Recipes
          </Link>
        </li>
      </ul>
    </nav>
  );
}
