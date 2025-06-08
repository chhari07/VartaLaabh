/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Link } from "react-router-dom";
const Wallofprotest = () => {
  const [showModal, setShowModal] = useState(false);
  const [protests, setProtests] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    pollEnabled: false,
    pollQuestion: '',
    option1: '',
    option2: '',
    tags: '',
    media: null,
    mediaType: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'media' && files.length > 0) {
      const file = files[0];
      const fileURL = URL.createObjectURL(file);
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';
      setFormData({
        ...formData,
        media: fileURL,
        mediaType,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProtests([...protests, formData]);
    setFormData({
      title: '',
      message: '',
      pollEnabled: false,
      pollQuestion: '',
      option1: '',
      option2: '',
      tags: '',
      media: null,
      mediaType: '',
    });
    setShowModal(false);
  };

  return (
    <div>
      {/* Banner */}
   <section
  className="relative w-full bg-cover bg-center h-60 md:h-96 rounded-3xl overflow-hidden mb-4 md:mb-6"
  style={{
    backgroundImage: `url("https://i.pinimg.com/736x/2f/c5/8d/2fc58dbad4543a1383ad34d35eb2bf91.jpg")`,
  }}
>
  <div className="absolute inset-0 bg-black opacity-50" />
  <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6 text-center">
    <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide">
      WALL OF THE PROTEST
    </h1>
    <p className="text-md md:text-xl mt-3 max-w-lg">
      " # Built to Hold Stories, Not Just Bricks."
    </p>
  </div>
</section>

{/* Button placed below banner */}
<div className="flex justify-center ">
  <button
    onClick={() => setShowModal(true)}
    className="px-4 py-2 bg-black   text-white   font-semibold    rounded-b-2xl   mb-9    transition"
  >
    + Start New Protest
  </button>
</div>

     <div className="grid grid-cols-1 gap-10 px-4 md:px-12 mb-16">
  {protests.map((protest, index) => (
    <div
      key={index}
      className="relative group h-64 md:h-80 w-full overflow-hidden rounded-2xl shadow-lg"
    >
      {/* Media (Image/Video) */}
      {protest.mediaType === 'image' ? (
        <img
          src={protest.media}
          alt="Protest"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <video
          src={protest.media}
          controls
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}

      {/* Overlay for dim background */}
      <div className="absolute inset-0  bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-500"></div>

      {/* Slide-in Text Content */}
    <Link to="/protestwall" className="block">  </Link>
      <div className="absolute top-0 right-0 h-full w-0 group-hover:w-1/2 transition-all  sm:text-2xl   duration-500 bg-white/90 p-6 flex flex-col justify-center overflow-hidden">
        <h2 className="text-2xl font-bold    text-black mb-2">#{protest.title}</h2>
        <p className="text-sm text-indigo-600 mb-2 font-semibold">
          {protest.tags}
        </p>
        <p className="text-gray-700 lg:mr-6  mb-4">{protest.message}</p>
        {protest.pollEnabled && (
          <div className="text-sm text-gray-800 mt-2">
            <strong>{protest.pollQuestion}</strong>
            <div className="mt-1">
               {protest.option1} 
               {protest.option2}
            </div>
          </div>
          
        )}
         
      </div>
    </div>
  ))}
  
</div>


      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50   transition-opacity   flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Start a New Protest</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Protest Title"
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your protest message..."
                className="w-full border p-2 rounded"
                required
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="pollEnabled"
                  checked={formData.pollEnabled}
                  onChange={handleChange}
                />
                <span>Enable Poll</span>
              </label>
              {formData.pollEnabled && (
                <>
                  <input
                    type="text"
                    name="pollQuestion"
                    value={formData.pollQuestion}
                    onChange={handleChange}
                    placeholder="Poll Question"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="option1"
                    value={formData.option1}
                    onChange={handleChange}
                    placeholder="Option 1"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="option2"
                    value={formData.option2}
                    onChange={handleChange}
                    placeholder="Option 2"
                    className="w-full border p-2 rounded"
                  />
                </>
              )}
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="#Environment #Justice"
                className="w-full border p-2 rounded"
              />
              <input
                type="file"
                name="media"
                accept="image/*,video/*"
                onChange={handleChange}
                className="w-full"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Start Protest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallofprotest;
