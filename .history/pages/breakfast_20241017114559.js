import Navbar2 from "../components/Navbar2";
import Carousel from "../components/Carousel";

export default function Breakfast() {
  const breakfastRecipes = [
    {
      title: "Spaghetti Bolognese",
      description: "A hearty meat sauce with pasta.",
      image: "/spaghetti.jpg",
    },
    {
      title: "Chicken Alfredo",
      description: "Creamy pasta with chicken and Alfredo sauce.",
      image: "/chicken-alfredo.jpg",
    },
    {
      title: "Beef Stroganoff",
      description: "Rich and creamy beef stroganoff with mushrooms.",
      image: "/beef-stroganoff.jpg",
    },
    // Add more recipes here
  ];

  return (
    <>
      <Navbar2 />
      <div className="p-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Dinner Recipes</h2>
        {/* Center Carousel */}
        <Carousel recipes={dinnerRecipes} />
      </div>
    </>
  );
}
