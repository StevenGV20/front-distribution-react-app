import React from "react";

const OpcionCardComponent = ({ route }) => {
  return (
    <div className="border-2 border-gray-400 w-full text-black grid grid-cols-1 h-80 md:h-72 content-center">
      <div className="py-4 w-full h-48 place-content-center justify-center content-center">
        <div className="scale-100 md:scale-125 w-full flex justify-center text-center mb-4">{route.icon}</div>
      </div>
      <h3 className="w-full text-center font-bold px-4 content-center">
        {route.name}
      </h3>
    </div>
  );
};

export default OpcionCardComponent;
