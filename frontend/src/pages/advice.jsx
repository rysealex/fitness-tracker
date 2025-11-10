import { useState } from 'react';
import '../styles/index.css'
import Navbar from "../navbar";

// Define the shape of the advice response (Python back returns a dictionary {})
const initialAdviceState = {
  "final_response": "",
  "analysis_report": "",
  "retrieved_logs": ""
}

function Advice() {

  // Use states for Advice Page
  const [userQuery, setUserQuery] = useState("");
  const [adviceResponse, setAdviceResponse] = useState(initialAdviceState);
  const [isLoading, setIsLoading] = useState(false);

  // Handle the Fitness Tracker Advice
  const handleSubmit = (e) => {
    e.preventDefault();

    // Input validation here

    // Set loading state and clear previous advice
    setIsLoading(true);
    setAdviceResponse("");

    // Change to actual API call later
    console.log("Sending user query to Fitness Tracker Advice Workflow!\nUser query: ", userQuery);
  }

  return(
    <div className='centered-page'>
      <Navbar />
      <section className='advice-container'>
        <h1 className='advice-title'>AI Fitness Advisor</h1>
        <form className='advice-form' onSubmit={handleSubmit}>
          <label htmlFor="advice-input" className="advice-label">
            Ask your fitness question:
          </label>
          <textarea
              id="advice-input"
              className='advice-input'
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="e.g., What's a good full-body workout for a beginner?"
              rows="4"
              disabled={isLoading}
          />
          <button 
              type="submit" 
              className='advice-submit-button'
              disabled={isLoading || !userQuery.trim()}
          >
              {isLoading ? 'Getting Advice...' : 'Get Advice'}
          </button>
        </form>

        {adviceResponse && (
          <div className='advice-output-box'>
            <h2>AI Response:</h2>
            <p className='ai-response-text'>{adviceResponse.final_response}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Advice;