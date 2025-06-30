import React from 'react';
import Layout from './Layout';

const Home = () => {
  return (
    <Layout>
    <div className="py-4 bg-white dark:bg-gray-900 lg:pt-12 lg:pb-16 h-screen">
      <div className="px-4 mx-auto max-w-8xl lg:px-4 lg:text-center mt-20">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 lg:font-extrabold lg:text-6xl lg:leading-none dark:text-white lg:text-center xl:px-36 lg:mb-7 ">
          Faites vos achats plus facilement sur notre plateforme E-Shop
        </h1>
        <p className="mb-10 text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-center lg:text-xl xl:px-60">
          Decouvrez plusieurs de produits sur E-Shop
        </p>
        <div className="flex flex-col mb-8 md:flex-row lg:justify-center">
          <button className="transition-transform hover:translate-x-2">
            <a
              href="/product/product"
              className="text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-base px-6 py-2.5 text-center md:mr-5 mb-3 md:mb-0 inline-flex items-center justify-center"
            >
              Faire mes achats
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white ml-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1"
                />
              </svg>
            </a>
          </button>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default Home