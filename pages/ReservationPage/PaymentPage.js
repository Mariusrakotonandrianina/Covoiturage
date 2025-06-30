import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import axios from "axios";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PaymentModal from "../../components/PaymentModal";
import Layout from "../../components/Layout";

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [cartItems, setCartItems] = useState([]);
  const [frais, setFrais] = useState(0);
  const [dateReserver, setDateReserver] = useState(new Date());
  const [utilisation, setUtilisation] = useState("");
  const [nombreDeJour, setNombreDeJour] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailUtilisateur, setEmailUtilisateur] = useState("");
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [reservedDates, setReservedDates] = useState([]);
  const [isDateAlreadyReserved, setIsDateAlreadyReserved] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
    updateTotalPrice(cart);

    const email = localStorage.getItem("utilisateurEmail");
    const nom = localStorage.getItem("nomUtil");

    if (email && nom) {
      setEmailUtilisateur(email);
      setNomUtilisateur(nom);
    }

    if (cart.length > 0) {
      fetchReservedDates(cart[0]._id);
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      const isDateReservedFlag = reservedDates.some((date) =>
        isDateReserved(date.dateReserver, date.dateRecuperation)
      );
      setIsDateAlreadyReserved(isDateReservedFlag);
    }
  }, [dateReserver, nombreDeJour, reservedDates, cartItems]);

  const fetchReservedDates = async (locationId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5002/api/getReservedDates`,
        {
          params: { locationId },
        }
      );
      setReservedDates(response.data);

      const isDateReservedFlag = response.data.some((date) =>
        isDateReserved(date.dateReserver, date.dateRecuperation)
      );
      setIsDateAlreadyReserved(isDateReservedFlag);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des dates réservées :",
        error
      );
    }
  };

  const isDateReserved = (startDate, endDate) => {
    const selectedDate = new Date(dateReserver);
    const selectedEndDate = new Date(calculateDateRecuperation());
    const reservedStartDate = new Date(startDate);
    const reservedEndDate = new Date(endDate);

    return (
      (selectedDate >= reservedStartDate && selectedDate <= reservedEndDate) ||
      (selectedEndDate >= reservedStartDate &&
        selectedEndDate <= reservedEndDate) ||
      (selectedDate <= reservedStartDate && selectedEndDate >= reservedEndDate)
    );
  };

  const updateTotalPrice = (cart) => {
    const total = cart.reduce((acc, item) => acc + item.frais, 0);
    setFrais(total);
  };

  const handleRemoveItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    updateTotalPrice(updatedCart);
  };

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  const handlePaymentError = (errorMessage) => {
    toast.error(`Erreur lors de l'achat : ${errorMessage}`);
  };

  const handleModalSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe ou les éléments ne sont pas initialisés.");
      return;
    }

    try {
      const productRequests = cartItems.map(async (item) => {
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
          billing_details: {
            email: emailUtilisateur,
          },
        });

        if (error) {
          handlePaymentError(error.message);
          throw new Error(
            `Erreur lors de la création de la méthode de paiement : ${error.message}`
          );
        }

        const amountInCents = Math.round(item.frais * 100);

        const response = await fetch("http://127.0.0.1:5002/api/Payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amountInCents,
            paymentMethod: paymentMethod.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors du traitement du paiement");
        }

        const paymentData = {
          nom: nomUtilisateur,
          email: emailUtilisateur,
          location: item._id,
          frais: item.frais,
          immatriculation: item.immatriculation,
          paymentMethod: paymentMethod.id,
          dateReserver: dateReserver.toISOString(),
          utilisation: utilisation,
          nombreDeJour: nombreDeJour,
          dateRecuperation: calculateDateRecuperation(),
        };

        await axios.post(
          "http://127.0.0.1:5002/api/createReserLocation",
          paymentData
        );
      });

      await Promise.all(productRequests);
      localStorage.removeItem("cart");
      setCartItems([]);
      toast.success("Réservation effectuée avec succès !", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
      handlePaymentError("Une erreur est survenue lors du paiement.");
      toast.error("Une erreur est survenue lors du paiement");
    }
  };

  const calculateDateRecuperation = () => {
    const date = new Date(dateReserver);
    date.setDate(date.getDate() + nombreDeJour);
    return date.toISOString();
  };

  const handleOpenPaymentModal = () => {
    if (!isDateAlreadyReserved) {
      setIsModalOpen(true);
    } else {
      toast.error("La date sélectionnée est déjà réservée.");
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <ToastContainer />
        <div className="container mx-auto py-8 items-center">
          <h1 className="text-2xl font-semibold mb-4 text-center">
            Réservation
          </h1>
          <div>
            {cartItems.length === 0 ? (
              <p>Aucune voiture sélectionnée</p>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg overflow-hidden shadow p-4 flex flex-wrap mb-1"
                    >
                      <img
                        src={
                          item.imageVehicule &&
                          `/images/${item.imageVehicule.substring(
                            item.imageVehicule.lastIndexOf("/") + 1
                          )}`
                        }
                        width="50px"
                      />
                      <h2 className="text-xl font-semibold m-auto">
                        {item.marque}
                      </h2>
                      <p className="text-gray-600 m-auto truncate">
                        £ {item.frais}
                      </p>
                      <div className="w-full mt-4">
                        <label
                          htmlFor="utilisation"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date réservée
                        </label>
                        <DatePicker
                          selected={dateReserver}
                          onChange={(date) => setDateReserver(date)}
                          className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                        />
                      </div>
                      <div className="w-full mt-2">
                        <label
                          htmlFor="utilisation"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Utilisation
                        </label>
                        <input
                          type="text"
                          id="utilisation"
                          value={utilisation}
                          onChange={(e) => setUtilisation(e.target.value)}
                          className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      <div className="w-full mt-2">
                        <label
                          htmlFor="nombreDeJour"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nombre de jour
                        </label>
                        <input
                          type="number"
                          id="nombreDeJour"
                          value={nombreDeJour}
                          onChange={(e) =>
                            setNombreDeJour(Number(e.target.value))
                          }
                          min="1"
                          className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      <div className="w-full mt-8">
                        <h2 className="text-xl font-semibold mb-4">
                          Dates déjà réservées
                        </h2>
                        <ul>
                          {reservedDates.map((date, index) => (
                            <li key={index}>
                              {new Date(date.dateReserver).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                date.dateRecuperation
                              ).toLocaleDateString()}
                              {isDateReserved(
                                date.dateReserver,
                                date.dateRecuperation
                              ) && (
                                <span className="text-red-500 ml-2">
                                  La date est déjà réservée pour ce véhicule
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-end w-full mt-2">
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md transform transition-transform hover:scale-110"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <p className="text-lg font-semibold">
                    Date de récupération:{" "}
                    {new Date(calculateDateRecuperation()).toLocaleDateString(
                      "fr-CA"
                    )}
                  </p>
                </div>
                <p className="text-lg font-semibold flex justify-end">
                  Montant à payer: ${frais.toFixed(2)}
                </p>
                <div className="flex justify-end mt-4 space-x-4">
                  <button
                    onClick={handleOpenPaymentModal}
                    className="bg-green-800 text-white px-4 py-2 rounded-md transform transition-transform hover:scale-110"
                    disabled={isDateAlreadyReserved}
                  >
                    Payer
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="bg-red-500 text-white px-4 py-2 rounded-md transform transition-transform hover:scale-110"
                  >
                    Vider la liste
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {isModalOpen && (
          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            handleSubmit={(event) => handleModalSubmit(event, stripe, elements)}
          />
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default PaymentPage;
