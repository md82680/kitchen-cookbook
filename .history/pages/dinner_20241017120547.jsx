import Navbar2 from "../components/Navbar2";
import RecipeCarousel from "../components/RecipeCarousel";

export default function Dinner() {
  const dinnerRecipes = [
    {
      title: "Spaghetti Bolognese",
      description: "A hearty meat sauce with pasta.",
      image: "/spaghetti.jpg",
      recipe: "1. Cook spaghetti. 2. Prepare meat sauce. 3. Combine and serve.",
    },
    {
      title: "Chicken Alfredo",
      description: "Creamy pasta with chicken and Alfredo sauce.",
      image: "/chicken-alfredo.jpg",
      recipe:
        "1. Cook pasta. 2. Prepare Alfredo sauce. 3. Cook chicken. 4. Combine all ingredients.",
    },
    {
      title: "Beef Stroganoff",
      description: "Rich and creamy beef stroganoff with mushrooms.",
      image: "/beef-stroganoff.jpg",
      recipe:
        "1. Cook beef and mushrooms. 2. Prepare sauce. 3. Serve over noodles.",
    },
    // Add more recipes here
  ];

  return (
    <>
      <Navbar2 />
      <div className="p-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Dinner Recipes</h2>
        <RecipeCarousel recipes={dinnerRecipes} />
      </div>
    </>
  );
}
