import React, { useState, useEffect } from 'react';

const QuestionList = ({ response }) => {
    // Split the response by double newlines to separate the protocols
    const protocols = response.split('\n\n');

    // State to handle the fade-in effect
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        // Trigger fade-in effect when the component mounts
        setTimeout(() => {
            setFadeIn(true);
        }, 200);  // Delay the fade-in to make it smoother
    }, []);

    return (
        <div className={`max-w-4xl mx-auto p-6 ${fadeIn ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold mb-6">Emergency Protocols</h2>

            {/* Map through protocols and display each one */}
            {protocols.map((protocol, index) => {
                // Split protocol into heading and content by the colon (":")
                const [protocolHeading, ...details] = protocol.split(":");

                // Apply fade-in effect with staggered delays for each protocol
                const delay = `${0.4 + index * 0.2}s`;  // Stagger the delay for each item

                return (
                    <div key={index} className="mb-4 fade-in" style={{ animationDelay: delay }}>
                        <h3 className="text-xl font-bold text-blue-400 mb-2">{protocolHeading}</h3>
                        <p className="text-gray-300">{details.join(":")}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default QuestionList;
