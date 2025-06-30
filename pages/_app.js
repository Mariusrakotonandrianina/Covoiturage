import "../public/globals.css";
import RedirectComponent from "../components/RedirectComponent";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";



function MyApp({ Component, pageProps }) {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const fetchStripeKey = async () => {
      const stripeApiKey = "";
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
