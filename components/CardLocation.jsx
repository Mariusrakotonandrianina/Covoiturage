import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";

const CardLocation = ({ marque, nbPlace, frais, imageUrl, onLocation }) => {
  return (
    <div className="relative group bg-white rounded-lg overflow-hidden shadow-xl transition-transform transform hover:scale-105">
      <div
        className="bg-cover bg-center h-40 transition-transform transform group-hover:scale-100 mt-3"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: "175px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="p-4">
        <h2 className="text-xl font-semibold ml-6">{marque}</h2>
        <div className="flex mx-8">
            <p className="text-gray-600 truncate w-full">{nbPlace} places</p>
            <p className="text-green-600">${frais}</p>
        </div>

        <div className="flex justify-center">
          <button
            className="text-white bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-2 focus:outline-none dark:focus:ring-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={onLocation}
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarCheck} className="w-[20px] h-[20px] text-white" />
              <div className="ml-3">Réserver</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardLocation;
