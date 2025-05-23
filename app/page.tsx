'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SpinGrid from '../components/SpinGrid';

// Import shadcn components
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

// Base Parameter Values
const BASE_PARAMS = {
  gamma: 5e5,
  alpha: 0.3,
  exchangeStrength: 1.5e-10,
  externalFieldStrength: 2e5,
  timeStepScale: 5e-10,
};

// Initial Multipliers for sliders
const INITIAL_MULTIPLIERS = {
  exchangeMultiplier: 1,
  timeStepMultiplier: 1,
};

export default function Home() {
  const [isFieldInverted, setIsFieldInverted] = useState(false);
  // Restore separate state management
  const [baseParams] = useState(BASE_PARAMS);
  const [directParams, setDirectParams] = useState({
    gamma: baseParams.gamma,
    alpha: baseParams.alpha,
    externalFieldStrength: baseParams.externalFieldStrength,
  });
  const [multipliers, setMultipliers] = useState(INITIAL_MULTIPLIERS);

  const handleCanvasClick = () => {
    setIsFieldInverted(prev => !prev);
  };

  // Restore separate handlers
  const handleDirectSliderChange = (name: keyof typeof directParams) => (value: number[]) => {
    setDirectParams(prev => ({ ...prev, [name]: value[0] }));
  };
  const handleMultiplierSliderChange = (name: keyof typeof multipliers) => (value: number[]) => {
    setMultipliers(prev => ({ ...prev, [name]: value[0] }));
  };

  // Restore calculation of final parameters
  const finalParams = {
    ...directParams,
    exchangeStrength: baseParams.exchangeStrength * multipliers.exchangeMultiplier,
    timeStepScale: baseParams.timeStepScale * multipliers.timeStepMultiplier,
  };

  return (
    <main className="relative h-screen bg-white text-black flex flex-row">
      
      {/* Sidebar for Controls */}
      <div 
        className="z-10 h-full w-64 bg-gray-100 p-4 shadow-lg text-sm border-r border-gray-300"
        // Prevent clicks on sidebar from toggling field
        onPointerDown={(e) => e.stopPropagation()} 
      >
        <h2 className="text-lg font-bold mb-4">Parameters</h2>
        
        {/* Gamma Slider (Direct) */}
        <div className="mb-4 space-y-2">
          <Label htmlFor="gamma">Gamma (γ): {directParams.gamma.toExponential(1)}</Label>
          <Slider
            id="gamma"
            name="gamma"
            min={1e5} max={1e6} step={1e4}
            value={[directParams.gamma]}
            onValueChange={handleDirectSliderChange('gamma')} 
          />
        </div>

        {/* Alpha Slider (Direct) */}
        <div className="mb-4 space-y-2">
          <Label htmlFor="alpha">Alpha (α): {directParams.alpha.toFixed(2)}</Label>
          <Slider
            id="alpha"
            name="alpha"
            min={0.01} max={1.5} step={0.01}
            value={[directParams.alpha]}
            onValueChange={handleDirectSliderChange('alpha')} 
          />
        </div>

        {/* Exchange Strength Slider (Multiplier) */}
        <div className="mb-4 space-y-2">
          <Label htmlFor="exchangeStrength">Exchange (J): {finalParams.exchangeStrength.toExponential(1)}</Label>
          <Slider
            id="exchangeStrength" 
            name="exchangeMultiplier" // Use multiplier state name
            min={0.1} max={10} step={0.1} // Use linear range
            value={[multipliers.exchangeMultiplier]} // Use multiplier value
            onValueChange={handleMultiplierSliderChange('exchangeMultiplier')} // Use multiplier handler
          />
        </div>

        {/* External Field Slider (Direct) */}
        <div className="mb-4 space-y-2">
          <Label htmlFor="externalFieldStrength">Field (H_ext): {directParams.externalFieldStrength.toExponential(1)}</Label>
          <Slider
            id="externalFieldStrength"
            name="externalFieldStrength"
            min={1e4} max={1e6} step={1e4}
            value={[directParams.externalFieldStrength]}
            onValueChange={handleDirectSliderChange('externalFieldStrength')} 
          />
        </div>

        {/* Time Step Scale Slider (Multiplier) */}
        <div className="mb-4 space-y-2">
          <Label htmlFor="timeStepScale">Time Scale (Δt scale): {finalParams.timeStepScale.toExponential(1)}</Label>
          <Slider
            id="timeStepScale"
            name="timeStepMultiplier" // Use multiplier state name
            min={0.1} max={10} step={0.1} // Use linear range
            value={[multipliers.timeStepMultiplier]} // Use multiplier value
            onValueChange={handleMultiplierSliderChange('timeStepMultiplier')} // Use multiplier handler
          />
        </div>

        {/* Invert Field Button */}
        <div className="mt-6">
          <Button 
            onClick={handleCanvasClick} 
            variant="outline"
            className="w-full"
          >
            Invert Field ({isFieldInverted ? 'Repulsive' : 'Attractive'})
          </Button>
        </div>
      </div>

      {/* Canvas Container: Make it absolute, covering full screen */}
      <div className="inset-0 w-full h-full py-5" onPointerDown={handleCanvasClick}> 
        <Canvas camera={{ position: [0, 0, 11], fov: 50 }}>
          <color attach="background" args={['white']} />
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          {/* Pass final calculated params */}
          <SpinGrid 
            gridSize={20} 
            isFieldInverted={isFieldInverted} 
            {...finalParams} 
          />
          <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
        </Canvas>
      </div>
    </main>
  );
}