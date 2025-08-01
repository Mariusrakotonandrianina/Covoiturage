import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const Signin = () => {
  const [nomUtil, setNomUtil] = useState("");
  const [emailUtil, setEmailUtil] = useState("");
  const [numCINUtil, setNumCINUtil] = useState("");
  const [telephoneUtil, setTelephoneUtil] = useState("");
  const [motsdePasse, setMotsdePasse] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({}); // Déclaration de validationErrors
  const router = useRouter();

  const isValidEmail = (emailUtil) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailUtil)) {
      return {
        valid: false,
        error: "Veuillez insérer un email valide",
      };
    }
    return {
      valid: true,
    };
  };

  const addUtilisateur = async (e) => {
    e.preventDefault();

    setValidationErrors({});

    const errors = {};

    if (
      !nomUtil ||
      !emailUtil ||
      !numCINUtil ||
      !telephoneUtil ||
      !motsdePasse ||
      !confirmPassword
    ) {
      errors.fields = "Veuillez remplir tous les champs";
    }

    const emailValidation = isValidEmail(emailUtil);
    if (!emailValidation.valid) {
      errors.emailUtil = emailValidation.error;
    }

    if (motsdePasse !== confirmPassword) {
      errors.password = "La confirmation du mot de passe est incorrecte";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors); // Définition des erreurs de validation
      return;
    }

    try {
      const response = await axios.post(
        "",
        {
          motsdePasse,
          numCINUtil,
          nomUtil,
          emailUtil,
          telephoneUtil,
        }
      );
      console.log(response.data);
      toast.success("Inscription effectuée correctement", {
        position: "top-center",
        theme: "colored",
      });
      if (router.pathname !== "/utilisateurPage/login") {
        router.push("/utilisateurPage/login");
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'envoi des données:",
        error
      );
      toast.error("Inscription echoué", {
        position: "top-center",
        theme: "colored",
      });
    }
  };
  return (
    <div>
      <ToastContainer/>
      <div className="bg-gray-100 flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white shadow-md rounded-md p-6">
            <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
              Inscription
            </h2>
            <form className="space-y-3" onSubmit={addUtilisateur}>
              <div>
                <label
                  htmlFor="nom"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom:
                </label>
                <div className="mt-1">
                  <input
                    name="username"
                    type="username"
                    required=""
                    onChange={(e) => setNomUtil(e.target.value)}
                    className="px-2 py-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email:
                </label>
                <div className="mt-1">
                  <input
                    name="email"
                    type="email-address"
                    autoComplete="email-address"
                    require=""
                    onChange={(e) => setEmailUtil(e.target.value)}
                    className="px-2 py-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="numCINUtil"
                  className="block text-sm font-medium text-gray-700"
                >
                  Numero CIN:
                </label>
                <div className="mt-1">
                  <input
                    name="nunCINUtil"
                    type="text"
                    autoComplete="numCINUtil"
                    maxLength={12}
                    onKeyPress={(e) => {
                        if (isNaN(Number(e.key))) {
                          e.preventDefault();
                        }
                      }}
                    required=""
                    onChange={(e) => setNumCINUtil(e.target.value)}
                    className="px-2 py-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="telephone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Téléphone:
                </label>
                <div className="mt-1">
                  <input
                    name="telephoneUtil"
                    type="text"
                    autoComplete="telephoneUtil"
                    maxLength={10}
                    onKeyPress={(e) => {
                        if (isNaN(Number(e.key))) {
                          e.preventDefault();
                        }
                      }}
                    required=""
                    onChange={(e) => setTelephoneUtil(e.target.value)}
                    className="px-2 py-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mots de passe:
                </label>
                <div className="mt-1">
                  <input
                    name="password"
                    type="password"
                    autoComplete="password"
                    required=""
                    onChange={(e) => setMotsdePasse(e.target.value)}
                    className="px-2 py-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmation mots de passe:
                </label>
                <div className="mt-1">
                  <input
                    name="confirm_password"
                    type="password"
                    autoComplete="confirm-password"
                    required=""
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="px-2 py-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-800 focus:ring-offset-2"
                >
                  S'inscrire
                </button>
              </div>
            </form>
            {validationErrors.fields && (
              <p className="text-red-500 text-sm">{validationErrors.fields}</p>
            )}
            {validationErrors.emailUtil && (
              <p className="text-red-500 text-sm">
                {validationErrors.emailUtil}
              </p>
            )}
            {validationErrors.password && (
              <p className="text-red-500 text-sm">
                {validationErrors.password}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
