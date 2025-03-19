/**
 * AI Packaging Optimizer - DXF Parser
 * 
 * This module handles parsing DXF files and extracting part dimensions.
 * It now integrates with Make.com webhook for processing.
 */

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
            
            // For demo purposes, we'll still include the local parsing simulation
            // This will serve as a fallback if the webhook fails
            // In a real implementation, you might want to remove this
            const simulateLocalParsing = (callback) => {
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
                    
                    callback(partData);
                }, 500);
            };
            
            // Now, we'll actually send the file to the Make.com webhook
            sendToMakeWebhook(fileBuffer, fileName)
                .then(partData => {
                    resolve({
                        ...partData,
                        source: "make-webhook"
                    });
                })
                .catch(error => {
                    console.warn("Webhook processing failed, falling back to local processing", error);
                    simulateLocalParsing(resolve);
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
    
    // Show notification that we're sending to webhook
    showNotification('Sending file to Make.com for processing...', 'info');
    
    // Send to webhook
    const response = await fetch('https://hook.us1.make.com/v7sje53yg84kmw1fr95v3kquf3yh6yr2', {
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
    
    // Show success notification
    showNotification('File successfully processed by Make.com', 'success');
    
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
    const results = [];
    
    // Show initial notification
    showNotification(`Processing ${files.length} DXF file(s)...`, 'info');
    
    for (const file of files) {
        try {
            const arrayBuffer = await readFileAsArrayBuffer(file);
            const partData = await parseDXFFile(arrayBuffer, file.name);
            
            // Add filename info
            partData.filename = file.name;
            
            results.push(partData);
        } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            showNotification(`Error processing ${file.name}`, 'error');
        }
    }
    
    if (results.length > 0) {
        showNotification(`Successfully processed ${results.length} file(s)`, 'success');
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
 * Show notification
 * 
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (info, success, error)
 */
function showNotification(message, type = 'info') {
    // Check if the notification function exists in the global scope
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback to console if the global function doesn't exist
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Export DXF parser functions
window.dxfParser = {
    parseDXFFile,
    processMultipleDXFs
};
