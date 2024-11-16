// frontend/src/App.js
import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = async () => {
    setError(null);
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = newStream;
      setStream(newStream);
    } catch (err) {
      setError("Error accessing camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStream(null);
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setImageData(canvas.toDataURL('image/png'));
    setResult(null);
    setError(null);
  };

  const classifyWaste = async () => {
    if (!imageData) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) throw new Error("Failed to classify image. Please try again.");

      const result = await response.json();
      setResult(`E-waste type: ${result.type}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>E-Waste Detector</h1>
        <p>Identify and classify e-waste effortlessly with your camera.</p>
      </header>

      <main className="content">
        <div className="camera-container">
          <video ref={videoRef} autoPlay className="video-feed" />
          <div className="buttons">
            <button onClick={startCamera} className="btn start-btn">Start Camera</button>
            <button onClick={stopCamera} className="btn stop-btn" disabled={!stream}>Stop Camera</button>
            <button onClick={captureImage} className="btn capture-btn" disabled={!stream}>Capture Image</button>
            <button onClick={classifyWaste} className="btn classify-btn" disabled={!imageData || loading}>Classify Waste</button>
          </div>
        </div>
        {loading && <p className="loading">Classifying...</p>}
        {result && <p className="result">{result}</p>}
        {error && <p className="error">{error}</p>}
        {imageData && (
          <div className="captured-image">
            <h3>Captured Image:</h3>
            <img src={imageData} alt="Captured" />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2024 E-Waste Detector | Empowering Sustainability</p>
      </footer>
    </div>
  );
}

export default App;
