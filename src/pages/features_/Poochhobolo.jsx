/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { MessageSquareQuote, Eye, Users, Volume2 } from 'lucide-react';

const Poochhobolo = () => {
  const [activeTab, setActiveTab] = useState('justAsk');
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('expert');
  const [questionsList, setQuestionsList] = useState([]);
  const [topics, setTopics] = useState('');
  const [tagExpert, setTagExpert] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [showFallback, setShowFallback] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [pollOptions, setPollOptions] = useState(['']); // State for poll options

  const tabs = [
    { id: 'justAsk', name: 'Just Ask', icon: <MessageSquareQuote size={18} /> },
    { id: 'behindQuestion', name: 'Behind the Question Mode', icon: <Eye size={18} /> },
    { id: 'janPehal', name: 'Jan-Pehal Prayog', icon: <Users size={18} /> },
    { id: 'echoWall', name: 'Echo Wall', icon: <Volume2 size={18} /> },
  ];

  const typeLabels = {
    expert: 'Expert View',
    poll: 'Poll',
    public: 'Public View',
  };

  const typeColors = {
    expert: 'bg-blue-200 text-blue-800',
    poll: 'bg-yellow-200 text-yellow-800',
    public: 'bg-green-200 text-green-800',
  };

  const defaultPrompts = {
    expert: 'I want expert advice on...',
    poll: 'What do people think about...',
    public: 'Can someone from the community explain...',
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setQuestionType(selectedType);
    setQuestion(defaultPrompts[selectedType] || '');
    if (selectedType === 'poll') {
      setPollOptions(['']); // Reset poll options when poll type is selected
    }
  };

  const handlePollOptionChange = (index, value) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']); // Add a new empty option
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      const newQuestion = {
        text: question,
        type: questionType,
        topics,
        tagExpert,
        verifiedOnly,
        file: attachedFile,
        answers: [],
        likes: 0,
        comments: [],
        votes: Array(pollOptions.length).fill(0), // Initialize votes for each option
        totalVotes: 0, // Total votes for the poll
        options: questionType === 'poll' ? pollOptions : [], // Store poll options
      };
      setQuestionsList([...questionsList, newQuestion]);
      setQuestion('');
      setQuestionType('expert');
      setTopics('');
      setTagExpert('');
      setVerifiedOnly(false);
      setAttachedFile(null);
      setPollOptions(['']); // Reset poll options
      setShareUrl(`https://yourapp.com/question/${questionsList.length}`); // Update with your actual share URL logic
    }
  };

  const handleVote = (index, optionIndex) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[index].votes[optionIndex] += 1; // Increment the vote for the selected option
    updatedQuestions[index].totalVotes += 1; // Increment total votes
    setQuestionsList(updatedQuestions);
  };

  const handleAnswerSubmit = (index, answer) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[index].answers.push(answer);
    setQuestionsList(updatedQuestions);
  };

  const handleLike = (index) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[index].likes += 1;
    setQuestionsList(updatedQuestions);
  };

  const handleCommentSubmit = (index, comment) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[index].comments.push(comment);
    setQuestionsList(updatedQuestions);
  };

  const handleShare = async (post) => {
    const shareData = {
      title: post.text,
      text: post.text,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Post shared successfully!');
      } catch (error) {
        console.error('Error sharing the post:', error);
      }
    } else {
      setShowFallback(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="font-sans bg-gray-100  overflow-hidden min-h-screen flex flex-col">
      {/* Header Section */}
      <section className="relative w-full bg-cover bg-center h-96 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px]" style={{ backgroundImage: 'url("https://i.pinimg.com/736x/c4/b9/0c/c4b90c36f5941a3f3daabc385f00c8b4.jpg")' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 sm:px-8 md:px-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Welcome to Poochho Bolo</h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">Poochho Bolo is your go-to platform for curiosity and knowledge. Ask questions, seek answers, and engage with a community eager to share insights.</p>
        </div>
      </section>

      {/* Tabs Section */}
      <div className="sticky top-0 z-10 bg-white py-4 flex justify-center px-2 ">
        <div className="bg-white shadow-2xl   rounded-full px-4 py-2 flex flex-wrap gap-2 justify-center sm:space-x-2 sm:flex-nowrap">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${activeTab === tab.id ? 'bg-black text-white shadow-md' : 'text-black hover:text-white hover:bg-gray-600'}`}>
              {tab.icon}
              <span className="whitespace-nowrap">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Section */}
      <section className="flex-grow flex flex-col lg:flex-row justify-center items-start gap-6 px-4 sm:px-8 md:px-16 py-12">
        {activeTab === 'justAsk' && (
          <>
            {/* Submission Form Box */}
            <div className="bg-white rounded-3xl shadow-xl max-w-lg lg:max-w-2xl lg:mr-60 max-h-[80vh] overflow-y-auto p-8 flex-shrink-0">
              <h2 className="text-2xl font-bold mb-6 text-center">Ask Your Question</h2>
              <form onSubmit={handleQuestionSubmit} className="space-y-6">
                <select value={questionType} onChange={handleTypeChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="expert">Expert View</option>
                  <option value="poll">Poll</option>
                  <option value="public">Public View</option>
                </select>

                <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Type your question here..." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows="4" required />

                {questionType === 'poll' && (
                  <>
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handlePollOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
                          required
                        />
                      </div>
                    ))}
                    <button type="button" onClick={addPollOption} className="text-blue-500">Add another option</button>
                  </>
                )}

                {questionType === 'expert' && (
                  <>
                    <input type="text" value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="Add Topics (e.g., Health, Fitness)" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                    <input type="text" value={tagExpert} onChange={(e) => setTagExpert(e.target.value)} placeholder="Tag expert (optional)" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
                      Restrict to verified-only answers?
                    </label>
                  </>
                )}

                <label className="block">
                  <span className="text-gray-700 font-medium">Attach Image or Video (optional)</span>
                  <input type="file" accept="image/*,video/*" onChange={(e) => setAttachedFile(e.target.files[0])} className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                </label>

                <button type="submit" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full">Submit Question</button>
              </form>
            </div>

            {/* Submitted Questions List Box */}
            <div className="bg-white rounded-3xl shadow-xl   max-h-[80vh] overflow-y-auto p-8 flex-grow">
              <h3 className="text-xl font-semibold mb-6 text-center">Asked Questions</h3>
              {questionsList.length === 0 ? (
                <p className="text-gray-500 text-center">No questions submitted yet.</p>
              ) : (
                <ul className="space-y-4">
                  {questionsList.map((q, index) => (
                    <li key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50 flex flex-col gap-2">
                      <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full w-max ${typeColors[q.type] || 'bg-gray-200 text-gray-800'}`}>{typeLabels[q.type] || q.type}</span>
                      <p className="text-gray-800">{q.text}</p>

                      {q.type === 'poll' && (
                        <div className="mt-4">
                          <h4 className="font-semibold">Poll Options:</h4>
                          {q.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center p-2  rounded-4xl   justify-between">
                              <span>{option}</span>
                              <button onClick={() => handleVote(index, optIndex)} className="bg-blue-500 text-white px-2 py-1 rounded">Vote</button>
                            </div>
                          ))}
                          <div className="mt-2  bg-black text-white rounded-3xl  p-2.5   ">
                            <h5 className="font-semibold  ">Results</h5>
                            {q.options.map((option, optIndex) => {
                              const percentage = q.totalVotes > 0 ? ((q.votes[optIndex] / q.totalVotes) * 100).toFixed(2) : 0;
                              return (
                                <div key={optIndex} className="flex justify-between">
                                  <span>{option}: {percentage}% ({q.votes[optIndex]} votes)</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {q.topics && (
                        <div className="mb-4">
                          <p className="text-sm text-white bg-black p-2.5 rounded-2xl">
                            Topics:
                            <span className="text-white bg-black font-semibold"> {q.topics}</span>
                          </p>
                        </div>
                      )}

                      {q.tagExpert && (
                        <div className="mb-4">
                          <p className="text-sm text-white bg-black p-2.5 rounded-2xl">
                            Tagged Expert: <span className="font-semibold">{q.tagExpert}</span>
                          </p>
                        </div>
                      )}

                      {q.verifiedOnly && (
                        <span className="self-end inline-flex items-center text-xs text-white bg-green-600 p-2 rounded-full mb-4">
                          Verified Only
                        </span>
                      )}

                      {q.file && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Attached File:</p>
                          {q.file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(q.file)}
                              alt="Attached"
                              className="w-full max-w-md rounded-lg border border-gray-300 shadow-md"
                            />
                          ) : q.file.type.startsWith('video/') ? (
                            <video controls className="w-full max-w-md rounded-lg border border-gray-300 shadow-md">
                              <source src={URL.createObjectURL(q.file)} type={q.file.type} />
                            </video>
                          ) : (
                            <p className="text-sm text-gray-600">File: <span className="font-semibold">{q.file.name}</span></p>
                          )}
                        </div>
                      )}

                      {/* Like Button */}
                      <button onClick={() => handleLike(index)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Like {q.likes}</button>

                      {/* Share Button */}
                      <div className="relative inline-block">
                        <button onClick={() => handleShare(q)} className="flex items-center gap-2 p-3 bg-black rounded-2xl text-white hover:bg-blue-700 transition">
                          <span className="text-lg">🔗</span>
                          Share
                        </button>

                        {/* Fallback UI */}
                        {showFallback && (
                          <div className="absolute mt-2 w-96 p-4 bg-white shadow-lg border rounded-2xl z-50">
                            <button onClick={() => setShowFallback(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-sm" aria-label="Close">❌ Close</button>
                            <p className="text-sm text-gray-700 mb-2">Copy and share this link:</p>
                            <div className="flex items-center space-x-2">
                              <input value={shareUrl} readOnly className="flex-1 px-2 py-1 border rounded text-sm" />
                              <button onClick={handleCopy} className="bg-gray-200 hover:bg-gray-300 text-sm px-2 py-1 rounded">Copy</button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Answer Input */}
                      <input type="text" placeholder="Type your answer..." className="border border-gray-300 rounded-lg px-4 py-2 mt-2" onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAnswerSubmit(index, e.target.value);
                          e.target.value = '';
                        }
                      }} />

                      {/* Display Answers */}
                      {q.answers.length > 0 && (
                        <div className="mt-2">
                          <h4 className="font-semibold">Answers:</h4>
                          <ul className="list-disc pl-5">
                            {q.answers.map((answer, ansIndex) => (
                              <li key={ansIndex} className="text-gray-700">{answer}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Comment Input */}
                      <input type="text" placeholder="Type your comment..." className="border border-gray-300 rounded-lg px-4 py-2 mt-2" onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCommentSubmit(index, e.target.value);
                          e.target.value = '';
                        }
                      }} />

                      {/* Display Comments */}
                      {q.comments.length > 0 && (
                        <div className="mt-2">
                          <h4 className="font-semibold">Comments:</h4>
                          <ul className="list-disc pl-5">
                            {q.comments.map((comment, comIndex) => (
                              <li key={comIndex} className="text-gray-700">{comment}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* Placeholder content for other tabs */}
        {activeTab === 'behindQuestion' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Behind the Question Mode</h2>
            <p className="text-gray-700">Feature coming soon...</p>
          </div>
        )}

        {activeTab === 'janPehal' && ( 
     
           <div>
            <h2 className="text-2xl font-bold mb-4">Jan-Pehal Prayog</h2>
            <p className="text-gray-700">Engage with community initiatives. Feature coming soon!</p>
          </div>
        )}

        {activeTab === 'echoWall' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Echo Wall</h2>
            <p className="text-gray-700">Broadcast your thoughts. Feature coming soon!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Poochhobolo;