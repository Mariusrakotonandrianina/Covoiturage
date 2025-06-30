import React from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Index = () => {
  const router = useRouter();
  return (
    <div>
      <ProtectedRoute>
        <Layout>
          <div
            className="py-4 dark:bg-gray-100 lg:pt-12 lg:pb-16 h-screen bg-cover bg-center bg-no-repeat mt-0"
            style={{
              backgroundImage: `url("/images/bgUtil.jpg")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="px-4 mx-auto max-w-8xl lg:px-4 lg:text-center mt-20">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 lg:font-extrabold lg:text-6xl lg:leading-none dark:text-blue-300 lg:text-center xl:px-36 lg:mb-7 ">
                Faites vos recherches et vos réservations
              </h1>
              <p className="mb-10 text-lg font-normal text-gray-200 dark:text-blue-500 lg:text-center lg:text-xl xl:px-60">
                Découvrez plusieurs trajets et nouveaux circuits
              </p>
              <div className="flex flex-col mb-8 md:flex-row lg:justify-center">
                <button className="transition-transform hover:translate-x-2">
                  <Link
                    href="/Trajet/MesTrajets"
                    className="text-white bg-blue-500 hover:bg-blue-400 dark:bg-blue-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500 font-medium rounded-lg text-base px-6 py-2.5 text-center md:mr-5 mb-3 md:mb-0 inline-flex items-center justify-center"
                  >
                    Mes trajets
                    <FontAwesomeIcon
                      icon={faBus}
                      className="text-white hover:text-white text-xl"
                    />
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    </div>
  );
};

export default Index;
