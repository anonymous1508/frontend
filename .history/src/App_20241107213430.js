// frontend/src/App.js
import React, { useRef, useState } from 'react';

function App() {
  const videoRef = useRef(null);
  const [imageData, setImageData] = useState(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setImageData(canvas.toDataURL('image/png'));
  };

  const classifyWaste = async () => {
    const response = await fetch('http://localhost:5000/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData }),
    });
    const result = await response.json();
    alert(`E-waste type: ${result.type}`);
  };

  return (
    <div>
      <h1>E-Waste Detector</h1>
      <video ref={videoRef} autoPlay />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureImage}>Capture Image</button>
      <button onClick={classifyWaste}>Classify Waste</button>
    </div>
  );
}

export default App;

