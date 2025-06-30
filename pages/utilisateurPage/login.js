import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

const Login = () => {
  const [emailUtil, setEmailUtil] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5002/api/utilisateurLogin",
        {
          emailUtil,
          motsdePasse: password,
        }
      );
      const { utilisateur, token } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("utilisateurEmail", utilisateur.emailUtil);
      localStorage.setItem("nomUtil", utilisateur.nomUtil);
      localStorage.setItem("telephoneUtil", utilisateur.telephoneUtil);


      if (router.pathname !== "/utilisateur/login") {
        router.push("/");
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion!!!", error);
      alert("Identifiant invalide");
    }
  };

  return (
    <div className="bg-gray-100 flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
            Connexion
          </h2>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email:
              </label>
              <div className="mt-1">
                <input
                  name="emailUtil"
                  type="email"
                  autoComplete="email-address"
                  required
                  value={emailUtil}
                  onChange={(e) => setEmailUtil(e.target.value)}
                  className="px-2 py-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe:
              </label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-2 py-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-500 dark:text-gray-500"
                  >
                    Se souvenir de moi
                  </label>
                </div>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Mot de passe oublié?
              </a>
            </div>

            <div>
              <button
                className={`flex w-full justify-center rounded-md border border-transparent bg-sky-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-800 focus:ring-offset-2 ${
                  !rememberMe && "opacity-50 cursor-not-allowed"
                }`}
                disabled={!rememberMe}
                type="submit"
              >
                Se connecter
              </button>
            </div>
            <p className="text-sm font-light text-gray-500 dark:text-blue-700">
              Vous n'avez pas de compte?{" "}
              <Link
                href="/utilisateurPage/signin"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Inscrivez-vous
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
