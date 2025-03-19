/**
 * AI Packaging Optimizer - Main JavaScript
 * 
 * This file contains the core functionality and initialization for the AI Packaging Optimizer.
 * Updated to support integration with Make.com webhook for DXF processing.
 */

// Application state
const appState = {
    detectedParts: [],
    currentStep: 1,
    totalSteps: 0,
    isPlaying: false,
    animationInterval: null,
    viewMode: 'perspective',
    webhookUrl: 'https://hook.us1.make.com/v7sje53yg84kmw1fr95v3kquf3yh6yr2'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    initUI();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize the 3D viewer (empty container)
    init3DViewer();
    
    console.log('AI Packaging Optimizer initialized');
});

// Initialize UI elements
function initUI() {
    // Hide loading elements
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
        el.style.display = 'none';
    });
    
    // Set version number if element exists
    const versionElement = document.getElementById('versionNumber');
    if (versionElement) {
        versionElement.textContent = '1.0.1'; // Incrementing version to reflect webhook integration
    }
}

// Initialize event listeners for UI interactions
function initEventListeners() {
    // Get elements
    const captureBtn = document.getElementById('captureBtn');
    const captureArea = document.getElementById('captureArea');
    const capturedContent = document.getElementById('capturedContent');
    const analysisOverlay = document.getElementById('analysisOverlay');
    const detectedParts = document.getElementById('detectedParts');
    const optimizeBtn = document.getElementById('optimizeBtn');
    const packagingSolution = document.getElementById('packagingSolution');
    const placeholderContent = document.getElementById('placeholderContent');
    const resetBtn = document.getElementById('resetBtn');
    const dxfUploadBtn = document.getElementById('dxfUploadBtn');
    const dxfFileInput = document.getElementById('dxfFileInput');
    const viewSelector = document.getElementById('viewSelector');
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const playBtn = document.getElementById('playBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    // Capture button click
    if (captureBtn) {
        captureBtn.addEventListener('click', function() {
            initializeCamera();
            captureArea.classList.add('hidden');
            capturedContent.classList.remove('hidden');
            
            // Simulate analysis with loading overlay
            setTimeout(function() {
                analysisOverlay.classList.add('hidden');
                detectedParts.classList.remove('hidden');
                placeholderContent.classList.add('hidden');
            }, 2000);
        });
    }
    
    // DXF Upload button
    if (dxfUploadBtn && dxfFileInput) {
        dxfUploadBtn.addEventListener('click', function() {
            dxfFileInput.click();
        });
        
        dxfFileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                processDXFFiles(e.target.files);
            }
        });
    }
    
    // Make upload zone dragable (if it exists)
    const uploadZone = document.querySelector('.upload-zone');
    if (uploadZone) {
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('border-blue-500', 'bg-blue-50');
        });
        
        uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('border-blue-500', 'bg-blue-50');
        });
        
        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('border-blue-500', 'bg-blue-50');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                // Filter for DXF files
                const dxfFiles = Array.from(files).filter(file => 
                    file.name.toLowerCase().endsWith('.dxf'));
                
                if (dxfFiles.length > 0) {
                    processDXFFiles(dxfFiles);
                } else {
                    showNotification('Please upload DXF files only', 'error');
                }
            }
        });
    }
    
    // Optimize button click
    if (optimizeBtn) {
        optimizeBtn.addEventListener('click', function() {
            // Show loading state
            optimizeBtn.innerHTML = '<span class="mr-2">⏳</span> Optimizing...';
            optimizeBtn.disabled = true;
            
            // Simulate optimization calculation
            setTimeout(function() {
                runPackingOptimization();
                packagingSolution.classList.remove('hidden');
                placeholderContent.classList.add('hidden');
                optimizeBtn.innerHTML = '<span class="mr-2">🧠</span> Optimize Packaging';
                optimizeBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Reset button click
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetApplication();
        });
    }
    
    // View selector change
    if (viewSelector) {
        viewSelector.addEventListener('change', function() {
            appState.viewMode = this.value;
            updateViewMode(this.value);
        });
    }
    
    // Animation controls
    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', function() {
            navigateStep(-1);
        });
    }
    
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', function() {
            navigateStep(1);
        });
    }
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            togglePlayAnimation();
        });
    }
    
    // Export button
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportSolution();
        });
    }
    
    // Add 3D effect to the box on hover
    const boxDisplay = document.querySelector('.box-display');
    if (boxDisplay) {
        boxDisplay.addEventListener('mousemove', function(e) {
            const box = document.querySelector('.box-3d');
            if (!box) return;
            
            // Get position relative to the element
            const rect = boxDisplay.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            const rotateY = (x / rect.width - 0.5) * 40;
            const rotateX = (y / rect.height - 0.5) * -40;
            
            // Apply rotation
            box.style.transform = `rotateX(${rotateX + 20}deg) rotateY(${rotateY + 30}deg)`;
        });
        
        boxDisplay.addEventListener('mouseleave', function() {
            const box = document.querySelector('.box-3d');
            if (!box) return;
            
            // Reset to original rotation
            box.style.transform = 'rotateX(20deg) rotateY(30deg)';
        });
    }
}

// Process DXF files - now with webhook integration
function processDXFFiles(files) {
    console.log('Processing DXF files:', files);
    
    // Show processing notification
    showNotification(`Processing ${files.length} DXF file(s)...`, 'info');
    
    // Show loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading mt-4';
    loadingElement.id = 'dxfLoadingIndicator';
    
    const uploadZone = document.querySelector('.upload-zone');
    if (uploadZone) {
        uploadZone.appendChild(loadingElement);
    }
    
    // Disable upload button
    const dxfUploadBtn = document.getElementById('dxfUploadBtn');
    if (dxfUploadBtn) {
        dxfUploadBtn.disabled = true;
    }
    
    // Use our updated dxfParser that now includes webhook integration
    window.dxfParser.processMultipleDXFs(files)
        .then(parts => {
            // Update detected parts
            appState.detectedParts = parts;
            
            // Clear loading
            const loadingIndicator = document.getElementById('dxfLoadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
            
            // Update UI with detected parts
            updatePartsListUI(parts);
            
            // Show detected parts section
            const detectedParts = document.getElementById('detectedParts');
            const placeholderContent = document.getElementById('placeholderContent');
            
            if (detectedParts && placeholderContent) {
                detectedParts.classList.remove('hidden');
                placeholderContent.classList.add('hidden');
            }
            
            // Enable upload button
            if (dxfUploadBtn) {
                dxfUploadBtn.disabled = false;
            }
            
            // Show success notification
            showNotification(`Successfully processed ${parts.length} part(s)`, 'success');
        })
        .catch(error => {
            console.error('Error processing DXF files:', error);
            
            // Clear loading
            const loadingIndicator = document.getElementById('dxfLoadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
            
            // Enable upload button
            if (dxfUploadBtn) {
                dxfUploadBtn.disabled = false;
            }
            
            // Show error notification
            showNotification('Error processing DXF files', 'error');
        });
}

// Update the parts list UI with detected parts
function updatePartsListUI(parts) {
    // Update parts count
    const partsCount = document.getElementById('partsCount');
    if (partsCount) {
        partsCount.textContent = parts.length;
    }
    
    // Get parts list element
    const partsList = document.getElementById('partsList');
    if (!partsList) return;
    
    // Clear existing content
    partsList.innerHTML = '';
    
    // Add each part to the list
    parts.forEach((part, index) => {
        // Calculate volume
        const volume = part.dimensions.width * part.dimensions.height * part.dimensions.depth;
        
        // Use part color or assign one based on index
        const color = part.color || 
            [
                '#3B82F6', // blue
                '#10B981', // green
                '#F59E0B', // amber
                '#EF4444', // red
                '#8B5CF6'  // purple
            ][index % 5];
        
        // Create part element
        const partElement = document.createElement('div');
        partElement.className = 'part-item';
        partElement.innerHTML = `
            <div class="flex items-center">
                <div class="part-icon" style="background-color: ${color};">
                    ${part.id}
                </div>
                <div>
                    <h3 class="text-sm font-medium text-gray-800">${part.name}</h3>
                    <p class="text-xs text-gray-500">${part.partNumber}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-sm font-medium text-gray-700">
                    ${part.dimensions.width}" × ${part.dimensions.height}" × ${part.dimensions.depth}"
                </p>
                <p class="text-xs text-gray-500">
                    Volume: ${Math.round(volume)} cu in
                </p>
            </div>
        `;
        
        // Add to list
        partsList.appendChild(partElement);
    });
}

// Initialize camera
function initializeCamera() {
    console.log('Initializing camera...');
    
    // In a real application, this would use the Web Camera API
    // For this demo, we'll simulate a camera capture
    
    // Simulate camera initialization delay
    setTimeout(function() {
        console.log('Camera initialized');
    }, 500);
}

// Run packing optimization algorithm
function runPackingOptimization() {
    console.log('Running packing optimization...');
    
    // In a real application, this would implement a bin packing algorithm
    // For this demo, we'll use the predefined solution
    
    // Set the total steps based on number of parts
    appState.totalSteps = appState.detectedParts.length;
    
    // Reset current step
    appState.currentStep = 1;
    
    // Update step counter
    updateStepInfo();
    
    // Fetch the packingSteps for each part
    appState.packingSteps = [
        {
            partId: 1,
            title: 'Bracket Assembly',
            description: 'Place in the bottom center of the box with 2" padding on all sides',
            position: {x: 2, y: 2, z: 2},
            orientation: 'Horizontal',
            warning: 'Ensure 2" of padding material on all sides of the box for optimal protection during transit.'
        },
        {
            partId: 2,
            title: 'Support Frame',
            description: 'Place on top of the Bracket Assembly with 1" spacing between parts',
            position: {x: 2, y: 3, z: 5},
            orientation: 'Horizontal',
            warning: 'Ensure parts do not touch directly to prevent damage during shipping.'
        }
    ];
    
    // Update total steps display
    const totalStepsElement = document.getElementById('totalSteps');
    if (totalStepsElement) {
        totalStepsElement.textContent = appState.totalSteps;
    }
    
    // Show first step
    showPackingStep(1);
}

// Update step information
function updateStepInfo() {
    // Update step counter
    const currentStepElement = document.getElementById('currentStepNumber');
    if (currentStepElement) {
        currentStepElement.textContent = appState.currentStep;
    }
    
    // Enable/disable navigation buttons
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    
    if (prevStepBtn) {
        prevStepBtn.disabled = appState.currentStep <= 1;
    }
    
    if (nextStepBtn) {
        nextStepBtn.disabled = appState.currentStep >= appState.totalSteps;
    }
}

// Show a specific packing step
function showPackingStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > appState.totalSteps) {
        return;
    }
    
    // Update current step
    appState.currentStep = stepNumber;
    
    // Get the step data
    const step = appState.packingSteps[stepNumber - 1];
    
    // Update step info panel
    const stepTitle = document.getElementById('stepTitle');
    const stepDescription = document.getElementById('stepDescription');
    const stepPosition = document.getElementById('stepPosition');
    const stepOrientation = document.getElementById('stepOrientation');
    const stepWarning = document.getElementById('stepWarning');
    
    if (stepTitle) stepTitle.textContent = step.title;
    if (stepDescription) stepDescription.textContent = step.description;
    if (stepPosition) stepPosition.textContent = `Position: X:${step.position.x}" Y:${step.position.y}" Z:${step.position.z}"`;
    if (stepOrientation) stepOrientation.textContent = `Orientation: ${step.orientation}`;
    if (stepWarning) stepWarning.textContent = step.warning;
    
    // Update 3D view - show only parts up to current step
    for (let i = 1; i <= appState.totalSteps; i++) {
        const partElement = document.getElementById(`part${i}`);
        if (partElement) {
            if (i <= stepNumber) {
                partElement.classList.remove('hidden');
            } else {
                partElement.classList.add('hidden');
            }
        }
    }
    
    // Update step indicator UI
    updateStepInfo();
}

// Navigate between steps
function navigateStep(direction) {
    const newStep = appState.currentStep + direction;
    if (newStep >= 1 && newStep <= appState.totalSteps) {
        showPackingStep(newStep);
    }
}

// Toggle play/pause animation
function togglePlayAnimation() {
    appState.isPlaying = !appState.isPlaying;
    
    const playBtn = document.getElementById('playBtn');
    
    if (appState.isPlaying) {
        // Start animation
        if (playBtn) {
            playBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            `;
        }
        
        // Reset to first step if at the end
        if (appState.currentStep >= appState.totalSteps) {
            appState.currentStep = 0;
        }
        
        // Start the animation interval
        appState.animationInterval = setInterval(function() {
            if (appState.currentStep < appState.totalSteps) {
                showPackingStep(appState.currentStep + 1);
            } else {
                // Stop at the end
                clearInterval(appState.animationInterval);
                appState.isPlaying = false;
                if (playBtn) {
                    playBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    `;
                }
            }
        }, 1500);
        
    } else {
        // Stop animation
        clearInterval(appState.animationInterval);
        if (playBtn) {
            playBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            `;
        }
    }
}

// Update view mode (perspective, top, front, side)
function updateViewMode(mode) {
    const packingContainer = document.getElementById('packingContainer');
    if (!packingContainer) return;
    
    switch (mode) {
        case 'perspective':
            packingContainer.style.transform = 'rotateX(30deg) rotateY(30deg)';
            break;
        case 'top':
            packingContainer.style.transform = 'rotateX(90deg) rotateY(0deg)';
            break;
        case 'front':
            packingContainer.style.transform = 'rotateX(0deg) rotateY(0deg)';
            break;
        case 'side':
            packingContainer.style.transform = 'rotateX(0deg) rotateY(90deg)';
            break;
    }
}

// Export the packaging solution
function exportSolution() {
    console.log('Exporting solution...');
    
    // Create a simple JSON representation of the solution
    const solution = {
        boxDimensions: {
            width: 28,
            height: 22,
            depth: 16
        },
        parts: appState.detectedParts,
        packingSteps: appState.packingSteps,
        stats: {
            totalVolume: 1008,
            spaceEfficiency: 82,
            shippingType: 'Undersized Shipping',
            courier: 'Standard Ground'
        },
        created: new Date().toISOString()
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(solution, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'packaging-solution.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success notification
    showNotification('Solution exported successfully', 'success');
}

// Reset the application to initial state
function resetApplication() {
    // Reset UI elements
    const captureArea = document.getElementById('captureArea');
    const capturedContent = document.getElementById('capturedContent');
    const analysisOverlay = document.getElementById('analysisOverlay');
    const detectedParts = document.getElementById('detectedParts');
    const packagingSolution = document.getElementById('packagingSolution');
    const placeholderContent = document.getElementById('placeholderContent');
    
    if (captureArea) captureArea.classList.remove('hidden');
    if (capturedContent) capturedContent.classList.add('hidden');
    if (analysisOverlay) analysisOverlay.classList.remove('hidden');
    if (detectedParts) detectedParts.classList.add('hidden');
    if (packagingSolution) packagingSolution.classList.add('hidden');
    if (placeholderContent) placeholderContent.classList.remove('hidden');
    
    // Reset animation state
    clearInterval(appState.animationInterval);
    appState.isPlaying = false;
    
    // Reset application state
    appState.detectedParts = [];
    appState.currentStep = 1;
    appState.totalSteps = 0;
    
    console.log('Application reset to initial state');
}

// Initialize 3D viewer
function init3DViewer() {
    console.log('Initializing 3D viewer...');
    // This would initialize a WebGL-based 3D viewer in a real application
    // For this demo, we're using CSS 3D transforms
}

// Show notification to the user
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-opacity duration-500 ${
        type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
        type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
        'bg-blue-100 text-blue-800 border border-blue-200'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <div class="mr-3 text-xl">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <p>${message}</p>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Make the notification function globally available
window.showNotification = showNotification;
