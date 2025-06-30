import React, { useState, useEffect } from "react";
import CardLocation from "../../components/CardLocation";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import Link from "next/link";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";

const Location = () => {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5002/api/getLocation");
        setLocations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (searchTerm === "") {
      fetchData();
    } else {
      searchLocation(searchTerm);
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, [searchTerm]);

  const searchLocation = async (term) => {
    setSearchTerm(term);
    if (term === "") {
      console.warn("Veuillez saisir un terme de recherche");
      return;
    }
    try {
      const response = await axios.get(
        `http://127.0.0.1:5002/api/searchLocation?searchTerm=${term}`
      );
      setLocations(response.data);
      if (response.data.length === 0) {
        console.info("Aucun location trouvé pour ce terme de recherche");
      }
    } catch (error) {
      console.error("Erreur de la recherche de location:", error);
      console.error("Erreur lors de la recherche des locations");
    }
  };

  const handleLocation = (location) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(location);
    setCartCount(cart.length);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <ProtectedRoute>
      <Layout onSearch={searchLocation} searchTerm={searchTerm}>
        <nav>
          <div className="flex flex-row">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-gray-700 text-center">
              Nos voitures
            </h1>
            <div className="ml-auto mt-5 flex flex-row ">
              <Link href="/ReservationPage/PaymentPage">
                <button className="mr-7 font-semibold text-xl ">
                  <div className="flex flex-col items-center shadow-lg rounded-lg px-4 py-3">
                    <FontAwesomeIcon icon={faCarSide} className="w-8 h-8 text-gray-800 dark:text-black" />
                    <span className="mt-2">Réservé</span>
                    <div className="w-6 h-6 bg-green-800 rounded-full flex items-center justify-center text-white mt-1">
                      <span className="text-lg font-bold">{cartCount}</span>
                    </div>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </nav>
        <div className="container mx-auto py-8">
          {loading ? (
            "Chargement..."
          ) : locations.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {locations.map((item) => (
                <CardLocation
                  key={item._id}
                  marque={item.marque}
                  imageUrl={`/images/${item.imageVehicule}`}
                  nbPlace={item.nbPlace}
                  frais={item.frais}
                  onLocation={() => handleLocation(item)}
                />
              ))}
            </div>
          ) : (
            <p>Aucun location disponible pour le moment.</p>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Location;
