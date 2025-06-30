import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import axios from "axios";
import TableTrajet from "../../components/TableTrajet";
import ProtectedRoute from "../../components/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MesTrajets = () => {
  const [trajets, setTrajets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTrajet();
  }, []);

  const fetchTrajet = () => {
    axios
      .get("http://127.0.0.1:5002/api/getTrajetDisponible")
      .then((response) => setTrajets(response.data))
      .catch((error) => console.error("Error fetching trajet:", error));
  };

  const searchTrajet = async (term) => {
    setSearchTerm(term);
    if (term === "") {
      toast.warn("Veuillez saisir un terme de recherche", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    try {
      const response = await axios.get(
        `http://127.0.0.1:5002/api/searchTrajet?searchTerm=${term}`
      );
      setTrajets(response.data);
      if (response.data.length === 0) {
        toast.info("Aucun bus trouvé pour ce terme de recherche", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Erreur de la recherche de trajet:", error);
      toast.error("Erreur lors de la recherche des trajets", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      fetchTrajet();
    }
  }, [searchTerm]);

  return (
    <ProtectedRoute>
      <ToastContainer />
      <Layout onSearch={searchTrajet} searchTerm={searchTerm}>
        <div>
          <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-gray-700 text-center">
            Mes trajets
          </h1>
          <div>
            <TableTrajet
              trajets={trajets}
              onSearch={searchTerm}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default MesTrajets;
