/* eslint-disable react/no-unescaped-entities */
// eslint-disable-next-line no-unused-vars
import React from 'react';

const Samuhik_charcha = () => {
  return (
    <div className="font-sans bg-white rounded-3xl overflow-hidden">
      {/* Top Section with Poster and Description */}
      <section
        className="relative w-full bg-cover bg-center h-96 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px] rounded-b-3xl overflow-hidden"
        style={{
          backgroundImage:
            'url("https://i.pinimg.com/736x/80/34/0f/80340f7db5f0957b7a743a01a35975bb.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 rounded-b-3xl"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 sm:px-8 md:px-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
            Welcome to Samuhik Charcha
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
            Samuhik Charcha is the space for collective dialogue and community engagement.
            Participate in group discussions, share perspectives, and build connections.
            It's a forum where diverse voices come together to foster understanding and collaboration.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 px-4 sm:px-8 md:px-16">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
          Latest Discussions
        </h2>
        {/* Discussions or Polls will be dynamically rendered here */}
      </section>
    </div>
  );
};

export default Samuhik_charcha;
