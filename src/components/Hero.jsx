 
 
// eslint-disable-next-line no-unused-vars
import React from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";  // Ensure this import is correct for your project

const Hero = () => {
  return (
    <section className="relative bg-white text-black overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-12 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="mb-8 text-5xl font-extrabold tracking-wide sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="inline-block px-4 align-middle">
              <span className="block text-[#0C1B33] text-6xl sm:text-5xl md:text-6xl lg:text-8xl">
                <Typewriter
                  options={{
                    strings: ["# वार्ता-लाप"],
                    autoStart: true,
                    loop: true,
                    cursor: "|",
                    typeSpeed: 100,
                    deleteSpeed: 50,
                    delaySpeed: 2000,
                  }}
                />
              </span>
            </span>
            <br />
            
          </h1>
          <h2  className="block text-[#0C1B33]  text-5xl   md:text-5xl  mb-4 lg:text-7xl"  > मात्र चर्चा नहीं, संस्कारों का संवाहक;   </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl lg:text-2xl text-black">
            Whether you&apos;re here to ask questions, share knowledge, or engage in meaningful discussions, you&apos;ve found the right community.
          </p>
          <div className="flex justify-center">
            <motion.a
              href="#"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              className="relative flex items-center text-white justify-center px-10 py-4 font-semibold text-lg rounded-lg bg-[#0C1B33] transition-all"
            >
              Get Started
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mt-16 mx-auto h-[550px] w-full max-w-5xl"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-black/50 to-black"></div>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Roadside_Tea_Shop_-_Dock_Eastern_Boundary_Road_-_Kidderpore_-_Kolkata_2016-01-24_9099.JPG/1280px-Roadside_Tea_Shop_-_Dock_Eastern_Boundary_Road_-_Kidderpore_-_Kolkata_2016-01-24_9099.JPG"
            alt="Roadside tea shop in Kolkata"
            className="h-full w-full rounded-xl object-cover shadow-2xl"
          />
          <div className="absolute bottom-6 left-6 text-2xl font-bold text-white bg-black/60 px-6 py-3 rounded-lg">
            Join the Movement 🚀
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
