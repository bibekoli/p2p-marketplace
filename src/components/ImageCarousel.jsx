import Image from "next/image";
import { Icon } from "@iconify/react";

const PrevNextButton = ({ type, show, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute bg-indigo-500 shadow-md hover:bg-indigo-600 border border-indigo-300 top-1/2 transform -translate-y-1/2 ${ type === "prev" ? "left-0" : "right-0" }`}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 16px",
        display: show ? "flex" : "none"
      }}>
      {
        type === "prev" ? (
          <Icon icon="mingcute:left-fill" width={30} className="text-white" />
        ) : (
          <Icon icon="mingcute:right-fill" width={30} className="text-white" />
        )
      }
    </button>
  );
};

export default function ImageCarousel({ images, activeImageIndex, setActiveImageIndex }) {
  const handlePrevClick = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    }
  };
  
  const handleNextClick = () => {
    if (activeImageIndex < images.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    }
  };

  return (
    <div className="relative w-full max-w-screen-lg mx-auto shadow-lg rounded-xl">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${activeImageIndex * 100}%)`
          }}>
          {
            images.map((image, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0">
                <Image
                  src={ image + "?w=512&h=512" }
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                  height={512}
                  width={512}
                />
              </div>
            ))
          }
        </div>
      </div>
      <PrevNextButton type="prev" show={activeImageIndex > 0} onClick={handlePrevClick} />
      <PrevNextButton type="next" show={activeImageIndex < images.length - 1} onClick={handleNextClick} />
    </div>
  );
}