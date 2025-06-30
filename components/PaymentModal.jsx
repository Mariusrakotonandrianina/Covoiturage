import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const PaymentModal = ({ isOpen, onClose, handleSubmit }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe) {
    console.error("Stripe n'est pas initialisé.");
    return;
  }

  if (!elements) {
    console.error("Elements de Stripe ne sont pas initialisés.");
    return;
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    
    if (stripe && elements) {
      try {
        await handleSubmit(event, stripe, elements);
        onClose();
      } catch (error) {
        setError(error.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : "modal-closed"}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-header">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto my-10">
              <div className="text-center">
                <h2 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-400">
                  Formulaire de Paiement
                </h2>
              </div>
              <div className="m-7">
                <div className="relative p-12 bg-white shadow-sm sm:rounded-xl">
                  <form onSubmit={handleFormSubmit} className="w-full">
                    <div className="mb-4">
                      <label htmlFor="card-element" className="block text-gray-700 text-sm font-bold mb-2">
                        Carte de crédit
                      </label>
                      <CardElement id="card-element" className="w-full p-4 border border-gray-300 rounded" />
                    </div>
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="text-right mt-2 mr-4 mb-2">
                      <button type="submit" disabled={submitting} className={`px-1 py-1 bg-blue-400 hover:bg-blue-600 text-white rounded ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {submitting ? 'Traitement en cours...' : 'Valider'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
