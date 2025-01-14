let savedPrompts = [];

async function savePrompt() {
  const generatedPrompt = document.getElementById('generatedPrompt').innerText;
  const topic = document.getElementById('topic').value;
  const channels = Array.from(document.getElementById('channel').selectedOptions).map(opt => opt.text);
  const purpose = document.getElementById('purpose').value;
  const audience = document.getElementById('audience').value;
  const specifications = document.getElementById('specifications').value;

  if (!generatedPrompt) {
    alert('Please generate a prompt first!');
    return;
  }

  const promptData = {
    id: Date.now(), // Unique ID for the prompt
    version: savedPrompts.length + 1, // Incremental version
    prompt: generatedPrompt,
    settings: {
      topic,
      channels,
      purpose,
      audience,
      specifications,
    },
  };

  // Add to saved prompts
  savedPrompts.push(promptData);

  try {
    // Save to the server or local storage
    localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
    alert('Prompt and settings saved!');
    loadSavedPrompts(); // Reload saved prompts
  } catch (error) {
    console.error('Error saving prompt:', error);
    alert('Failed to save prompt');
  }
}

function loadSavedPrompts() {
  // Load from local storage or server
  const storedPrompts = JSON.parse(localStorage.getItem('savedPrompts')) || [];
  savedPrompts = storedPrompts;

  const savedPromptsDiv = document.getElementById('savedPromptsList');
  savedPromptsDiv.innerHTML = '';

  if (savedPrompts.length > 0) {
    savedPrompts.forEach((savedPrompt) => {
      const promptItem = document.createElement('li');
      promptItem.className = 'list-group-item d-flex justify-content-between align-items-center';
      promptItem.innerHTML = `
        <span>Version ${savedPrompt.version}: ${savedPrompt.prompt.substring(0, 50)}...</span>
        <button class="btn btn-sm btn-primary" onclick="reloadPrompt(${savedPrompt.id})">Reload</button>
      `;
      savedPromptsDiv.appendChild(promptItem);
    });
  }
}

function reloadPrompt(id) {
  const promptData = savedPrompts.find((prompt) => prompt.id === id);
  if (!promptData) {
    alert('Prompt not found!');
    return;
  }

  // Populate the settings
  document.getElementById('topic').value = promptData.settings.topic || '';
  const channelSelect = document.getElementById('channel');
  Array.from(channelSelect.options).forEach((option) => {
    option.selected = promptData.settings.channels.includes(option.text);
  });
  document.getElementById('purpose').value = promptData.settings.purpose || '';
  document.getElementById('audience').value = promptData.settings.audience || '';
  document.getElementById('specifications').value = promptData.settings.specifications || '';

  // Populate the prompt
  document.getElementById('generatedPrompt').innerText = promptData.prompt;

  alert('Prompt and settings reloaded!');
}

// Load prompts on page load
window.onload = loadSavedPrompts;
