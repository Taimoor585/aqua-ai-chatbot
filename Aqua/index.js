const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const buttonIcon = document.getElementById('button-icon');
const info = document.querySelector('.info');
const clearBtn = document.getElementById('clear-btn');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});
clearBtn.addEventListener('click', clearChat);

function appendMessage(sender, message, isTyping = false) {
  info.style.display = 'none';

  const chatElement = document.createElement('div');
  chatElement.classList.add('chat-box', sender);

  const iconElement = document.createElement('div');
  iconElement.classList.add('icon');
  const icon = document.createElement('i');

  if (sender === 'user') {
    icon.classList.add('fa-regular', 'fa-user');
  } else {
    icon.classList.add('fa-solid', 'fa-robot');
  }
  iconElement.appendChild(icon);
  chatElement.appendChild(iconElement);

  // Message content
  const messageElement = document.createElement('div');
  messageElement.classList.add('message-content');
  messageElement.innerHTML = message.replace(/\n/g, '<br>'); // preserve line breaks
  chatElement.appendChild(messageElement);

  // Timestamp
  if (!isTyping) {
    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    const time = new Date();
    timestamp.textContent = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    chatElement.appendChild(timestamp);
  } else {
    // typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing');
    typingIndicator.textContent = '...typing';
    chatElement.appendChild(typingIndicator);
  }

  chatLog.appendChild(chatElement);

  // Smooth scroll
  chatLog.scrollTo({
    top: chatLog.scrollHeight,
    behavior: 'smooth',
  });
}

function setLoading(loading = true) {
  if (loading) {
    buttonIcon.classList.remove('fa-paper-plane');
    buttonIcon.classList.add('fa-spinner', 'fa-pulse');
    sendButton.disabled = true;
    userInput.disabled = true;
  } else {
    buttonIcon.classList.add('fa-paper-plane');
    buttonIcon.classList.remove('fa-spinner', 'fa-pulse');
    sendButton.disabled = false;
    userInput.disabled = false;
    userInput.focus();
  }
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage('user', message);
  userInput.value = '';
  setLoading(true);

  // Special command for developer message
  if (message.toLowerCase() === 'developer') {
    await delay(1500);
    appendMessage('bot', 'This source coded by Reza Mehdikhanlou\nYoutube: @AsmrProg');
    setLoading(false);
    return;
  }

  // Show typing indicator before bot response
  const typingElem = document.createElement('div');
  typingElem.classList.add('chat-box', 'bot');
  typingElem.innerHTML = `<div class="icon"><i class="fa-solid fa-robot"></i></div><div class="message-content">...</div>`;
  chatLog.appendChild(typingElem);
  chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: 'smooth' });
  userInput.disabled = true;

  try {
    // Replace with your actual API key or environment variable securely
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'YOUR_API_KEY_HERE',
        'X-RapidAPI-Host': 'chatgpt53.p.rapidapi.com'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }]
      }),
    };

    // Simulate delay to feel more "human"
    await delay(1200);

    const response = await fetch('https://chatgpt53.p.rapidapi.com/', options);
    const data = await response.json();

    // Remove typing indicator
    chatLog.removeChild(typingElem);

    if (data.choices && data.choices.length > 0) {
      appendMessage('bot', data.choices[0].message.content);
    } else {
      appendMessage('bot', 'Sorry, I did not understand that.');
    }
  } catch (err) {
    chatLog.removeChild(typingElem);
    appendMessage('bot', 'Error: Could not fetch response. Please check your API key or connection.');
  } finally {
    setLoading(false);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearChat() {
  chatLog.innerHTML = '';
  info.style.display = 'block';
  userInput.focus();
}

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    userInput.value = chip.textContent;
    userInput.focus();
  });
});
