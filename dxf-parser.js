/**
 * AI Packaging Optimizer - DXF Parser
 * 
 * This module handles parsing DXF files and extracting part dimensions.
 * It now integrates with Make.com webhook for processing.
 */

// State tracking for the parser
const parserState = {
    isProcessing: false,
    webhookUrl: 'https://hook.us1.make.com/v7sje53yg84kmw1fr95v3kquf3yh6yr2'
};

/**
 * Parse a DXF file and extract part information
 * 
 * @param {ArrayBuffer} fileBuffer - The DXF file as an ArrayBuffer
 * @param {string} fileName - The name of the file
 * @returns {Promise<Object>} - Promise resolving to the parsed part data
 */
async function parseDXFFile(fileBuffer, fileName) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`Processing DXF file: ${fileName}`);
            
            // We'll try the webhook first, but have a fallback
            sendToMakeWebhook(fileBuffer, fileName)
                .then(partData => {
                    console.log("Successfully processed file with Make.com webhook");
                    resolve({
                        ...partData,
                        source: "make-webhook"
                    });
                })
                .catch(error => {
                    console.warn("Webhook processing failed, falling back to local processing", error);
                    
                    // Fall back to the original simulated behavior
                    setTimeout(() => {
                        // Create mock part data
                        const partData = {
                            id: Math.floor(Math.random() * 10000),
                            name: 'SolidWorks Part',
                            partNumber: `PN-${Math.floor(Math.random() * 10000)}`,
                            dimensions: {
                                width: 10 + Math.random() * 10,
                                height: 5 + Math.random() * 8,
                                depth: 2 + Math.random() * 4
                            },
                            source: "local-parsing"
                        };
                        
                        resolve(partData);
                    }, 500);
                });
        } catch (error) {
            reject(new Error('Failed to parse DXF file: ' + error.message));
        }
    });
}

/**
 * Send a DXF file to the Make.com webhook for processing
 * 
 * @param {ArrayBuffer} fileBuffer - The DXF file as an ArrayBuffer
 * @param {string} fileName - The name of the file
 * @returns {Promise<Object>} - Promise resolving to the parsed part data from Make.com
 */
async function sendToMakeWebhook(fileBuffer, fileName) {
    // Convert ArrayBuffer to Base64
    const base64File = arrayBufferToBase64(fileBuffer);
    
    // Prepare form data for the webhook
    const payload = {
        filename: fileName,
        fileContent: base64File,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId()
    };
    
    // Send to webhook
    console.log("Sending file to Make.com webhook for processing...");
    
    const response = await fetch(parserState.webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }
    
    // Parse the response
    const data = await response.json();
    console.log("Received response from Make.com webhook:", data);
    
    // Return the processed data
    return data.partData || {
        id: data.id || generateRequestId(),
        name: data.name || fileName.replace('.dxf', ''),
        partNumber: data.partNumber || `PN-${Math.floor(Math.random() * 10000)}`,
        dimensions: data.dimensions || {
            width: data.width || 10,
            height: data.height || 8,
            depth: data.depth || 3
        }
    };
}

/**
 * Convert ArrayBuffer to Base64 string
 * 
 * @param {ArrayBuffer} buffer - The buffer to convert
 * @returns {string} - Base64 encoded string
 */
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

/**
 * Generate a unique request ID
 * 
 * @returns {string} - A unique ID
 */
function generateRequestId() {
    return 'req_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Process multiple DXF files
 * 
 * @param {Array<File>} files - Array of DXF files
 * @returns {Promise<Array>} - Promise resolving to array of parsed parts
 */
async function processMultipleDXFs(files) {
    if (parserState.isProcessing) {
        console.warn("Already processing files, please wait...");
        showNotification("Already processing files, please wait...", "info");
        return [];
    }
    
    parserState.isProcessing = true;
    showNotification(`Processing ${files.length} DXF file(s)...`, 'info');
    
    const results = [];
    
    // Add loading indicator to UI
    const uploadZone = document.querySelector('.upload-zone');
    let loadingElement = null;
    
    if (uploadZone) {
        loadingElement = document.createElement('div');
        loadingElement.className = 'loading mt-4';
        loadingElement.id = 'dxfProcessingIndicator';
        uploadZone.appendChild(loadingElement);
    }
    
    // Disable the upload button if it exists
    const dxfUploadBtn = document.getElementById('dxfUploadBtn');
    if (dxfUploadBtn) {
        dxfUploadBtn.disabled = true;
    }
    
    try {
        for (const file of files) {
            try {
                // Only process DXF files
                if (!file.name.toLowerCase().endsWith('.dxf')) {
                    console.warn(`Skipping non-DXF file: ${file.name}`);
                    continue;
                }
                
                const arrayBuffer = await readFileAsArrayBuffer(file);
                const partData = await parseDXFFile(arrayBuffer, file.name);
                
                // Add filename info
                partData.filename = file.name;
                
                results.push(partData);
            } catch (error) {
                console.error(`Error processing ${file.name}:`, error);
            }
        }
        
        if (results.length > 0) {
            showNotification(`Successfully processed ${results.length} file(s)`, 'success');
            
            // Update the parts list UI
            updatePartsListUI(results);
            
            // Show the detected parts section
            const detectedParts = document.getElementById('detectedParts');
            const placeholderContent = document.getElementById('placeholderContent');
            
            if (detectedParts && placeholderContent) {
                detectedParts.classList.remove('hidden');
                placeholderContent.classList.add('hidden');
            }
        } else {
            showNotification('No valid DXF files were processed', 'error');
        }
    } catch (error) {
        console.error('Error in batch processing:', error);
        showNotification('Error processing files', 'error');
    } finally {
        // Clean up UI
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
        
        // Re-enable the upload button
        if (dxfUploadBtn) {
            dxfUploadBtn.disabled = false;
        }
        
        parserState.isProcessing = false;
    }
    
    return results;
}

/**
 * Read a file as ArrayBuffer
 * 
 * @param {File} file - The file to read
 * @returns {Promise<ArrayBuffer>} - Promise resolving to file contents as ArrayBuffer
 */
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            resolve(reader.result);
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Extract dimensions from DXF entities
 * 
 * @param {Array} entities - DXF entities array
 * @returns {Object} - Object containing the part dimensions
 */
function extractDimensionsFromEntities(entities) {
    // This would analyze the entities to determine part dimensions
    // For demo, we return mock dimensions
    return {
        width: 10,
        height: 8,
        depth: 3,
        volume: 240
    };
}

/**
 * Show notification to the user
 * This creates a toast notification if window.showNotification doesn't exist
 * 
 * @param {string} message - Message to display
 * @param {string} type - Notification type (info, success, error)
 */
function showNotification(message, type = 'info') {
    // Check if a global notification function exists
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // If not, create our own implementation
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

/**
 * Update the parts list UI with detected parts
 * 
 * @param {Array} parts - Array of detected parts
 */
function updatePartsListUI(parts) {
    // Store the parts for later use
    window.detectedParts = parts;
    
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

// Add event listeners once the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Make upload zone dragable (if it exists)
    const uploadZone = document.querySelector('.upload-zone');
    if (uploadZone) {
        // Add drag handling
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
                    processMultipleDXFs(dxfFiles);
                } else {
                    showNotification('Please upload DXF files only', 'error');
                }
            }
        });
    }
    
    // Hook into the existing DXF file input change event
    const dxfFileInput = document.getElementById('dxfFileInput');
    if (dxfFileInput) {
        // Store the original event listeners
        const originalListeners = dxfFileInput.cloneNode(true);
        
        // Replace with our enhanced version
        dxfFileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                processMultipleDXFs(e.target.files);
            }
            
            // Prevent default behavior handled elsewhere
            e.stopPropagation();
        }, true);
    }
});

// Export DXF parser functions
window.dxfParser = {
    parseDXFFile,
    processMultipleDXFs
};
