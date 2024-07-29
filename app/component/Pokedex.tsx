import { log } from "console";
import React, { useEffect, useState } from "react";

const Pokedex = () => {
  const [elements, setElements] = useState([1, 2, 3, 4]);

  function PokemonList() {
    let tempElements = [];
    for (let i = 1; i <= 151; i++) {
      tempElements.push(i);
    }
    return tempElements;
    // setElements(tempElements);
  }

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/hello");
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching the data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setElements(PokemonList());
  }, []);

  //   PokemonList();

  return (
    <div className="w-full h-full flex flex-wrap">
      {elements.map((ele) => {
        return <div className="p-2 h-fit w-fit">{ele}</div>;
      })}
      {message}
    </div>
  );
};

export default Pokedex;
