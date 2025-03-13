# AI Packaging Optimizer

![AI Packaging Optimizer](assets/img/logo.svg)

AI Packaging Optimizer is a web-based application that uses artificial intelligence to help optimize packaging solutions for shipping parts and products. The tool analyzes part dimensions from DXF files or direct camera captures to suggest the most efficient packaging arrangement.

## 🚀 Features

- **DXF File Import**: Upload SolidWorks DXF files to extract part dimensions and properties
- **Computer Vision Part Detection**: Use your camera to capture and automatically detect parts
- **AI-Powered Arrangement**: Optimize packaging layouts using advanced algorithms
- **3D Visualization**: View interactive 3D representations of packaging solutions
- **Step-by-Step Packing Instructions**: Clear guidance on how to pack items efficiently
- **Export Capabilities**: Save and share your packaging solutions

## 📋 Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Camera access for part detection feature (optional)

## 🛠️ Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/ai-packaging-optimizer.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ai-packaging-optimizer
   ```

3. Open `index.html` in your web browser, or use a local development server:
   ```bash
   # Using Python's built-in HTTP server
   python -m http.server
   
   # Or using Node.js with http-server
   npx http-server
   ```

## 📱 Usage

1. **Upload DXF Files** or **Capture Parts** using your camera
2. Review detected parts and their dimensions
3. Click "Optimize Packaging" to generate a solution
4. View the 3D visualization and step-by-step packing instructions
5. Export the solution if needed

## 🧠 How It Works

AI Packaging Optimizer uses a combination of DXF parsing algorithms and computer vision models to identify parts and their dimensions. The core optimization engine uses a bin packing algorithm with constraints for proper padding and orientation requirements.

The application prioritizes:
- Minimal packaging size
- Proper protection for all parts
- Efficient space utilization
- Logical packing sequence

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

If you have any questions or suggestions, please open an issue on GitHub or contact the maintainers.
