// eslint-disable-next-line no-unused-vars
import React from "react";
import { FaRobot, FaComments, FaBell, FaUsersCog } from "react-icons/fa"; // Updated icons for more relevance

const Howitworks = () => {
  return (
    <section className="py-12 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black sm:text-4xl xl:text-5xl">
            How Does #वार्ता-लाप Work?
          </h2>
          <p className="max-w-2xl mx-auto mt-5 text-base font-normal text-black">
            Vaarta Laab is your all-in-one intelligent platform to ask questions, join discussions, stay informed, and grow within a vibrant, AI-supported community.
          </p>
        </div>

        <div className="flex flex-col items-center max-w-md mx-auto mt-8 lg:mt-20 lg:flex-row lg:max-w-none lg:space-x-6">
          {/* Step 1: AI-Enhanced Q&A */}
          <div className="relative flex-1 w-full bg-white border border-gray-200 rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="py-8 px-9">
              <div className="inline-flex items-center justify-center w-12 h-12 text-base font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full">
                <FaRobot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-black mt-2">AI-Enhanced Q&A</h3>
              <p className="mt-4 text-lg font-medium text-gray-700">
                Ask questions and receive precise, AI-suggested responses while contributing your insights to help others in the community.
              </p>
            </div>
          </div>

          {/* Step 2: Forums */}
          <div className="relative flex-1 w-full mt-8 lg:mt-0 bg-white border border-gray-200 rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="py-8 px-9">
              <div className="inline-flex items-center justify-center w-12 h-12 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-full">
                <FaComments className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-black mt-2">Topic-Based Forums</h3>
              <p className="mt-4 text-lg font-medium text-gray-700">
                Dive into engaging, real-time discussions organized by interests and trends. Discover ideas, collaborate, and express your voice.
              </p>
            </div>
          </div>

          {/* Step 3: Smart Notifications */}
          <div className="relative flex-1 w-full mt-8 lg:mt-0 bg-white border border-gray-200 rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="py-8 px-9">
              <div className="inline-flex items-center justify-center w-12 h-12 text-base font-bold text-white bg-gradient-to-r from-blue-500 to-sky-600 rounded-full">
                <FaBell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-black mt-2">Stay Informed</h3>
              <p className="mt-4 text-lg font-medium text-gray-700">
                Get real-time alerts for responses, trending discussions, and content tailored to your preferences via smart AI notifications.
              </p>
            </div>
          </div>

          {/* Step 4: Community & Growth */}
          <div className="relative flex-1 w-full mt-8 lg:mt-0 bg-white border border-gray-200 rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="py-8 px-9">
              <div className="inline-flex items-center justify-center w-12 h-12 text-base font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                <FaUsersCog className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-black mt-2">Community Recognition</h3>
              <p className="mt-4 text-lg font-medium text-gray-700">
                Earn recognition, badges, and grow your presence by helping others and shaping the future of Vaarta Laab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Howitworks;
