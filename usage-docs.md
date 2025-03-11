# AI Packaging Optimizer - Usage Guide

This document provides detailed instructions on how to use the AI Packaging Optimizer web application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Uploading DXF Files](#uploading-dxf-files)
3. [Using the Camera Capture](#using-the-camera-capture)
4. [Reviewing Detected Parts](#reviewing-detected-parts)
5. [Optimizing Packaging](#optimizing-packaging)
6. [Interacting with the 3D View](#interacting-with-the-3d-view)
7. [Exporting Solutions](#exporting-solutions)
8. [Troubleshooting](#troubleshooting)

## Getting Started

AI Packaging Optimizer is a web-based application that helps you optimize packaging arrangements for shipping parts. The application offers two ways to input your parts:

1. Upload SolidWorks DXF files
2. Capture images of parts using your camera

Once your parts are detected, the application will suggest an optimal packaging arrangement with step-by-step packing instructions.

## Uploading DXF Files

To upload DXF files from SolidWorks:

1. Click on the "Select DXF Files" button in the "Upload DXF Files" card
2. Select one or more DXF files from your computer
3. The application will process the files and extract part dimensions
4. Detected parts will appear in the "Detected Parts" section

**Supported DXF Features:**
- Part dimensions extraction
- Part orientation information
- Part metadata (when available)

## Using the Camera Capture

To detect parts using your camera:

1. Click on the "Capture Photo" button in the "Capture Parts Image" card
2. If prompted, allow the application to access your camera
3. Position your parts in the camera view and take a photo
4. The AI will analyze the image and detect parts
5. Detected parts will appear in the "Detected Parts" section

**Tips for Best Results:**
- Ensure good lighting for accurate detection
- Place parts on a contrasting background
- Avoid overlapping parts when possible
- Include a reference object of known size for better dimension estimation

## Reviewing Detected Parts

After uploading DXF files or capturing an image, the application will display the detected parts:

- Each part is listed with its name, part number, and dimensions
- Review the detected parts to ensure they are correct
- If parts are missing or incorrectly detected, you can try recapturing the image or using DXF files instead

## Optimizing Packaging

Once you have detected parts:

1. Click the "Optimize Packaging" button
2. The application will calculate the optimal packaging arrangement
3. A packaging solution will be displayed showing:
   - Box dimensions
   - Space efficiency
   - 3D visualization of the arrangement
   - Step-by-step packing instructions

## Interacting with the 3D View

The 3D visualization allows you to:

- Rotate the view by clicking and dragging
- Switch between perspective, top, front, and side views using the dropdown
- Step through the packing sequence using the navigation controls
- Play an animation of the complete packing sequence

**View Controls:**
- Left click and drag: Rotate the view
- View selector: Change between predefined views
- Play button: Animate the packing sequence
- Next/Previous buttons: Navigate through packing steps

## Exporting Solutions

To save your packaging solution:

1. Click the "Export" button in the Packaging Solution header
2. The solution will be downloaded as a JSON file
3. This file contains all information about the parts, box dimensions, and packing arrangement

You can import this JSON file into other systems or save it for future reference.

## Troubleshooting

**Issue: Parts not detected correctly in camera capture**
- Ensure good lighting conditions
- Use a contrasting background
- Avoid shadows on parts
- Try uploading DXF files instead for more accurate dimensions

**Issue: DXF files not processing correctly**
- Ensure files are saved from SolidWorks in a compatible format
- Check that parts are properly modeled in SolidWorks
- Try simplifying complex parts

**Issue: Browser compatibility problems**
- The application works best in modern browsers (Chrome, Firefox, Edge, Safari)
- Ensure your browser is up to date
- Enable JavaScript and allow camera access when prompted

For additional support, please open an issue on the GitHub repository.
