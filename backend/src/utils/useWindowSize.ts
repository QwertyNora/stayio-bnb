import { useState, useEffect } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0, // Sätt ett initialt värde till 0 istället för undefined
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Sätt storleken vid första renderingen

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
