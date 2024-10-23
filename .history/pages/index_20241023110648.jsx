import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";
import CategoryCard from "../components/CategoryCard";
import SearchBar from "../components/SearchBar";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 4500); // Adjust this time to match your animation duration

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url.includes('#')) {
        const id = url.split('#')[1];
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const recipes = [
    // Your recipe data here
  ];

  if (!showContent) {
    return (
      <div className={styles.landingPage}>
        <h1 className={styles.kitchen}>Kitchen</h1>
        <h1 className={styles.cookbook}>Cookbook</h1>
        <h1 className={styles.finalText}>Kitchen Cookbook</h1>
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
          The Kitchen Cookbook is an easy-to-reference cookbook for our
          family's favorite recipes.
        </p>
      </div>
      <div className={styles.recipeSection} id="recipes">
        <h2>Recipes</h2>
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
            title="Dessert" 
            link="/dessert" 
            imageSrc="/images/dessert.jpg" 
          />
        </div>
      </div>
    </>
  );
}
