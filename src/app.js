import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      const response = await axios.post('/predict', { input: input.split(',').map(Number) });
      setPrediction(response.data.prediction);
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  return (
    <div>
      <h1>AI Predictor</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter comma-separated values"
      />
      <button onClick={handleSubmit}>Predict</button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {prediction && <div>Prediction: {prediction.join(', ')}</div>}
    </div>
  );
}

export default App;
