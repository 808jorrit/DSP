# Prompt Generator

## Overview

The **Prompt Generator** is a web-based tool designed to help users create professional and structured prompts for various content distribution channels. This project allows users to generate prompts based on different topics, audiences, and purposes. It also provides API integrations with **Gemini AI** and **OpenAI** to generate AI-powered outputs based on the created prompts.

## Features

- **User-friendly Interface:** Intuitive UI built with Bootstrap for easy navigation.
- **Prompt Creation:** Generate prompts based on topic, audience, purpose, and channel.
- **PDF Upload & Text Extraction:** Extract text from uploaded PDF files to generate summaries.
- **Save & Load Prompts:** Store generated prompts in local storage for future use.
- **Multiple AI Model Support:** Generate responses using **Gemini AI** and **OpenAI**.
- **API Key Storage:** Users can securely enter and use API keys for AI model interactions.
- **Multi-Tab Output:** View generated outputs from different AI models in separate tabs.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5
- **PDF Processing:** [PDF.js](https://mozilla.github.io/pdf.js/)
- **AI Integration:** OpenAI GPT & Gemini AI APIs
- **Local Storage:** Save and retrieve prompts for future use

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/prompt-generator.git
   ```
2. Navigate to the project folder:
   ```sh
   cd prompt-generator
   ```
3. Open `index.html` in your browser.

## Usage

1. Enter a **topic** for your prompt.
2. Select the **channel** where the content will be distributed.
3. Choose the **purpose** of the prompt.
4. Select the **target audience**.
5. Upload a **PDF file** (optional) to extract text for summarization.
6. Click **Generate Prompt** to create a structured prompt.
7. Click **Use Generated Prompt** to get responses from Gemini AI and OpenAI.
8. Save your generated prompts for later use.

## API Key Setup

To use Gemini AI and OpenAI for content generation:

1. Enter your API keys in the respective fields.
2. Click **Save API Key**.
3. Generate responses using the stored API keys.

## File Structure

```
/
├── index.html        # Main HTML file
├── styles.css        # CSS styles
├── script.js        # JavaScript logic
├── README.md         # Documentation
```

## Contributing

We welcome contributions! Feel free to fork the repository and submit pull requests.

## License

This project is unlicensed 

## Contact

For any issues or suggestions, feel free to open an issue on [GitHub](https://github.com/yourusername/prompt-generator/issues).
