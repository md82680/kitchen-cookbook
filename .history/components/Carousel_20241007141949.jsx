import { useState } from "react";
import Image from "next/image";

const Carousel = ({ recipes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? recipes.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === recipes.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {recipes.map((recipe, index) => (
            <div
              key={index}
              className="min-w-full h-96 flex items-center justify-center"
            >
              <Image
                src={recipe.image}
                alt={recipe.title}
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <h3 className="text-2xl font-bold">{recipe.title}</h3>
                <p className="text-lg">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Navigation Buttons */}
      <button
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg focus:outline-none"
        onClick={prevSlide}
      >
        ‹
      </button>
      <button
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg focus:outline-none"
        onClick={nextSlide}
      >
        ›
      </button>
    </div>
  );
};

export default Carousel;
