import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AudioUpload from './Components/AudioUpload';
import QuestionList from './Components/QuestionList';
import Header from './Components/Header';
import About from './Components/About';
import FAQSection from './Components/FAQSection';
import './styles/App.css';

const App = () => {
    const [responseText, setResponseText] = useState(""); // Store response text
    const [fadeInNext, setFadeInNext] = useState(false);  
    const [showQuestions, setShowQuestions] = useState(false);  
    const [fadeIn, setFadeIn] = useState(false);  // State to control overall fade-in
    const [showUploadScreen, setShowUploadScreen] = useState(true); // Control to re-trigger upload screen fade-in

    // Trigger the overall fade-in on component mount
    useEffect(() => {
        setFadeIn(true);  // Start the fade-in effect when the page loads
    }, []);

    useEffect(() => {
        if (responseText) {
            setTimeout(() => {
                setShowQuestions(true);
                setFadeInNext(true);
            }, 500);  
        }
    }, [responseText]);

    const handleUploadSuccess = (data) => {
        if (data && data.response) {
            setResponseText(data.response);
        } else {
            console.error('Invalid response format: no response field');
            setResponseText("");  // Fallback to an empty string
        }
    };

    const handleReset = () => {
        setFadeInNext(false);
        setFadeIn(false);  // Reset the entire page fade-in effect
        setTimeout(() => {
            setShowQuestions(false);
            setResponseText("");
            setShowUploadScreen(false);  // Hide the upload screen first
            setTimeout(() => {
                setShowUploadScreen(true);  // Re-show the upload screen after delay
                setFadeIn(true);  // Re-trigger fade-in for all components
            }, 100);  // Delay slightly before showing upload screen to ensure smooth transition
        }, 500);
    };

    return (
        <Router>
            <div className="App animated-gradient text-gray-100 min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
                {/* Fix the header at the top of the page */}
                <div className={`w-full absolute top-0 left-0 ${fadeIn ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
                    <Header />
                </div>

                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <>
                                {/* Apply fade-in effect for the title */}
                                <div className={`text-center ${fadeIn ? 'fade-in' : ''}`} style={{ animationDelay: '0.4s' }}>
                                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4 mt-6">ambuLLMce</h1>
                                    {!responseText && (
                                        <p className="text-lg sm:text-xl text-gray-400 mb-6">Upload or record audio to get actionable questions for dispatching.</p>
                                    )}
                                </div>

                                {/* Conditionally render upload or questions based on showUploadScreen */}
                                {!showQuestions ? (
                                    showUploadScreen && (
                                        <div 
                                            className={`w-full flex flex-col items-center space-y-6 transition-opacity duration-500 ${fadeIn ? 'fade-in' : ''}`}
                                            style={{ animationDelay: '0.6s' }}
                                        >
                                            <AudioUpload onUploadSuccess={handleUploadSuccess} />
                                        </div>
                                    )
                                ) : (
                                    <div 
                                        className={`w-full flex flex-col items-center space-y-6 transition-opacity duration-500 ${fadeInNext ? 'opacity-100' : 'opacity-0'} ${fadeIn ? 'fade-in' : ''}`}
                                        style={{ animationDelay: '0.8s' }}
                                    >
                                        <QuestionList response={responseText} />
                                        <button
                                            className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-lg bounce"
                                            onClick={handleReset}
                                        >
                                            Upload More Audio
                                        </button>
                                    </div>
                                )}
                            </>
                        }
                    />

                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQSection />} /> {/* New FAQ route */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
