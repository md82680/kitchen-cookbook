import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";
import CategoryCard from "../components/CategoryCard";
import SearchBar from "../components/SearchBar";
import styles from "../styles/Home.module.scss";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [showContent, setShowContent] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const hasSeenAnimation = localStorage.getItem('hasSeenAnimation');
    if (hasSeenAnimation) {
      setShowContent(true);
      setInitialLoadDone(true);
    } else {
      const timer = setTimeout(() => {
        setShowContent(true);
        localStorage.setItem('hasSeenAnimation', 'true');
      }, 4500); // Adjust this time to match your animation duration
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (showContent && !initialLoadDone) {
      setInitialLoadDone(true);
    }
  }, [showContent, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone && router.asPath.includes('#')) {
      const id = router.asPath.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialLoadDone, router.asPath]);

  useEffect(() => {
    const fetchRecipes = async () => {
  const recipes = [
    {
      title: "Spaghetti Bolognese",
      description: "A hearty meat sauce with pasta.",
      slug: "spaghetti-bolognese",
    },
    {
      title: "Oat Flour Chocolate Chip Cookies",
      description: "Delicious and healthy oat flour cookies.",
      slug: "oat-flour-chocolate-chip-cookies",
    },
    {
      title: "Chicken Alfredo",
      description: "Creamy pasta with chicken and Alfredo sauce.",
      slug: "chicken-alfredo",
    },
    // Add more recipes here
  ];

  if (!showContent) {
    return (
      <div className={styles.landingPage}>
        <h1 className={styles.kitchen}>Kitchen</h1>
        <h1 className={styles.cookbook}>Cookbook</h1>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.homeSection} id="home">
        <h1>
          Cooking with heart is the best way to bring friends and family
          together
        </h1>
      </div>
      <div className={styles.aboutSection} id="about">
        <h2>About</h2>
        <p>
          The Kitchen Cookbook is an easy-to-reference cookbook for our family's
          favorite recipes.
        </p>
      </div>
      <div className={styles.recipeSection} id="recipes">
        <h2>Recipes</h2>
        {session && (
          <Link href="/admin/add-recipe" className={styles.addRecipeButton}>
            Add Recipe
          </Link>
        )}
        <SearchBar recipes={recipes} />
        <div className={styles.categoryCards}>
          <CategoryCard
            title="Breakfast"
            link="/breakfast"
            imageSrc="/images/breakfast.jpg"
          />
          <CategoryCard
            title="Dinner"
            link="/dinner"
            imageSrc="/images/dinner.jpg"
          />
          <CategoryCard
            title="Appetizers/Snacks"
            link="/appetizers_snacks"
            imageSrc="/images/appetizers_snacks.jpg"
          />
          <CategoryCard
            title="Dessert"
            link="/dessert"
            imageSrc="/images/dessert.jpg"
          />
        </div>
      </div>
    </>
  );
}
