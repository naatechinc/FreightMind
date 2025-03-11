// FreightMind - Main JavaScript

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

// Launch the FreightMind app
function launchFreightMindApp() {
    // Create a full-screen container for the app
    const appContainer = document.createElement('div');
    appContainer.className = 'fixed inset-0 bg-gray-50 z-50 flex flex-col';
    appContainer.id = 'freightmind-app-container';
    
    // Create the app header with close button
    appContainer.innerHTML = `
        <header class="bg-white shadow-sm p-4 flex justify-between items-center">
            <div>
                <h1 class="text-xl font-semibold text-gray-900">AI Packaging Optimizer</h1>
                <p class="mt-1 text-sm text-gray-500">Optimize your shipping packages with AI-powered arrangement</p>
            </div>
            <button id="close-app" class="p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </header>
        <main id="app-content" class="flex-1 overflow-y-auto"></main>
    `;
    
    document.body.appendChild(appContainer);
    document.body.classList.add('overflow-hidden');
    
    // Add event listener to close button
    document.getElementById('close-app').addEventListener('click', function() {
        document.body.removeChild(appContainer);
        document.body.classList.remove('overflow-hidden');
    });
    
    // Load the FreightMind app
    loadFreightMindApp();
}

// Load the FreightMind app content
function loadFreightMindApp() {
    const appContent = document.getElementById('app-content');
    
    // Insert the app HTML structure
    appContent.innerHTML = `
        <div class="min-h-full bg-gray-50">
            <!-- Main content -->
            <main class="max-w-7xl mx-auto p-4">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <!-- Left panel - Input -->
                    <div class="space-y-6">
                        <!-- DXF Upload -->
                        <div class="bg-white shadow rounded-lg p-6">
                            <h2 class="text-lg font-medium text-gray-900 mb-4">Upload DXF Files</h2>
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p class="mt-2 text-sm text-gray-500">
                                    Upload SolidWorks DXF files to extract part data
                                </p>
                                <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    Select DXF Files
                                </button>
                            </div>
                        </div>
                        
                        <!-- Camera Capture -->
                        <div class="bg-white shadow rounded-lg p-6">
                            <h2 class="text-lg font-medium text-gray-900 mb-4">Capture Parts Image</h2>
                            
                            <div class="space-y-4">
                                <div id="camera-capture-area" 
                                    class="border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50"
                                    style="min-height: 200px"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p class="text-sm text-gray-500 text-center">
                                        Take a photo of your parts to detect them automatically
                                    </p>
                                    <button 
                                        id="capture-photo-btn"
                                        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Capture Photo
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Detected Parts (initially hidden) -->
                        <div id="detected-parts-container" class="bg-white shadow rounded-lg p-6 hidden">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-lg font-medium text-gray-900">Detected Parts (<span id="parts-count">0</span>)</h2>
                                <button
                                    id="optimize-packaging-btn"
                                    class="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Optimize Packaging
                                </button>
                            </div>
                            <ul id="detected-parts-list" class="divide-y divide-gray-200">
                                <!-- Parts will be inserted here -->
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Right panel - Output -->
                    <div class="space-y-6">
                        <!-- Packaging Solution (initially hidden) -->
                        <div id="packaging-solution-container" class="bg-white shadow rounded-lg p-6 hidden">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-lg font-medium text-gray-900">
                                    Packaging Solution
                                </h2>
                                <div class="flex space-x-2">
                                    <button
                                        id="reset-app-btn"
                                        class="px-3 py-1.5 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        class="px-3 py-1.5 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Retry Analysis
                        </button>
                    </div>
                `;
                
                // Add event listeners for the new buttons
                document.getElementById('recapture-btn')?.addEventListener('click', resetCaptureArea);
                document.getElementById('recapture-photo-btn')?.addEventListener('click', resetCaptureArea);
                document.getElementById('retry-analysis-btn')?.addEventListener('click', function() {
                    alert('Reanalyzing image...');
                    
                    // Simulate processing delay
                    setTimeout(() => {
                        displayDetectedParts(parts);
                    }, 1500);
                });
                
                // Display detected parts
                displayDetectedParts(parts);
            }, 1500);
        }
    }
    
    function resetCaptureArea() {
        const cameraArea = document.getElementById('camera-capture-area');
        if (cameraArea) {
            cameraArea.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-sm text-gray-500 text-center">
                    Take a photo of your parts to detect them automatically
                </p>
                <button 
                    id="capture-photo-btn"
                    class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Capture Photo
                </button>
            `;
            
            // Reattach the event listener
            document.getElementById('capture-photo-btn')?.addEventListener('click', function() {
                capturePhoto(sampleParts);
            });
        }
        
        // Hide the detected parts container
        const detectedPartsContainer = document.getElementById('detected-parts-container');
        if (detectedPartsContainer) {
            detectedPartsContainer.classList.add('hidden');
        }
    }
    
    function displayDetectedParts(parts) {
        const detectedPartsContainer = document.getElementById('detected-parts-container');
        const detectedPartsList = document.getElementById('detected-parts-list');
        const partsCount = document.getElementById('parts-count');
        
        if (detectedPartsContainer && detectedPartsList && partsCount) {
            // Update parts count
            partsCount.textContent = parts.length;
            
            // Clear existing list
            detectedPartsList.innerHTML = '';
            
            // Add parts to list
            parts.forEach((part, index) => {
                const li = document.createElement('li');
                li.className = 'py-3';
                li.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-medium text-gray-800">${part.part_name}</h3>
                            <p class="text-xs text-gray-500">${part.part_number}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-600">
                                ${part.dimensions.length}" × ${part.dimensions.width}" × ${part.dimensions.height}"
                            </p>
                        </div>
                    </div>
                `;
                detectedPartsList.appendChild(li);
            });
            
            // Show the container
            detectedPartsContainer.classList.remove('hidden');
        }
    }
    
    function generatePackagingSolution(solution) {
        const packagingSolutionContainer = document.getElementById('packaging-solution-container');
        if (packagingSolutionContainer) {
            packagingSolutionContainer.classList.remove('hidden');
            
            // Update box dimensions
            const boxDimensions = document.getElementById('box-dimensions');
            const boxDimensionsDisplay = document.getElementById('box-dimensions-display');
            const shipmentPartsCount = document.getElementById('shipment-parts-count');
            
            if (boxDimensions && boxDimensionsDisplay && shipmentPartsCount) {
                const dims = solution.shipments[0].box_dimensions;
                const dimensionsText = `${dims.length}" × ${dims.width}" × ${dims.height}"`;
                boxDimensions.textContent = dimensionsText;
                boxDimensionsDisplay.textContent = `Box dimensions: ${dimensionsText}`;
                shipmentPartsCount.textContent = solution.shipments[0].parts.length;
            }
            
            // Update step display
            currentStep = 0;
            updateStepDisplay();
            updateViewMode();
        }
    }
    
    function updateStepDisplay() {
        const currentStepDisplay = document.getElementById('current-step-display');
        const totalStepsDisplay = document.getElementById('total-steps-display');
        const currentPartName = document.getElementById('current-part-name');
        const currentPartDimensions = document.getElementById('current-part-dimensions');
        const xPosition = document.getElementById('x-position');
        const yPosition = document.getElementById('y-position');
        const zPosition = document.getElementById('z-position');
        
        if (currentStepDisplay && totalStepsDisplay && sampleParts.length > 0) {
            currentStepDisplay.textContent = currentStep + 1;
            totalStepsDisplay.textContent = sampleParts.length;
            
            // Update current part info
            if (currentPartName && currentPartDimensions && xPosition && yPosition && zPosition) {
                const part = sampleParts[currentStep];
                const arrangement = sampleSolution.shipments[0].arrangement[currentStep];
                
                currentPartName.textContent = part.part_name;
                currentPartDimensions.textContent = `${part.dimensions.length}" × ${part.dimensions.width}" × ${part.dimensions.height}"`;
                xPosition.textContent = `${arrangement.position.x}"`;
                yPosition.textContent = `${arrangement.position.y}"`;
                zPosition.textContent = `${arrangement.position.z}"`;
            }
            
            // Update navigation button states
            const prevStepBtn = document.getElementById('prev-step-btn');
            const nextStepBtn = document.getElementById('next-step-btn');
            
            if (prevStepBtn) {
                if (currentStep === 0) {
                    prevStepBtn.classList.remove('bg-white', 'text-gray-700', 'hover:bg-blue-50', 'shadow-md');
                    prevStepBtn.classList.add('bg-gray-200', 'text-gray-400');
                } else {
                    prevStepBtn.classList.remove('bg-gray-200', 'text-gray-400');
                    prevStepBtn.classList.add('bg-white', 'text-gray-700', 'hover:bg-blue-50', 'shadow-md');
                }
            }
            
            if (nextStepBtn) {
                if (currentStep === sampleParts.length - 1) {
                    nextStepBtn.classList.remove('bg-white', 'text-gray-700', 'hover:bg-blue-50', 'shadow-md');
                    nextStepBtn.classList.add('bg-gray-200', 'text-gray-400');
                } else {
                    nextStepBtn.classList.remove('bg-gray-200', 'text-gray-400');
                    nextStepBtn.classList.add('bg-white', 'text-gray-700', 'hover:bg-blue-50', 'shadow-md');
                }
            }
            
            // Update part visibility
            updatePartsVisibility();
        }
    }
    
    function updatePartsVisibility() {
        // In a real app, we would update the 3D view based on currentStep
        // For this demo, we'll just show all parts up to the current step
    }
    
    function updateViewMode() {
        const topViewContainer = document.getElementById('top-view-container');
        const sideViewContainer = document.getElementById('side-view-container');
        
        if (topViewContainer && sideViewContainer) {
            if (viewMode === 'top') {
                topViewContainer.classList.remove('hidden');
                sideViewContainer.classList.add('hidden');
            } else {
                topViewContainer.classList.add('hidden');
                sideViewContainer.classList.remove('hidden');
            }
        }
    }
    
    function togglePlayPause() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        
        if (isPlaying) {
            // Pause the animation
            clearInterval(playInterval);
            isPlaying = false;
            
            if (playPauseBtn) {
                playPauseBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                `;
            }
        } else {
            // If at the last step, reset to beginning
            if (currentStep >= sampleParts.length - 1) {
                currentStep = 0;
                updateStepDisplay();
            }
            
            // Start the animation
            isPlaying = true;
            playInterval = setInterval(() => {
                if (currentStep >= sampleParts.length - 1) {
                    clearInterval(playInterval);
                    isPlaying = false;
                    
                    if (playPauseBtn) {
                        playPauseBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        `;
                    }
                    return;
                }
                
                currentStep++;
                updateStepDisplay();
            }, 1500);
            
            if (playPauseBtn) {
                playPauseBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                `;
            }
        }
    }
    
    function resetApp() {
        // Reset app state
        if (isPlaying) {
            clearInterval(playInterval);
            isPlaying = false;
        }
        
        currentStep = 0;
        
        // Hide solution container
        const packagingSolutionContainer = document.getElementById('packaging-solution-container');
        if (packagingSolutionContainer) {
            packagingSolutionContainer.classList.add('hidden');
        }
        
        // Reset camera area
        resetCaptureArea();
    }
}

// Connect the Try Demo and Get Started buttons to launch the app
document.addEventListener('DOMContentLoaded', function() {
    // Try Demo button in hero section
    const tryDemoButton = document.querySelector('.py-12.bg-gradient-to-r button:first-child');
    if (tryDemoButton) {
        tryDemoButton.addEventListener('click', launchFreightMindApp);
    }
    
    // Get Started button in header
    const getStartedButton = document.querySelector('header button');
    if (getStartedButton) {
        getStartedButton.addEventListener('click', launchFreightMindApp);
    }
}); stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                        Export
                                    </button>
                                </div>
                            </div>
                            
                            <div id="current-shipment">
                                <div class="p-2 rounded-md bg-gray-100 mb-4">
                                    <p class="text-sm font-medium text-gray-900">
                                        Box Dimensions: <span id="box-dimensions">24" × 18" × 12"</span>
                                    </p>
                                    <p class="text-sm text-gray-500">
                                        <span id="shipment-parts-count">2</span> parts in this shipment
                                    </p>
                                    <span class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Undersized Shipping
                                    </span>
                                </div>
                                
                                <!-- 3D Visualization -->
                                <div id="packaging-visualization" class="w-full h-64 border border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <div class="text-center p-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <p class="text-sm text-gray-600" id="box-dimensions-display">
                                            Box dimensions: 28" × 22" × 16"
                                        </p>
                                    </div>
                                </div>
                                
                                <!-- 3D Pictorial Packing Guide -->
                                <div class="mt-6 border border-gray-200 rounded-lg">
                                    <div class="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                        <h3 class="text-sm font-medium text-gray-700">3D Assembly Sequence</h3>
                                        <div class="flex items-center space-x-4">
                                            <div class="flex items-center space-x-2">
                                                <span class="text-xs text-gray-500">View:</span>
                                                <select 
                                                    id="view-mode-select"
                                                    class="text-xs border-gray-300 rounded-md"
                                                >
                                                    <option value="top">Top View</option>
                                                    <option value="side">Side View</option>
                                                </select>
                                            </div>
                                            <span class="text-xs text-gray-500">
                                                Step <span id="current-step-display" class="font-medium">1</span> of <span id="total-steps-display" class="font-medium">2</span>
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <!-- 3D Rendering Area -->
                                    <div class="relative bg-gray-100" style="height: 300px">
                                        <div id="3d-view-container" class="absolute inset-0 flex items-center justify-center">
                                            <!-- Top view rendering area -->
                                            <div 
                                                id="top-view-container"
                                                class="border border-gray-300 bg-white shadow-lg"
                                                style="width: 280px; height: 280px; position: relative;"
                                            >
                                                <!-- Top View Label -->
                                                <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-t border border-gray-300 border-b-0">
                                                    Top View (X-Y Plane)
                                                </div>
                                                
                                                <!-- Parts will be rendered here -->
                                                <div id="part-1" class="absolute shadow-md" style="left: 10px; top: 10px; width: 60px; height: 40px; background-color: hsl(0, 70%, 65%); border: 1px solid rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;">
                                                    <span class="text-xs text-white font-bold">1</span>
                                                </div>
                                                
                                                <!-- Coordinate labels -->
                                                <div class="absolute -left-4 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-500">Y</div>
                                                <div class="absolute bottom-0 left-1/2 transform -translate-y-4 text-xs font-medium text-gray-500">X</div>
                                            </div>
                                            
                                            <!-- Side view rendering area (initially hidden) -->
                                            <div 
                                                id="side-view-container"
                                                class="border border-gray-300 bg-white shadow-lg hidden"
                                                style="width: 280px; height: 280px; position: relative;"
                                            >
                                                <!-- Side View Label -->
                                                <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-t border border-gray-300 border-b-0">
                                                    Side View (X-Z Plane)
                                                </div>
                                                
                                                <!-- Parts will be rendered here -->
                                                <div id="part-1-side" class="absolute shadow-md" style="left: 10px; bottom: 10px; width: 60px; height: 15px; background-color: hsl(0, 70%, 65%); border: 1px solid rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;">
                                                    <span class="text-xs text-white font-bold">1</span>
                                                </div>
                                                
                                                <!-- Coordinate labels -->
                                                <div class="absolute -left-4 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-500">Z</div>
                                                <div class="absolute bottom-0 left-1/2 transform -translate-y-4 text-xs font-medium text-gray-500">X</div>
                                            </div>
                                        </div>
                                        
                                        <!-- Navigation Controls Overlay -->
                                        <div class="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-3">
                                            <button 
                                                id="prev-step-btn"
                                                class="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            
                                            <button 
                                                id="play-pause-btn"
                                                class="w-12 h-12 rounded-full bg-blue-600 text-white shadow-md flex items-center justify-center hover:bg-blue-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                            
                                            <button 
                                                id="next-step-btn"
                                                class="w-10 h-10 rounded-full bg-white text-gray-700 shadow-md hover:bg-blue-50 flex items-center justify-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <!-- Current Part Info -->
                                    <div class="p-4 border-t border-gray-200">
                                        <div class="flex items-center">
                                            <div 
                                                class="w-8 h-8 rounded-md mr-3 shadow-sm"
                                                style="background-color: hsl(0, 70%, 65%)"
                                            ></div>
                                            <div>
                                                <h4 class="font-medium text-gray-900">
                                                    Step 1: <span id="current-part-name">Bracket Assembly</span>
                                                </h4>
                                                <p class="text-sm text-gray-500" id="current-part-dimensions">
                                                    12" × 8" × 3"
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div class="mt-3 grid grid-cols-3 gap-2">
                                            <div class="bg-blue-50 p-2 rounded text-center">
                                                <p class="text-xs text-gray-500">X Position</p>
                                                <p class="text-sm font-medium text-blue-700" id="x-position">
                                                    2"
                                                </p>
                                            </div>
                                            
                                            <div class="bg-green-50 p-2 rounded text-center">
                                                <p class="text-xs text-gray-500">Y Position</p>
                                                <p class="text-sm font-medium text-green-700" id="y-position">
                                                    2"
                                                </p>
                                            </div>
                                            
                                            <div class="bg-purple-50 p-2 rounded text-center">
                                                <p class="text-xs text-gray-500">Z Position</p>
                                                <p class="text-sm font-medium text-purple-700" id="z-position">
                                                    2"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
    
    // Initialize the app functionality
    initializeFreightMindApp();
}

// Initialize the FreightMind app functionality
function initializeFreightMindApp() {
    // Sample data
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
    
    // Sample packaging solution
    const sampleSolution = {
        shipments: [
            {
                parts: sampleParts,
                is_oversized: false,
                box_dimensions: {
                    length: 28,
                    width: 22,
                    height: 16
                },
                arrangement: [
                    {
                        part_number: "PN-1234",
                        position: { x: 2, y: 2, z: 2 },
                        rotation: 0
                    },
                    {
                        part_number: "PN-5678",
                        position: { x: 2, y: 12, z: 2 },
                        rotation: 0
                    }
                ]
            }
        ],
        total_shipments: 1
    };
    
    let currentStep = 0;
    let isPlaying = false;
    let playInterval = null;
    let viewMode = "top";
    
    // Event listeners
    const capturePhotoBtn = document.getElementById('capture-photo-btn');
    if (capturePhotoBtn) {
        capturePhotoBtn.addEventListener('click', function() {
            capturePhoto(sampleParts);
        });
    }
    
    const optimizePackagingBtn = document.getElementById('optimize-packaging-btn');
    if (optimizePackagingBtn) {
        optimizePackagingBtn.addEventListener('click', function() {
            generatePackagingSolution(sampleSolution);
        });
    }
    
    const resetAppBtn = document.getElementById('reset-app-btn');
    if (resetAppBtn) {
        resetAppBtn.addEventListener('click', resetApp);
    }
    
    const viewModeSelect = document.getElementById('view-mode-select');
    if (viewModeSelect) {
        viewModeSelect.addEventListener('change', function() {
            viewMode = this.value;
            updateViewMode();
        });
    }
    
    const prevStepBtn = document.getElementById('prev-step-btn');
    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', function() {
            if (currentStep > 0) {
                currentStep--;
                updateStepDisplay();
            }
        });
    }
    
    const nextStepBtn = document.getElementById('next-step-btn');
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', function() {
            if (currentStep < sampleParts.length - 1) {
                currentStep++;
                updateStepDisplay();
            }
        });
    }
    
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    // Functions
    function capturePhoto(parts) {
        // Simulate capturing a photo
        const cameraArea = document.getElementById('camera-capture-area');
        if (cameraArea) {
            // Show a loading spinner
            cameraArea.innerHTML = `
                <div class="text-center">
                    <svg class="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="text-sm text-gray-600">Processing image...</p>
                </div>
            `;
            
            // Simulate processing delay
            setTimeout(() => {
                // Show captured image
                cameraArea.innerHTML = `
                    <div class="relative w-full">
                        <img src="/api/placeholder/400/300" alt="Captured parts" class="w-full rounded-lg">
                        <button 
                            id="recapture-btn"
                            class="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="flex justify-between mt-3">
                        <button
                            id="recapture-photo-btn"
                            class="px-3 py-1.5 border border-blue-500 text-sm font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Recapture Photo
                        </button>
                        
                        <button
                            id="retry-analysis-btn"
                            class="px-3 py-1.5 border border-green-500 text-sm font-medium rounded text-green-700 bg-green-50 hover:bg-green-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"

// Connect the hero section demo button
document.addEventListener('DOMContentLoaded', function() {
    const tryDemoButton = document.querySelector('.py-12.bg-gradient-to-r button:first-child');
    if (tryDemoButton) {
        tryDemoButton.addEventListener('click', launchDemo);
    }
});
