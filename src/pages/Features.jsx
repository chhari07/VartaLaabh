// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MessageCircle, Edit3, Users, FolderOpen } from 'lucide-react'; // For icons

const features = [
  {
    name: 'BlogBazzar',
    role: '#write or read blog',
    icon: <Edit3 className="w-5 h-5" />,
  },
  {
    name: 'Poochho-bolo',
    role: '#Ask question and give answer',
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    name: 'Samuhik charcha-ek niskarsh',
    role: '#Group chat leading to a conclusion',
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: 'Kaarya Kendra',
    role: '#Shared Workspaces',
    icon: <FolderOpen className="w-5 h-5" />,
  },
];

export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 gap-x-12 lg:grid-cols-2 items-center">

          {/* Left Side - Text and Features */}
          <div className="lg:pr-12">
            <h2 className="text-lg font-semibold text-blue-700 uppercase tracking-wide">
              Discover # वार्ता-लाप
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Empowering Community Voices
            </p>
            <p className="mt-6 text-lg text-gray-700">
            # वार्ता-लाप is your digital space to express, collaborate, and engage with a vibrant community.
              Built for connection, powered by purpose.
            </p>

            <div className="mt-10 space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="group flex items-center gap-4 bg-[#0C1B33]  text-white px-4 py-3 rounded-xl shadow-md  transition-all duration-300 ease-in-out"
                >
                  <div className="flex items-center justify-center bg-white text-blue-700 rounded-full p-2 group-hover:bg-[#0C1B33] group-hover:text-white transition-all">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{feature.name}</p>
                    <p className="text-sm opacity-90">{feature.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex justify-center">
            <img
              className="w-full max-w-md rounded-3xl shadow-2xl border-4 border-blue-100"
              src="https://wallpapercave.com/uwp/uwp4753853.jpeg"
              alt="Community Collaboration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
