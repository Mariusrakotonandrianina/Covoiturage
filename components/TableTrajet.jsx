import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus , faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";

const TableTrajet = ({ trajets }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  
  const itemsPerPage = 8;
  const totalPages = trajets ? Math.ceil(trajets.length / itemsPerPage) : 0;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = trajets ? trajets.slice(indexOfFirstItem, indexOfLastItem) : [];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateTrajet) => {
    const date = new Date(dateTrajet);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const generateReservationLink = (trajet) => {
    const { _id, codeTrajet, cooperative, vehicule, nbPlace, frais, dateTrajet, heureDepart } = trajet;
    const query = new URLSearchParams({
      trajetId: _id,
      cooperative: cooperative?.numCoop,
      codeTrajet,
      immatriculation: vehicule?.bus?.immatriculation,
      nombrePlace: nbPlace,
      frais,
      dateTrajet,
      heureDepart
    }).toString();
    return `/ReservationPage/checking?${query}`;
  };
  
  
  

  return (
    <div className="border border-gray-400 shadow-sm rounded-lg overflow-hidden max-w-full mx-auto">
      <table className="w-full text-sm leading-5">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-2 text-center font-medium text-gray-600">Réference</th>
            <th className="py-3 px-2 text-center font-medium text-gray-600">Coopérative</th>
            <th className="py-3 px-3 text-center font-medium text-gray-600">Primus</th>
            <th className="py-3 px-3 text-center font-medium text-gray-600">Trajet</th>
            <th className="py-3 px-2 text-center font-medium text-gray-600">Terminus</th>
            <th className="py-3 px-2 text-center font-medium text-gray-600">Immatriculation</th>
            <th className="py-3 px-2 text-center font-medium text-gray-600">Nombre de Place</th>
            <th className="py-3 px-2 text-center font-medium text-gray-600">Frais(Ar)</th>
            <th className="py-3 px-3 text-center font-medium text-gray-600">Conducteur nom</th>
            <th className="py-3 px-3 text-center font-medium text-gray-600">Date</th>
            <th className="py-3 px-3 text-center font-medium text-gray-600">Heure de départ</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Reserver</span>
            </th>
          </tr>
        </thead>
        <tbody>
        {currentItems.map((trajet, index) => (
          <tr key={trajet._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
            <td className="py-3 px-2 text-center">{trajet.codeTrajet}</td>
            <td className="py-3 px-2 text-center">{trajet.cooperative?.numCoop}</td>
            <td className="py-3 px-3 text-center">{trajet.cooperative?.primus}</td>
            <td className="py-3 px-3 text-center">{trajet.cooperative?.trajet}</td>
            <td className="py-3 px-2 text-center">{trajet.cooperative?.terminus}</td>
            <td className="py-3 px-2 text-center">{trajet.vehicule?.bus?.immatriculation}</td>
            <td className="py-3 px-2 text-center">{trajet.nbPlace}</td>
            <td className="py-3 px-2 text-center">{trajet.frais}</td>
            <td className="py-3 px-3 text-center">{trajet.vehicule?.conducteur?.nom}</td>
            <td className="py-3 px-3 text-center">{formatDate(trajet.dateTrajet)}</td>
            <td className="py-3 px-3 text-center">{trajet.heureDepart}</td>
            <td className="px-3 py-4 text-center">
            <Link href={generateReservationLink(trajet)}>  
                <span className="text-blue-500 hover:text-blue-600 text-sm">
                  <div>
                    <FontAwesomeIcon icon={faBus} className="text-blue-500 hover:text-blue-600 text-xl" />
                  </div>
                  <div>
                    Réserver
                  </div>
                </span>
              </Link>
            </td>          
          </tr>
        ))}

        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-between mt-4 ml-4 mr-4">
          <button disabled={currentPage === 1} onClick={handlePrevPage}>
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl mr-2" /> Précédent
          </button>
          <button disabled={currentPage === totalPages} onClick={handleNextPage}>
            Suivant <FontAwesomeIcon icon={faArrowRight} className="text-xl ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TableTrajet;
