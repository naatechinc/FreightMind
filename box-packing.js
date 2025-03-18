/**
 * AI Packaging Optimizer - Box Packing Algorithm
 * 
 * This module implements a 3D bin packing algorithm for optimizing
 * part arrangement within a box. It uses a variant of the Extreme Point
 * algorithm for 3D packing.
 */

/**
 * Box Packing Algorithm
 * 
 * @class BoxPacker
 */
class BoxPacker {
    /**
     * Create a new BoxPacker instance
     * 
     * @param {Object} options - Configuration options for the algorithm
     * @param {number} options.padding - Padding around all sides (inches)
     * @param {number} options.spacing - Minimum spacing between parts (inches)
     * @param {boolean} options.weightDistribution - Whether to optimize for weight distribution
     */
    constructor(options = {}) {
        this.padding = options.padding || 2;
        this.spacing = options.spacing || 1;
        this.weightDistribution = options.weightDistribution || true;
        
        this.box = null;
        this.parts = [];
        this.extremePoints = [];
        this.placedParts = [];
    }
    
    /**
     * Set the box dimensions for packing
     * 
     * @param {number} width - Box width (inches)
     * @param {number} height - Box height (inches)
     * @param {number} depth - Box depth (inches)
     * @returns {BoxPacker} - The BoxPacker instance for chaining
     */
    setBox(width, height, depth) {
        this.box = {
            width: width,
            height: height,
            depth: depth,
            volume: width * height * depth
        };
        
        // Initialize extreme points with the origin
        this.extremePoints = [{
            x: this.padding,
            y: this.padding,
            z: this.padding
        }];
        
        return this;
    }
    
    /**
     * Add a part to be packed
     * 
     * @param {Object} part - Part object with dimensions
     * @returns {BoxPacker} - The BoxPacker instance for chaining
     */
    addPart(part) {
        this.parts.push(part);
        return this;
    }
    
    /**
     * Add multiple parts to be packed
     * 
     * @param {Array} parts - Array of part objects
     * @returns {BoxPacker} - The BoxPacker instance for chaining
     */
    addParts(parts) {
        this.parts = [...this.parts, ...parts];
        return this;
    }
    
    /**
     * Run the packing algorithm
     * 
     * @returns {Object} - The packing solution
     */
    pack() {
        if (!this.box) {
            throw new Error('Box dimensions must be set before packing');
        }
        
        if (this.parts.length === 0) {
            throw new Error('No parts to pack');
        }
        
        // Sort parts by volume (largest first)
        const sortedParts = [...this.parts].sort((a, b) => {
            const volumeA = a.dimensions.width * a.dimensions.height * a.dimensions.depth;
            const volumeB = b.dimensions.width * b.dimensions.height * b.dimensions.depth;
            return volumeB - volumeA;
        });
        
        // Place each part
        for (const part of sortedParts) {
            this.placePart(part);
        }
        
        // Calculate statistics
        const totalVolume = this.placedParts.reduce((sum, part) => {
            return sum + (part.dimensions.width * part.dimensions.height * part.dimensions.depth);
        }, 0);
        
        const spaceEfficiency = Math.round((totalVolume / this.box.volume) * 100);
        
        // Return the solution
        return {
            box: this.box,
            parts: this.placedParts,
            stats: {
                totalVolume,
                boxVolume: this.box.volume,
                spaceEfficiency,
                unplacedParts: this.parts.length - this.placedParts.length
            },
            success: this.placedParts.length === this.parts.length
        };
    }
    
    /**
     * Place a part in the box at the best position
     * 
     * @param {Object} part - The part to place
     * @returns {boolean} - Whether the part was placed successfully
     */
    placePart(part) {
        // In a real implementation, this would try different orientations
        // and find the best position using the extreme point algorithm
        
        // For demo purposes, this is a simplified version that places parts
        // based on predetermined positions
        
        // Check if we have any extreme points
        if (this.extremePoints.length === 0) {
            return false;
        }
        
        // Get the first extreme point (in a real implementation, we would
        // evaluate all possible positions and orientations)
        const point = this.extremePoints.shift();
        
        // Check if the part fits at this position
        if (this.fitsPart(part, point)) {
            // Place the part
            const placedPart = {
                ...part,
                position: {
                    x: point.x,
                    y: point.y,
                    z: point.z
                }
            };
            
            this.placedParts.push(placedPart);
            
            // Add new extreme points
            this.addExtremePoints(placedPart);
            
            return true;
        }
        
        // If we reach here, the part couldn't be placed
        return false;
    }
    
    /**
     * Check if a part fits at the given position
     * 
     * @param {Object} part - The part to check
     * @param {Object} position - The position to check
     * @returns {boolean} - Whether the part fits
     */
    fitsPart(part, position) {
        // Check if the part would exceed box boundaries
        if (
            position.x + part.dimensions.width > this.box.width - this.padding ||
            position.y + part.dimensions.height > this.box.height - this.padding ||
            position.z + part.dimensions.depth > this.box.depth - this.padding
        ) {
            return false;
        }
        
        // In a real implementation, we would also check for overlap with other parts
        
        return true;
    }
    
    /**
     * Add new extreme points after placing a part
     * 
     * @param {Object} part - The placed part
     */
    addExtremePoints(part) {
        const { x, y, z } = part.position;
        const { width, height, depth } = part.dimensions;
        
        // Add extreme points (in a real implementation, we would
        // handle overlap checks and redundancy removal)
        this.extremePoints.push(
            { x: x + width + this.spacing, y, z },
            { x, y: y + height + this.spacing, z },
            { x, y, z: z + depth + this.spacing }
        );
    }
    
    /**
     * Calculate a suitable box size for a set of parts
     * 
     * @param {Array} parts - Array of parts to pack
     * @param {Object} options - Options for box sizing
     * @returns {Object} - Recommended box dimensions
     */
    static calculateBoxSize(parts, options = {}) {
        const padding = options.padding || 2;
        
        // Calculate the total volume of all parts
        const totalVolume = parts.reduce((sum, part) => {
            return sum + (part.dimensions.width * part.dimensions.height * part.dimensions.depth);
        }, 0);
        
        // Add padding and inefficiency factor
        const inefficiencyFactor = 1.3; // 30% extra space for inefficient packing
        const targetVolume = totalVolume * inefficiencyFactor;
        
        // Find the max dimensions of any single part
        const maxWidth = Math.max(...parts.map(p => p.dimensions.width)) + padding * 2;
        const maxHeight = Math.max(...parts.map(p => p.dimensions.height)) + padding * 2;
        const maxDepth = Math.max(...parts.map(p => p.dimensions.depth)) + padding * 2;
        
        // Calculate box dimensions that respect the max dimensions
        // and have approximately the target volume
        // This is a simplified approach for demo purposes
        
        // Start with the max dimensions
        let boxWidth = maxWidth;
        let boxHeight = maxHeight;
        let boxDepth = maxDepth;
        
        // Adjust to reach target volume
        const currentVolume = boxWidth * boxHeight * boxDepth;
        const scaleFactor = Math.pow(targetVolume / currentVolume, 1/3);
        
        boxWidth = Math.ceil(Math.max(boxWidth, boxWidth * scaleFactor));
        boxHeight = Math.ceil(Math.max(boxHeight, boxHeight * scaleFactor));
        boxDepth = Math.ceil(Math.max(boxDepth, boxDepth * scaleFactor));
        
        return {
            width: boxWidth,
            height: boxHeight,
            depth: boxDepth,
            volume: boxWidth * boxHeight * boxDepth
        };
    }
}

// Export the BoxPacker class
window.BoxPacker = BoxPacker;
