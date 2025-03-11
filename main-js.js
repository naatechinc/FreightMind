import React, { useState, useEffect } from 'react';
import { Camera, Upload, Box, X, Save, FileText } from 'lucide-react';

const App = () => {
  const [uploadedDXFs, setUploadedDXFs] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedParts, setDetectedParts] = useState([]);
  const [packagingSolution, setPackagingSolution] = useState(null);
  const [currentShipmentIndex, setCurrentShipmentIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playInterval, setPlayInterval] = useState(null);
  const [viewMode, setViewMode] = useState("top");
  
  // Simplified 3D visualization component
  const PackagingVisualization = ({ shipment }) => {
    return (
      <div className="w-full h-64 border border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <Box className="h-10 w-10 mx-auto text-blue-500 mb-2" />
          <p className="text-sm text-gray-600">
            {shipment ? (
              <>
                Box dimensions: {shipment.box_dimensions.length}" × 
                {shipment.box_dimensions.width}" × 
                {shipment.box_dimensions.height}"
              </>
            ) : (
              'No shipment data available'
            )}
          </p>
        </div>
      </div>
    );
  };

  // Simulate capturing an image
  const capturePhoto = () => {
    const imageUrl = '/api/placeholder/640/480';
    setCapturedImage(imageUrl);
    
    // Generate some sample parts
    const sampleParts = [
      {
        part_name: "Bracket Assembly",
        part_number: "PN-1234",
        dimensions: { length: 12, width: 8, height: 3 }
      },
      {
        part_name: "Support Frame",
        part_number: "PN-5678",
        dimensions: { length: 18, width: 10, height: 4 }
      }
    ];
    
    setDetectedParts(sampleParts);
  };
  
  // Generate packaging solution
  const generatePackagingSolution = () => {
    const sampleSolution = {
      shipments: [
        {
          parts: detectedParts,
          is_oversized: false,
          box_dimensions: {
            length: 24 + 4, // Adding padding
            width: 18 + 4,
            height: 12 + 4
          },
          arrangement: detectedParts.map((part, index) => ({
            part_number: part.part_number,
            position: {
              x: 2 + (index % 2) * 12,
              y: 2 + Math.floor(index / 2) * 9,
              z: 2
            },
            rotation: 0
          }))
        }
      ],
      total_shipments: 1
    };
    
    setPackagingSolution(sampleSolution);
  };
  
  // Reset application state
  const resetApp = () => {
    setCapturedImage(null);
    setDetectedParts([]);
    setPackagingSolution(null);
    setCurrentStep(0);
    if (isPlaying) {
      clearInterval(playInterval);
      setIsPlaying(false);
    }
  };
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (playInterval) {
        clearInterval(playInterval);
      }
    };
  }, [playInterval]);

  // Reset current step when changing shipments
  useEffect(() => {
    setCurrentStep(0);
    if (isPlaying) {
      clearInterval(playInterval);
      setIsPlaying(false);
    }
  }, [currentShipmentIndex]);
  
  const currentShipment = packagingSolution?.shipments[currentShipmentIndex];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-semibold text-gray-900">AI Packaging Optimizer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Optimize your shipping packages with AI-powered arrangement
        </p>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left panel - Input */}
          <div className="space-y-6">
            {/* DXF Upload */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upload DXF Files</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-10 w-10 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Upload SolidWorks DXF files to extract part data
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Select DXF Files
                </button>
              </div>
            </div>
            
            {/* Camera Capture */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Capture Parts Image</h2>
              
              <div className="space-y-4">
                {!capturedImage ? (
                  <div 
                    className="border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50"
                    style={{minHeight: "200px"}}
                  >
                    <Camera className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      Take a photo of your parts to detect them automatically
                    </p>
                    <button 
                      onClick={capturePhoto}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Capture Photo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <img 
                        src={capturedImage} 
                        alt="Captured parts" 
                        className="w-full rounded-lg"
                      />
                      <button 
                        onClick={() => setCapturedImage(null)}
                        className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={capturePhoto}
                        className="px-3 py-1.5 border border-blue-500 text-sm font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100"
                      >
                        <Camera size={16} className="inline mr-1" />
                        Recapture Photo
                      </button>
                      
                      <button
                        onClick={() => {
                          // Clear detected parts first
                          setDetectedParts([]);
                          
                          // Display processing status
                          const processingMessage = "Reanalyzing image...";
                          alert(processingMessage);
                          
                          // Simulate AI reanalysis with a delay
                          setTimeout(() => {
                            // Create some sample different parts for the reanalysis
                            const newDetectedParts = uploadedDXFs.map(dxf => ({
                              ...dxf,
                              confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
                            }));
                            
                            setDetectedParts(newDetectedParts);
                            alert(`Image reanalyzed: ${newDetectedParts.length} parts detected`);
                          }, 2000);
                        }}
                        className="px-3 py-1.5 border border-green-500 text-sm font-medium rounded text-green-700 bg-green-50 hover:bg-green-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retry Analysis
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Detected Parts */}
            {detectedParts.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Detected Parts ({detectedParts.length})</h2>
                  <button
                    onClick={generatePackagingSolution}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Optimize Packaging
                  </button>
                </div>
                <ul className="divide-y divide-gray-200">
                  {detectedParts.map((part, index) => (
                    <li key={index} className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">{part.part_name}</h3>
                          <p className="text-xs text-gray-500">{part.part_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">
                            {part.dimensions.length}" × {part.dimensions.width}" × {part.dimensions.height}"
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Right panel - Output */}
          <div className="space-y-6">
            {/* Packaging Solution */}
            {packagingSolution && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Packaging Solution
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={resetApp}
                      className="px-3 py-1.5 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Reset
                    </button>
                    <button
                      className="px-3 py-1.5 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Save size={16} className="inline mr-1" />
                      Export
                    </button>
                  </div>
                </div>
                
                {currentShipment && (
                  <>
                    <div className="p-2 rounded-md bg-gray-100 mb-4">
                      <p className="text-sm font-medium text-gray-900">
                        Box Dimensions: {currentShipment.box_dimensions.length}" × {currentShipment.box_dimensions.width}" × {currentShipment.box_dimensions.height}"
                      </p>
                      <p className="text-sm text-gray-500">
                        {currentShipment.parts.length} parts in this shipment
                      </p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Undersized Shipping
                      </span>
                    </div>
                    
                    {/* 3D Visualization */}
                    <PackagingVisualization shipment={currentShipment} />
                    
                    {/* 3D Pictorial Packing Guide */}
                    <div className="mt-6 border border-gray-200 rounded-lg">
                      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-700">3D Assembly Sequence</h3>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">View:</span>
                            <select 
                              className="text-xs border-gray-300 rounded-md"
                              value={viewMode}
                              onChange={(e) => setViewMode(e.target.value)}
                            >
                              <option value="top">Top View</option>
                              <option value="side">Side View</option>
                            </select>
                          </div>
                          <span className="text-xs text-gray-500">
                            Step <span className="font-medium">{currentStep + 1}</span> of <span className="font-medium">{currentShipment.parts.length}</span>
                          </span>
                        </div>
                      </div>
                      
                      {/* 3D Rendering Area */}
                      <div className="relative bg-gray-100" style={{ height: "300px" }}>
                        {/* This would be a 3D canvas in a real implementation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {viewMode === "top" ? (
                            <div 
                              className="border border-gray-300 bg-white shadow-lg"
                              style={{
                                width: `${Math.min(280, currentShipment.box_dimensions.length * 5)}px`,
                                height: `${Math.min(280, currentShipment.box_dimensions.width * 5)}px`,
                                position: 'relative'
                              }}
                            >
                              {/* Top View Label */}
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-t border border-gray-300 border-b-0">
                                Top View (X-Y Plane)
                              </div>
                              
                              {/* Render visible parts based on current step - TOP VIEW */}
                              {currentShipment.parts.map((part, index) => (
                                index <= currentStep && (
                                  <div 
                                    key={index}
                                    style={{
                                      position: 'absolute',
                                      left: `${currentShipment.arrangement[index].position.x * 5}px`,
                                      top: `${currentShipment.arrangement[index].position.y * 5}px`,
                                      width: `${part.dimensions.length * 5}px`,
                                      height: `${part.dimensions.width * 5}px`,
                                      backgroundColor: `hsl(${index * 30}, 70%, 65%)`,
                                      border: '1px solid rgba(0,0,0,0.2)',
                                      transition: 'all 0.5s ease-in-out',
                                      zIndex: index,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    className="shadow-md"
                                  >
                                    <span className="text-xs text-white font-bold">{index + 1}</span>
                                  </div>
                                )
                              ))}
                              
                              {/* Coordinate labels */}
                              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-500">Y</div>
                              <div className="absolute bottom-0 left-1/2 transform translate-x(-50%) translate-y(100%) text-xs font-medium text-gray-500">X</div>
                            </div>
                          ) : (
                            <div 
                              className="border border-gray-300 bg-white shadow-lg"
                              style={{
                                width: `${Math.min(280, currentShipment.box_dimensions.length * 5)}px`,
                                height: `${Math.min(280, currentShipment.box_dimensions.height * 5)}px`,
                                position: 'relative'
                              }}
                            >
                              {/* Side View Label */}
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-t border border-gray-300 border-b-0">
                                Side View (X-Z Plane)
                              </div>
                              
                              {/* Render visible parts based on current step - SIDE VIEW */}
                              {currentShipment.parts.map((part, index) => (
                                index <= currentStep && (
                                  <div 
                                    key={index}
                                    style={{
                                      position: 'absolute',
                                      left: `${currentShipment.arrangement[index].position.x * 5}px`,
                                      bottom: `${currentShipment.arrangement[index].position.z * 5}px`,
                                      width: `${part.dimensions.length * 5}px`,
                                      height: `${part.dimensions.height * 5}px`,
                                      backgroundColor: `hsl(${index * 30}, 70%, 65%)`,
                                      border: '1px solid rgba(0,0,0,0.2)',
                                      transition: 'all 0.5s ease-in-out',
                                      zIndex: index,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    className="shadow-md"
                                  >
                                    <span className="text-xs text-white font-bold">{index + 1}</span>
                                  </div>
                                )
                              ))}
                              
                              {/* Coordinate labels */}
                              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-500">Z</div>
                              <div className="absolute bottom-0 left-1/2 transform translate-x(-50%) translate-y(100%) text-xs font-medium text-gray-500">X</div>
                            </div>
                          )}
                        </div>
                        
                        {/* Navigation Controls Overlay */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-3">
                          <button 
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              currentStep === 0 ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-700 shadow-md hover:bg-blue-50'
                            }`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          <button 
                            onClick={() => {
                              if (isPlaying) {
                                // If currently playing, pause it
                                clearInterval(playInterval);
                                setIsPlaying(false);
                              } else {
                                // If at the last step, reset to beginning first
                                if (currentStep >= currentShipment.parts.length - 1) {
                                  setCurrentStep(0);
                                }
                                
                                // Start the animation
                                const interval = setInterval(() => {
                                  setCurrentStep(prevStep => {
                                    if (prevStep >= currentShipment.parts.length - 1) {
                                      clearInterval(interval);
                                      setIsPlaying(false);
                                      return prevStep;
                                    }
                                    return prevStep + 1;
                                  });
                                }, 1500);
                                setPlayInterval(interval);
                                setIsPlaying(true);
                              }
                            }}
                            className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-md flex items-center justify-center hover:bg-blue-700"
                          >
                            {isPlaying ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                          
                          <button 
                            onClick={() => setCurrentStep(Math.min(currentShipment.parts.length - 1, currentStep + 1))}
                            disabled={currentStep === currentShipment.parts.length - 1}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              currentStep === currentShipment.parts.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-700 shadow-md hover:bg-blue-50'
                            }`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Current Part Info */}
                      {currentStep < currentShipment.parts.length && (
                        <div className="p-4 border-t border-gray-200">
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-md mr-3 shadow-sm"
                              style={{ backgroundColor: `hsl(${currentStep * 30}, 70%, 65%)` }}
                            ></div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Step {currentStep + 1}: {currentShipment.parts[currentStep].part_name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {currentShipment.parts[currentStep].dimensions.length}" × 
                                {currentShipment.parts[currentStep].dimensions.width}" × 
                                {currentShipment.parts[currentStep].dimensions.height}"
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="bg-blue-50 p-2 rounded text-center">
                              <p className="text-xs text-gray-500">X Position</p>
                              <p className="text-sm font-medium text-blue-700">
                                {currentShipment.arrangement[currentStep].position.x}"
                              </p>
                            </div>
                            
                            <div className="bg-green-50 p-2 rounded text-center">
                              <p className="text-xs text-gray-500">Y Position</p>
                              <p className="text-sm font-medium text-green-700">
                                {currentShipment.arrangement[currentStep].position.y}"
                              </p>
                            </div>
                            
                            <div className="bg-purple-50 p-2 rounded text-center">
                              <p className="text-xs text-gray-500">Z Position</p>
                              <p className="text-sm font-medium text-purple-700">
                                {currentShipment.arrangement[currentStep].position.z}"
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;// FreightMind - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('overflow-hidden');
        });
    }
    
    // Form submission handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call with timeout
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
    
    // Demo section functionality
    const demoButton = document.querySelector('#demo button');
    if (demoButton) {
        demoButton.addEventListener('click', function() {
            // This would typically launch an interactive demo or redirect to a demo page
            alert('Full interactive demo coming soon! Check back for updates.');
        });
    }
    
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-fadeIn');
            }
        });
    };
    
    // Add animation class to elements
    document.querySelectorAll('section > div > h2').forEach(heading => {
        heading.classList.add('animate-on-scroll');
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    
    // Initial check for elements in view
    animateOnScroll();
    
    // Add hover effects to feature cards
    document.querySelectorAll('#features > div > div').forEach(card => {
        card.classList.add('hover-lift');
    });
});

// Product demo simulator for the "Try Demo" button in hero section
function launchDemo() {
    const demoContainer = document.createElement('div');
    demoContainer.className = 'fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50';
    demoContainer.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full max-h-90vh overflow-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">FreightMind Demo</h2>
                <button id="close-demo" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 class="text-xl font-medium mb-2">Interactive Demo Coming Soon</h3>
                <p class="text-gray-600 mb-6">We're preparing an interactive demo of the FreightMind packaging optimization software.</p>
                <p class="text-gray-600">In the meantime, you can schedule a personalized demo with our team.</p>
                <button class="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">Schedule Personalized Demo</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(demoContainer);
    document.body.classList.add('overflow-hidden');
    
    document.getElementById('close-demo').addEventListener('click', function() {
        document.body.removeChild(demoContainer);
        document.body.classList.remove('overflow-hidden');
    });
}

// Connect the hero section demo button
document.addEventListener('DOMContentLoaded', function() {
    const tryDemoButton = document.querySelector('.py-12.bg-gradient-to-r button:first-child');
    if (tryDemoButton) {
        tryDemoButton.addEventListener('click', launchDemo);
    }
});
