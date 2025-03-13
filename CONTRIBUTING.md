# Contributing to AI Packaging Optimizer

Thank you for considering contributing to AI Packaging Optimizer! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to uphold our Code of Conduct. Please treat all community members with respect.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- Use the bug report template to create a detailed report including:
  - A clear title and description
  - Steps to reproduce the issue
  - Expected behavior vs actual behavior
  - Screenshots if applicable
  - Environment details (browser, OS, etc.)

### Suggesting Enhancements

- Check if the enhancement has already been suggested in the Issues section
- Use the feature request template and provide:
  - A clear title and description of the feature
  - Justification for the feature (why it would be useful)
  - Possible implementation approach

### Code Contributions

1. Fork the repository
2. Create a new branch for your feature or bugfix (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to your branch (`git push origin feature/your-feature-name`)
7. Submit a Pull Request

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-packaging-optimizer.git
   cd ai-packaging-optimizer
   ```

2. Since this is a static HTML/CSS/JS project, no installation is required. You can simply open the `index.html` file in your browser.

3. For a local development server, you can use:
   ```bash
   npm install
   npm start
   ```

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure any install or build dependencies are removed before the end of the layer
3. Update documentation as needed
4. The PR must be approved by at least one maintainer before being merged

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### HTML Styleguide

- Use 2 spaces for indentation
- Use semantic HTML5 elements appropriately
- Include alt attributes for images
- Close all HTML tags

### CSS Styleguide

- Use 2 spaces for indentation
- Use classes for styling, avoiding IDs when possible
- Use CSS variables for repeated values (colors, sizes, etc.)
- Group related properties together

### JavaScript Styleguide

- Use 2 spaces for indentation
- Use modern ECMAScript features where appropriate
- Use camelCase for variable and function names
- Use PascalCase for class names
- Document functions with JSDoc comments

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
