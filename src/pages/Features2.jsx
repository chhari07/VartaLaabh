// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Features3D = () => {
  const teamMembers = [
    {
      name: 'BlogBazzar',
      role: '#write or read blog',
      image: 'https://wallpapercave.com/uwp/uwp4753848.jpeg',
      path: '/blogbazzar',
    },
    {
      name: 'Poochho-bolo',
      role: '#Ask question and give answer',
      image: 'https://wallpapercave.com/uwp/uwp4753849.jpeg',
      path: '/poochho-bolo',
    },
    {
      name: 'Samuhik charcha-ek niskarsh',
      role: '#leading to a conclusion',
      image: 'https://wallpapercave.com/uwp/uwp4753851.jpeg',
      path: '/samuhik-charcha',
    },
    {
      name: 'Kaarya Kendra',
      role: '#Shared Workspaces',
      image: 'https://wallpapercave.com/uwp/uwp4753852.jpeg',
      path: '/kaarya-kendra',
    },
  ];

  return (
    <div className="max-w-screen-xl mt-24 px-5 py-12 mx-auto">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Explore Our Features
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Link to={member.path}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
                  <h3 className="text-xl font-semibold truncate">{member.name}</h3>
                  <p className="text-sm text-slate-300 mt-1 truncate">{member.role}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features3D;
