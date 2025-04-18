import React, { useState, useRef, useEffect } from 'react';
import './spl.css'; // We'll create this CSS file next

const SpinningWheel = () => {
  const [numberOfOptions, setNumberOfOptions] = useState(8);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  // Generate colors for the wheel segments
  const generateColors = (count) => {
    const colors = [];
    const hueStep = 360 / count;
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${i * hueStep}, 70%, 50%)`);
    }
    return colors;
  };

  const colors = generateColors(numberOfOptions);

  // Spin the wheel
  const spinWheel = () => {
    if (spinning) return;
    
    setSpinning(true);
    setResult(null);
    
    // Random number of full rotations (5-10) plus a random segment
    const fullRotations = 5 + Math.floor(Math.random() * 5);
    const selectedSegment = Math.floor(Math.random() * numberOfOptions);
    const degrees = fullRotations * 360 + (360 - (selectedSegment * (360 / numberOfOptions))) - (360 / numberOfOptions / 2);
    
    setRotation(prev => prev + degrees);
    
    // Calculate result after animation
    setTimeout(() => {
      setResult(selectedSegment + 1); // +1 to make it 1-based
      setSpinning(false);
    }, 5000); // Should match CSS transition duration
  };

  // Handle number of options change
  const handleOptionChange = (e) => {
    const value = Math.max(2, Math.min(50, parseInt(e.target.value) || 8));
    setNumberOfOptions(value);
    setRotation(0);
    setResult(null);
  };

  return (
    <div className="wheel-container">
      <h1>Spinning Wheel</h1>
      
      <div className="controls">
        <label>
          Number of options:
          <input 
            type="number" 
            min="2" 
            max="50" 
            value={numberOfOptions} 
            onChange={handleOptionChange}
            disabled={spinning}
          />
        </label>
        
        <button onClick={spinWheel} disabled={spinning}>
          {spinning ? 'Spinning...' : 'Spin the Wheel!'}
        </button>
      </div>
      
      <div className="wheel-wrapper">
        <div 
          className="wheel" 
          ref={wheelRef}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.21, 0.99)' : 'none'
          }}
        >
          {Array.from({ length: numberOfOptions }).map((_, index) => (
            <div 
              key={index}
              className="segment"
              style={{
                backgroundColor: colors[index],
                transform: `rotate(${index * (360 / numberOfOptions)}deg)`,
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.tan(Math.PI / numberOfOptions)}% 0%)`
              }}
            >
<span 
  className="segment-text"
  style={{
    transform: `rotate(${(360 / numberOfOptions) / 2}deg) translate(-50%, -50%)`
  }}
>
  {index + 1}
</span>          </div>
          ))}
        </div>
        
        <div className="pointer"></div>
      </div>
      
      {result && !spinning && (
        <div className="result">
          <h2>Result: {result}</h2>
        </div>
      )}
    </div>
  );
};

export default SpinningWheel;