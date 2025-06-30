import "../public/globals.css";
import RedirectComponent from "../components/RedirectComponent";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";



function MyApp({ Component, pageProps }) {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const fetchStripeKey = async () => {
      const stripeApiKey = "pk_test_51NxFJkCLci3B102ShP40YR4zulTCx7qg2PH5gjjqr8COKPL1sX9pmMO7nU5rmnEpEJs0Wi1rH6JPdk9k9c8gRFIT00V32OqBz6";
      const stripePromise = await loadStripe(stripeApiKey);
      setStripePromise(stripePromise);
    };

    fetchStripeKey();
  }, []);
  return (
    <>
      <Elements stripe={stripePromise}>
        <RedirectComponent />
        <Component {...pageProps} />
      </Elements>
    </>
  );
}

export default MyApp;
