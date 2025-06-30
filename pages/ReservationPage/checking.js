import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import PaymentModal from "../../components/PaymentModal";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";

const CheckBox = () => {
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [emailUtilisateur, setEmailUtilisateur] = useState("");
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const router = useRouter();
  const { trajetId, codeTrajet, frais, immatriculation } = router.query;
  const [reservedPlaces, setReservedPlaces] = useState([]);

  useEffect(() => {
    const storedPlaces =
      JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    setSelectedPlaces(storedPlaces);

    const email = localStorage.getItem("utilisateurEmail");
    const nom = localStorage.getItem("nomUtil");

    if (email && nom) {
      setEmailUtilisateur(email);
      setNomUtilisateur(nom);
    }
    console.log(email);
    console.log(nom);
    console.log(immatriculation);
    console.log(trajetId);

    const fetchReservedPlaces = async () => {
      try {
        const reserved = await checkReservationStatus(trajetId);
        setReservedPlaces(reserved);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des places réservées :",
          error
        );
      }
    };
    fetchReservedPlaces();
  }, []);

  const isPlaceReserved = (placeId) => reservedPlaces.includes(placeId);

  const handleCheckboxChange = async (event, placeId) => {
    const { checked } = event.target;

    if (isPlaceReserved(placeId)) {
      return;
    }

    if (checked) {
      setSelectedPlaces((prevSelected) => [...prevSelected, placeId]);
    } else {
      setSelectedPlaces((prevSelected) =>
        prevSelected.filter((place) => place !== placeId)
      );
    }
  };

  const checkReservationStatus = async (trajetId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5002/api/reservedPlaces?trajetId=${trajetId}`
      );
      return response.data.reservedPlaces;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de la réservation :",
        error
      );
      return [];
    }
  };

  const countSelectedPlaces = () => {
    return selectedPlaces.length;
  };

  const calculateTotalAmount = () => {
    const selectedPlacesCount = countSelectedPlaces();
    return selectedPlacesCount * frais;
  };

  const handlePayment = async () => {
    if (selectedPlaces.length === 0) {
      toast.info("Aucun place reservé!!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCancelReservation = () => {
    setShowModal(false);
    setSelectedPlaces([]);
    localStorage.removeItem("selectedPlaces");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe) {
      console.error("Stripe n'est pas initialisé.");
      return;
    }

    if (!elements) {
      console.error("Elements de Stripe ne sont pas initialisés.");
      return;
    }

    if (!validatePaymentData()) {
      console.error("Les données de paiement sont incorrectes.");
      return;
    }

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          email: emailUtilisateur,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const amount = calculateTotalAmount();
      const nbPlaceReserver = countSelectedPlaces();

      const response = await axios.post(
        "http://127.0.0.1:5002/api/processPayment",
        {
          amount: amount,
          paymentMethod: paymentMethod.id,
        }
      );

      const paymentData = {
        nom: nomUtilisateur,
        email: emailUtilisateur,
        trajet: codeTrajet,
        frais: frais,
        paymentMethod: paymentMethod.id,
        nbPlaceReserver,
        numPlace: selectedPlaces,
        fraisPayer: amount,
        immatriculation: immatriculation,
      };

      console.log("paymentData:", {
        nom: nomUtilisateur,
        email: emailUtilisateur,
        frais: frais,
        paymentMethod: paymentMethod.id,
        nbPlaceReserver,
        numPlace: selectedPlaces,
        fraisPayer: amount,
        immatriculation: immatriculation,
      });

      await axios.post(
        "http://127.0.0.1:5002/api/createReservation",
        paymentData
      );

      toast.success("Réservation effectuée avec succès !", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setSelectedPlaces([]);
      localStorage.removeItem("selectedPlaces");
      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
      toast.error(`Erreur lors du paiement`, {
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

  const validatePaymentData = () => {
    return true;
  };

  return (
    <Layout>
      <ToastContainer />
      <div>
        <h3 className="mb-4 font-semibold text-gray-900 text-center">
          Resever de place
        </h3>
        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-300 dark:border-gray-600 dark:text-white">
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <label
                htmlFor="angular-checkbox-list"
                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700"
              >
                Chauffeur
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3"></div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={1}
                onChange={(event) => handleCheckboxChange(event, 1)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(1) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(1)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                1
              </label>
            </div>
          </li>
          <li className="w-full dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={2}
                onChange={(event) => handleCheckboxChange(event, 2)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(2) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(2)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                2
              </label>
            </div>
          </li>
        </ul>
        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-300 dark:border-gray-600 dark:text-white mt-5">
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={3}
                onChange={(event) => handleCheckboxChange(event, 3)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(3) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(3)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                3
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={4}
                onChange={(event) => handleCheckboxChange(event, 4)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(4) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(4)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                4
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={5}
                onChange={(event) => handleCheckboxChange(event, 5)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(5) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(5)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                5
              </label>
            </div>
          </li>
          <li className="w-full dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={6}
                onChange={(event) => handleCheckboxChange(event, 6)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(6) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(6)}
              />
              <label
                htmlFor="laravel-checkbox-list"
                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700"
              >
                6
              </label>
            </div>
          </li>
        </ul>
        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-300 dark:border-gray-600 dark:text-white mt-5">
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={7}
                onChange={(event) => handleCheckboxChange(event, 7)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(7) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(7)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                7
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={8}
                onChange={(event) => handleCheckboxChange(event, 8)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(8) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(8)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                8
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={9}
                onChange={(event) => handleCheckboxChange(event, 9)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(9) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(9)}
              />
              <label
                htmlFor="angular-checkbox-list"
                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700"
              >
                9
              </label>
            </div>
          </li>
          <li className="w-full dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={10}
                onChange={(event) => handleCheckboxChange(event, 10)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(10) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(10)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                10
              </label>
            </div>
          </li>
        </ul>
        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-300 dark:border-gray-600 dark:text-white mt-5">
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={11}
                onChange={(event) => handleCheckboxChange(event, 11)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(11) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(11)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                11
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={12}
                onChange={(event) => handleCheckboxChange(event, 12)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(12) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(12)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                12
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={13}
                onChange={(event) => handleCheckboxChange(event, 13)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(13) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(13)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                13
              </label>
            </div>
          </li>
          <li className="w-full dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={14}
                onChange={(event) => handleCheckboxChange(event, 14)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(14) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(14)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                14
              </label>
            </div>
          </li>
        </ul>
        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-300 dark:border-gray-600 dark:text-white mt-5">
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={15}
                onChange={(event) => handleCheckboxChange(event, 15)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(15) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(15)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                15
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={16}
                onChange={(event) => handleCheckboxChange(event, 16)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(16) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(16)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                16
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={17}
                onChange={(event) => handleCheckboxChange(event, 17)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(17) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(17)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                17
              </label>
            </div>
          </li>
          <li className="w-full dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={18}
                onChange={(event) => handleCheckboxChange(event, 18)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(18) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(18)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                18
              </label>
            </div>
          </li>
        </ul>
        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-300 dark:border-gray-600 dark:text-white mt-5">
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={19}
                onChange={(event) => handleCheckboxChange(event, 19)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(19) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(19)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                19
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={20}
                onChange={(event) => handleCheckboxChange(event, 20)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(20) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(20)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                20
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={21}
                onChange={(event) => handleCheckboxChange(event, 21)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(21) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(21)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                21
              </label>
            </div>
          </li>
          <li className="w-full dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                type="checkbox"
                value={22}
                onChange={(event) => handleCheckboxChange(event, 22)}
                className={`w-4 h-4 text-blue-600 bg-gray-${
                  isPlaceReserved(22) ? "900" : "100"
                } border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                disabled={isPlaceReserved(22)}
              />
              <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                22
              </label>
            </div>
          </li>
        </ul>
        <div className="flex justify-end mt-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            onClick={handlePayment}
            disabled={selectedPlaces.length === 0}
          >
            Resérver
          </button>
          <button
            onClick={handleCancelReservation}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded ms-2"
          >
            Annuler
          </button>
        </div>
        {showModal && (
          <PaymentModal
            onClose={handleCloseModal}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </Layout>
  );
};

export default CheckBox;
