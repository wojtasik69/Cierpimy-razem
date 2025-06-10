const socket = io();
const chatMessages = document.getElementById('chat-messages');
const logEntries = document.getElementById('log-entries');

socket.on('chat history', history => {
  history.forEach(m => addChatMessage(m));
});

socket.on('chat message', msg => addChatMessage(msg));
socket.on('new log', entry => addLogEntry(entry));

function addChatMessage(msg) {
  const p = document.createElement('p');
  p.textContent = `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.user}: ${msg.text}`;
  chatMessages.appendChild(p);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addLogEntry(entry) {
  const p = document.createElement('p');
  p.innerHTML = `<strong>${entry.user} @ ${new Date(entry.timestamp).toLocaleString()}:</strong><br>${entry.text}`;
  logEntries.appendChild(p);
  logEntries.scrollTop = logEntries.scrollHeight;
}

// Send chat message
document.getElementById('chat-send').onclick = () => {
  const user = document.getElementById('chat-user').value || 'Anonymous';
  const text = document.getElementById('chat-input').value.trim();
  if (!text) return;
  const msg = { user, text, timestamp: Date.now() };
  socket.emit('chat message', msg);
  document.getElementById('chat-input').value = '';
};

// Add log entry
document.getElementById('log-add').onclick = () => {
  const user = document.getElementById('log-user').value || 'Anonymous';
  const text = document.getElementById('log-text').value.trim();
  if (!text) return;
  const entry = { user, text, timestamp: Date.now() };
  socket.emit('add log', entry);
  document.getElementById('log-text').value = '';
};
