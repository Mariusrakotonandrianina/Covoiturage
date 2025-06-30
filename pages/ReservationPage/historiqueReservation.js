import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const historiqueReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [utilisateurEmail, setUtilisateurEmail] = useState("");

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("fr-FR");
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("utilisateurEmail");

    if (storedEmail) {
      setUtilisateurEmail(storedEmail);
    }
    console.log(utilisateurEmail);
    fetchReservation();
  }, [utilisateurEmail]);

  const fetchReservation = () => {
    axios
      .get(
        `http://127.0.0.1:5002/api/getReservationsByUser?userEmail=${utilisateurEmail}`
      )
      .then((response) => setReservations(response.data))
      .catch((error) => console.error("Error fetching Reservation", error));
  };

  const itemsPerPage = 8;
  const totalPages = reservations
    ? Math.ceil(reservations.length / itemsPerPage)
    : 0;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reservations
    ? reservations.slice(indexOfFirstItem, indexOfLastItem)
    : [];

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

  return (
    <ProtectedRoute>
      <Layout>
        <div>
          <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-gray-700 text-center">
            Historique de réservation
          </h1>
          {utilisateurEmail ? (
            <div className="border border-gray-400 shadow-sm rounded-lg overflow-hidden max-w-full mx-auto">
              <table className="w-full text-sm leading-5">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-2 text-center font-medium text-gray-600">
                      Réference
                    </th>
                    <th className="py-3 px-2 text-center font-medium text-gray-600">
                      Ref Trajet
                    </th>
                    <th className="py-3 px-2 text-center font-medium text-gray-600">
                      Ref payment
                    </th>
                    <th className="py-3 px-3 text-center font-medium text-gray-600">
                      Primus
                    </th>
                    <th className="py-3 px-3 text-center font-medium text-gray-600">
                      Trajet
                    </th>
                    <th className="py-3 px-2 text-center font-medium text-gray-600">
                      Terminus
                    </th>
                    <th className="py-3 px-2 text-center font-medium text-gray-600">
                      Immatriculation
                    </th>
                    <th className="py-3 px-2 text-center font-medium text-gray-600">
                      Nombre de Place
                    </th>
                    <th className="py-3 px-2 text-center font-medium text-gray-600">
                      Frais(Ar)
                    </th>
                    <th className="py-3 px-3 text-center font-medium text-gray-600">
                      Num place
                    </th>
                    <th className="py-3 px-3 text-center font-medium text-gray-600">
                      Nom conducteur
                    </th>
                    <th className="py-3 px-3 text-center font-medium text-gray-600">
                      Date Trajet
                    </th>
                    <th className="py-3 px-3 text-center font-medium text-gray-600">
                      Heure de départ
                    </th>
                    <th className="py-3 px-3 text-center font-medium text-gray-600">
                      Date reser
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((reservation, index) => (
                    <tr
                      key={reservation._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    >
                      <td className="py-3 px-2 text-center">
                        {reservation.codeReser}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {reservation.trajet?.codeTrajet}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {reservation.paymentMethod}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {reservation.trajet?.cooperative?.primus}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {reservation.trajet?.cooperative?.trajet}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {reservation.trajet?.cooperative?.terminus}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {reservation.trajet?.vehicule?.bus?.immatriculation}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {reservation.nbPlaceReserver}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {reservation.fraisPayer}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {reservation.numPlace.join(", ")}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {reservation.trajet?.vehicule?.conducteur?.nom}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {formatDate(reservation.trajet?.dateTrajet)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {reservation.trajet?.heureDepart}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {formatDate(reservation.dateReser)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex justify-between mt-4 ml-4 mr-4">
                  <button disabled={currentPage === 1} onClick={handlePrevPage}>
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className="text-xl mr-2"
                    />
                    Précédent
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                  >
                    Suivant
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-xl ml-2"
                    />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>Veuillez vous connecter pour réserver des places.</p>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default historiqueReservation;
