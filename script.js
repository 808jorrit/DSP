    document.getElementById('pdf-upload').addEventListener('change', handlePdfUpload);

    let extractedPdfText = '';

    async function handlePdfUpload(event) {
      const file = event.target.files[0];
      if (!file || file.type !== 'application/pdf') {
        alert('File Error.');
        return;
      }

      extractedPdfText = ''; // Clear previously extracted text
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        extractedPdfText += pageText + '\n';
      }
    }

    function generatePrompt() {
      // Retrieve input values
      const topic = document.getElementById('topic').value;
      const channels = Array.from(document.getElementById('channel').selectedOptions).map(opt => opt.text);
      const purpose = document.getElementById('purpose').value;
      const audience = document.getElementById('audience').value;
      const specifications = document.getElementById('specifications').value;

      let promptText = 'Act as if you are a professional marketeer. You are going to generate a short story / summary based on the raw text with a specific goal, format, and tone. ';

      if (topic) {
        promptText += `The topic of the paper is ${topic}. `;
      }

      if (channels.length > 0) {
        promptText += `The content will be distributed on ${channels.join(', ')} adjust length, jargon, and tone accordingly. `;
      }

      if (purpose) {
        promptText += `The goal is to ${purpose}. `;
      }

      if (audience) {
        promptText += `The summary is aimed at ${audience}, adjust the level of language proficiency accordingly. Subtly tailor the summary to what appeals to ${audience} considering the goal. `;
      }

      promptText += ` Present summary in a coherent and well-structured output format tailored to ${channels.join(', ')}. Mimic the sentiment of the input text. \n`;
      promptText += `  \n`;

      if (extractedPdfText.trim()) {
        promptText += `The following text should be summarized: ${extractedPdfText.trim()} `;
      }

      if (specifications) {
        promptText += `Additional specifications: ${specifications}`;
      }
      
      // Display the generated prompt
      const generatedPromptDiv = document.getElementById('generatedPrompt');
      generatedPromptDiv.innerText = promptText.trim();
    }

    function savePrompt() {
      const topic = document.getElementById('topic').value;
      const channels = Array.from(document.getElementById('channel').selectedOptions).map(opt => opt.value);
      const purpose = document.getElementById('purpose').value;
      const audience = document.getElementById('audience').value;
      const specifications = document.getElementById('specifications').value;
      const generatedPrompt = document.getElementById('generatedPrompt').innerText;
      const geminiOutputText = document.getElementById('gemini-output').innerText;
      const openaiOutputText = document.getElementById('openai-output').innerText;
      if (!generatedPrompt) {
        alert('Please generate a prompt first!');
        return;
      }

      const promptData = {
        topic,
        channels,
        purpose,
        audience,
        specifications,
        generatedPrompt,
        geminiOutputText,
        openaiOutputText,
        timestamp: new Date().toISOString()
      };

      let savedPrompts = JSON.parse(localStorage.getItem('prompts')) || [];
      savedPrompts.push(promptData);
      localStorage.setItem('prompts', JSON.stringify(savedPrompts));

      alert('Prompt and settings saved successfully!');
      loadSavedPrompts(); // Reload saved prompts
    }

    function loadSavedPrompts() {
      const savedPrompts = JSON.parse(localStorage.getItem('prompts')) || [];
      const savedPromptsList = document.getElementById('savedPromptsList');
      savedPromptsList.innerHTML = '';

      savedPrompts.forEach((promptData, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.textContent = `${promptData.topic} - ${new Date(promptData.timestamp).toLocaleString()}`;

        const loadButton = document.createElement('button');
        loadButton.className = 'btn btn-sm btn-primary';
        loadButton.textContent = 'Load';
        loadButton.onclick = () => loadPromptSettings(promptData);

        listItem.appendChild(loadButton);
        savedPromptsList.appendChild(listItem);
      });
    }

    function loadPromptSettings(promptData) {
      document.getElementById('topic').value = promptData.topic;

      // Clear all channel selections first
      Array.from(document.getElementById('channel').options).forEach(option => {
        option.selected = promptData.channels.includes(option.value);
      });

      document.getElementById('purpose').value = promptData.purpose;
      document.getElementById('audience').value = promptData.audience;
      document.getElementById('specifications').value = promptData.specifications;
      document.getElementById('generatedPrompt').innerText = promptData.generatedPrompt;
      document.getElementById('gemini-output').innerText = promptData.geminiOutputText || '';
      document.getElementById('openai-output').innerText = promptData.openaiOutputText || '';
      alert('Prompt and settings loaded!');
    }

  function clearSavedPrompts() {
    if (confirm('Are you sure you want to clear all saved prompts? This action cannot be undone.')) {
      localStorage.removeItem('prompts');
      loadSavedPrompts();
      alert('All saved prompts have been cleared.');
    }
  }
    // Load saved prompts on page load
    window.onload = loadSavedPrompts;

    const apiKeyContainer = document.getElementById('api-key-container');
    const geminiApiKeyForm = document.getElementById('gemini-api-key-form');
    const openaiApiKeyForm = document.getElementById('openai-api-key-form');

    const geminiApiKeyInput = document.getElementById('gemini-api-key-input');
    const openaiApiKeyInput = document.getElementById('openai-api-key-input');

    const saveGeminiApiKeyButton = document.getElementById('save-gemini-api-key-button');
    const saveOpenaiApiKeyButton = document.getElementById('save-openai-api-key-button');

    const geminiOutput = document.getElementById('gemini-output');
    const openaiOutput = document.getElementById('openai-output');
    const useGeneratedPromptButton = document.getElementById('useGeneratedPrompt');
    
    function getApiKey(llm) {
      return sessionStorage.getItem(`${llm}ApiKey`);
    }

    function saveApiKey(llm, key) {
      sessionStorage.setItem(`${llm}ApiKey`, key);
    }
    
    const storedGeminiApiKey = getApiKey('gemini');
    const storedOpenaiApiKey = getApiKey('openai');

    if (!storedGeminiApiKey || !storedOpenaiApiKey) {
        apiKeyContainer.style.display = 'block';
    }

    saveGeminiApiKeyButton.addEventListener('click', () => {
        const apiKey = geminiApiKeyInput.value.trim();
        if (apiKey) {
            saveApiKey('gemini',apiKey);
            geminiApiKeyForm.style.display = 'none';
           
        } else {
            alert('Please enter your Gemini API key.');
        }
           if (getApiKey('gemini') && getApiKey('openai')){
              apiKeyContainer.style.display = 'none';
           }
    });

     saveOpenaiApiKeyButton.addEventListener('click', () => {
        const apiKey = openaiApiKeyInput.value.trim();
        if (apiKey) {
            saveApiKey('openai',apiKey);
            openaiApiKeyForm.style.display = 'none';
        } else {
            alert('Please enter your OpenAI API key.');
        }
        if (getApiKey('gemini') && getApiKey('openai')){
              apiKeyContainer.style.display = 'none';
           }
    });


    useGeneratedPromptButton.addEventListener('click', async () => {
        const generatedPromptText = document.getElementById('generatedPrompt').innerText;

        if (!generatedPromptText.trim()) {
            geminiOutput.textContent = "Please generate a prompt first.";
            openaiOutput.textContent = "Please generate a prompt first.";
            return;
        }

        geminiOutput.textContent = "Generating response...";
        openaiOutput.textContent = "Generating response...";
        
        await generateGeminiResponse(generatedPromptText);
        await generateOpenaiResponse(generatedPromptText);
    });

    async function generateGeminiResponse(prompt) {
        const apiKey = getApiKey('gemini');
        if (!apiKey) {
            geminiOutput.textContent = 'Gemini API key not found. Please enter it.';
             apiKeyContainer.style.display = 'block';
            return;
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }],
                    }],
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Gemini API Error:", errorData);
                geminiOutput.textContent = `Error: ${errorData.error.message}`;
                return;
            }

            const data = await response.json();
            console.log("Gemini API Response:", data);

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                geminiOutput.textContent = data.candidates[0].content.parts[0].text;
            } else {
                geminiOutput.textContent = "No response received from Gemini.";
            }

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            geminiOutput.textContent = "An error occurred while generating the Gemini response.";
        }
    }
    
    async function generateOpenaiResponse(prompt) {
    const apiKey = getApiKey('openai');
    if (!apiKey) {
       openaiOutput.textContent = 'OpenAI API key not found. Please enter it.';
        apiKeyContainer.style.display = 'block';
       return;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Or any other model you prefer
                messages: [{
                    role: "user",
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
          const errorData = await response.json();
            console.error("OpenAI API Error:", errorData);
            openaiOutput.textContent = `Error: ${errorData.error.message}`;
            return;
        }

        const data = await response.json();
         console.log("OpenAI API Response:", data);

        if (data.choices && data.choices.length > 0) {
          openaiOutput.textContent = data.choices[0].message.content;
        } else {
           openaiOutput.textContent = "No response received from OpenAI.";
        }

    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        openaiOutput.textContent = "An error occurred while generating the OpenAI response.";
    }
}
