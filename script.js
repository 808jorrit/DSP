// Array to cache saved prompts
let savedPrompts = [];

// Function to generate a prompt
async function generatePrompt() {
  const topic = document.getElementById("topic").value;
  const channel = Array.from(document.getElementById("channel").selectedOptions).map(opt => opt.value);
  const purpose = document.getElementById("purpose").value;
  const audience = document.getElementById("audience").value;
  const specifications = document.getElementById("specifications").value;

  if (!topic || channel.length === 0 || !purpose || !audience) {
    alert("Please fill in all required fields!");
    return;
  }

  try {
    const response = await fetch("/generate-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, channel, purpose, audience, specifications }),
    });

    const data = await response.json();
    document.getElementById("generatedPrompt").innerText = data.generatedPrompt;
  } catch (error) {
    console.error("Error generating prompt:", error);
    alert("An error occurred. Please try again.");
  }
}

// Function to save the generated prompt
async function savePrompt() {
  const generatedPrompt = document.getElementById('generatedPrompt').innerText;
  console.log('Saving prompt:', generatedPrompt);

  if (!generatedPrompt) {
    alert('Please generate a prompt first!');
    return;
  }

  // Collect form data
  const formData = {
    topic: document.getElementById('topic').value,
    channel: Array.from(document.getElementById('channel').selectedOptions).map(opt => opt.value),
    purpose: document.getElementById('purpose').value,
    audience: document.getElementById('audience').value,
    specifications: document.getElementById('specifications').value
  };

  try {
    const response = await fetch('/save-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: generatedPrompt,
        formData: formData
      })
    });

    const data = await response.json();
    console.log('Save response:', data);
    alert(data.message);
    location.reload(); // Refresh page
  } catch (error) {
    console.error('Error saving prompt:', error);
  }
}

// Function to load saved prompts from the backend
async function loadSavedPrompts() {
  try {
    const response = await fetch('/saved-prompts');
    const data = await response.json();
    console.log('Loaded prompts:', data);

    const savedPromptsList = document.getElementById('savedPromptsList');
    savedPromptsList.innerHTML = '';

    if (data.savedPrompts && data.savedPrompts.length > 0) {
      data.savedPrompts.forEach((saved) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerText = saved.preview;
        li.onclick = () => restorePromptAndForm(saved);
        savedPromptsList.appendChild(li);
      });
    }
  } catch (error) {
    console.error('Error loading prompts:', error);
  }
}

function restorePromptAndForm(saved) {
  // Restore prompt
  document.getElementById('generatedPrompt').innerText = saved.fullText;
  
  // Restore form data
  const formData = saved.formData;
  document.getElementById('topic').value = formData.topic;
  
  // Restore channel selections
  const channelSelect = document.getElementById('channel');
  Array.from(channelSelect.options).forEach(option => {
    option.selected = formData.channel.includes(option.value);
  });
  
  document.getElementById('purpose').value = formData.purpose;
  document.getElementById('audience').value = formData.audience;
  document.getElementById('specifications').value = formData.specifications;
}

// Function to copy the generated prompt to the clipboard
function copyPrompt() {
  const prompt = document.getElementById("generatedPrompt").innerText;

  if (!prompt.trim()) {
    alert("Nothing to copy!");
    return;
  }

  navigator.clipboard.writeText(prompt).then(
    () => alert("Prompt copied to clipboard!"),
    error => {
      console.error("Error copying prompt:", error);
      alert("Failed to copy the prompt. Please try again.");
    }
  );
}

// Load saved prompts on page load
document.addEventListener("DOMContentLoaded", loadSavedPrompts);

// Make sure window.onload is set
window.onload = loadSavedPrompts;