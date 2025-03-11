# AI Packaging Optimizer API Documentation

This document describes the JavaScript APIs available in the AI Packaging Optimizer application for developers who want to extend or integrate the functionality.

## Core Modules

The application is organized into several core modules:

1. **Main Application** - Core functionality and UI management
2. **Camera Capture** - Camera access and image processing
3. **DXF Parser** - Parsing and processing DXF files
4. **Box Packing Algorithm** - 3D bin packing optimization
5. **Part Detection Model** - Computer vision for part detection
6. **3D Viewer** - Visualization of packaging solutions

## Using the APIs

### Box Packer API

The `BoxPacker` class provides methods for optimizing the arrangement of parts in a box.

```javascript
// Create a new packer instance
const packer = new BoxPacker({
  padding: 2,     // inches of padding around all sides
  spacing: 1,     // minimum space between parts
  weightDistribution: true  // optimize for weight distribution
});

// Set the box dimensions
packer.setBox(24, 18, 12);  // width, height, depth in inches

// Add parts to be packed
packer.addPart({
  id: 1,
  name: 'Bracket Assembly',
  partNumber: 'PN-1234',
  dimensions: {
    width: 12,
    height: 8,
    depth: 3
  },
  weight: 2.5
});

// Add multiple parts at once
packer.addParts([part1, part2, part3]);

// Run the packing algorithm
const solution = packer.pack();

// Access the solution
console.log(solution.box);        // Box dimensions
console.log(solution.parts);      // Placed parts with positions
console.log(solution.stats);      // Statistics like space efficiency
```

### DXF Parser API

The `dxfParser` object provides methods for working with DXF files.

```javascript
// Parse a single DXF file
const fileBuffer = await readFileAsArrayBuffer(file);
const partData = await dxfParser.parseDXFFile(fileBuffer);

// Process multiple DXF files
const files = event.target.files;  // From file input element
const parts = await dxfParser.processMultipleDXFs(files);
```

### Part Detection Model API

The `partDetectionModel` object provides computer vision capabilities.

```javascript
// Load the model
await partDetectionModel.loadModel();

// Detect parts in an image
const image = document.getElementById('capturedImage');
const detectedParts = await partDetectionModel.detectParts(image);

// Estimate dimensions for a specific region of interest
const roi = { x: 100, y: 50, width: 300, height: 200 };
const dimensions = await partDetectionModel.estimateDimensions(image, roi);
```

### 3D Viewer API

The `viewer3D` object provides methods for visualizing packaging solutions.

```javascript
// Update the viewer with a solution
viewer3D.updateViewerWithSolution(solution);

// Show a specific packing step
viewer3D.showPackingStep(2, totalSteps);

// Animate the packing sequence
viewer3D.animatePackingSequence(solution.packingSteps, 1000);  // 1000ms per step

// Change the view perspective
viewer3D.changeView('top');  // 'perspective', 'top', 'front', 'side'

// Reset to default view
viewer3D.resetView();
```

## Data Structures

### Part Object

```javascript
{
  id: 1,                   // Unique identifier
  name: 'Bracket Assembly',  // Part name
  partNumber: 'PN-1234',   // Part number
  dimensions: {
    width: 12,             // Width in inches
    height: 8,             // Height in inches
    depth: 3               // Depth in inches
  },
  weight: 2.5,             // Weight in pounds
  position: {              // Position in the box (after packing)
    x: 2,                  // X coordinate from left
    y: 2,                  // Y coordinate from bottom
    z: 2                   // Z coordinate from back
  },
  orientation: 'horizontal'  // Orientation in the box
}
```

### Box Object

```javascript
{
  dimensions: {
    width: 24,    // Width in inches
    height: 18,   // Height in inches
    depth: 12     // Depth in inches
  },
  volume: 5184    // Volume in cubic inches
}
```

### Solution Object

```javascript
{
  box: {
    // Box object as described above
  },
  parts: [
    // Array of part objects with position information
  ],
  stats: {
    totalVolume: 1008,      // Total volume of all parts
    boxVolume: 5184,        // Volume of the box
    spaceEfficiency: 82,    // Space efficiency percentage
    unplacedParts: 0        // Number of parts that couldn't be placed
  },
  packingSteps: [
    // Step-by-step packing instructions
    {
      stepNumber: 1,
      partId: 1,
      title: 'Bracket Assembly',
      description: 'Place in the bottom with 2" padding on all sides',
      position: { x: 2, y: 2, z: 2 },
      orientation: 'horizontal',
      warning: 'Ensure 2" of padding material on all sides of the box'
    }
  ]
}
```

## Events

The application fires several custom events that you can listen for:

```javascript
// Listen for part detection
document.addEventListener('partsDetected', function(e) {
  const parts = e.detail.parts;
  console.log(`Detected ${parts.length} parts`);
});

// Listen for optimization completion
document.addEventListener('optimizationComplete', function(e) {
  const solution = e.detail.solution;
  console.log(`Optimization complete: ${solution.stats.spaceEfficiency}% efficiency`);
});

// Listen for packing step changes
document.addEventListener('packingStepChanged', function(e) {
  const stepNumber = e.detail.stepNumber;
  const totalSteps = e.detail.totalSteps;
  console.log(`Showing step ${stepNumber} of ${totalSteps}`);
});
```

## Integration Examples

### Integrating with a Shipping System

```javascript
// When optimization is complete
document.addEventListener('optimizationComplete', function(e) {
  const solution = e.detail.solution;
  
  // Send data to shipping API
  fetch('https://your-shipping-api.com/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dimensions: {
        length: solution.box.dimensions.width,
        width: solution.box.dimensions.depth,
        height: solution.box.dimensions.height
      },
      weight: solution.parts.reduce((sum, part) => sum + (part.weight || 0), 0)
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Shipping cost:', data.cost);
    document.getElementById('shippingCost').textContent = `$${data.cost}`;
  });
});
```

### Adding Custom Metrics

```javascript
// Calculate and display custom metrics
function calculateCustomMetrics(solution) {
  // Calculate weight distribution
  const totalWeight = solution.parts.reduce((sum, part) => sum + (part.weight || 0), 0);
  const weightDistribution = {};
  
  // Analyze weight distribution by position in box
  solution.parts.forEach(part => {
    const zone = determineZone(part.position, solution.box.dimensions);
    weightDistribution[zone] = (weightDistribution[zone] || 0) + (part.weight || 0);
  });
  
  // Display results
  const distributionElement = document.createElement('div');
  distributionElement.className = 'metric-card bg-white bg-opacity-70';
  distributionElement.innerHTML = `
    <p class="text-xs text-gray-500">Weight Distribution</p>
    <p class="text-sm font-bold text-gray-800">
      ${Math.round(getMaxWeightImbalance(weightDistribution) * 100)}% imbalance
    </p>
  `;
  
  document.querySelector('.grid').appendChild(distributionElement);
}

// Listen for optimization completion
document.addEventListener('optimizationComplete', function(e) {
  calculateCustomMetrics(e.detail.solution);
});
```

## Browser Compatibility

The APIs are compatible with modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

For older browsers, consider using polyfills for features like Promises, async/await, and fetch API.
