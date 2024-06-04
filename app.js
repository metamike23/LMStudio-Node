// npm init 
// npm install axios readline           ---- make sure the project is a module

// node app.js                          ---- Starts Console app


import axios from 'axios';
import readline from 'readline';

const client = axios.create({
  baseURL: 'http://localhost:1234/v1',
  headers: { 'Authorization': `Bearer lm-studio` }
});

const history = [
  { role: 'system', content: 'You are an intelligent assistant. You always provide well-reasoned answers that are both correct and helpful.' },
  { role: 'user', content: 'Hello, introduce yourself to someone opening this program for the first time. Be concise.' }
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getCompletion() {
  try {
    const response = await client.post('/chat/completions', {
      model: 'lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF',
      messages: history,
      temperature: 0.7,
      stream: true
    }, {
      responseType: 'stream'
    });

    let newMessage = { role: 'assistant', content: '' };

    response.data.on('data', chunk => {
      const dataStr = chunk.toString().trim();

      // Handle '[DONE]' message
      if (dataStr === '[DONE]') {
        return;
      }

      if (dataStr.startsWith('data: ')) {
        const jsonStr = dataStr.slice(6); // Remove 'data: ' prefix
        try {
          const jsonData = JSON.parse(jsonStr);
          const choice = jsonData.choices[0].delta;

          if (choice.content) {
            // Print content with line breaks
            const content = choice.content.replace(/\n/g, '\n');
            process.stdout.write(content);
            newMessage.content += choice.content;
          }

          if (jsonData.choices[0].finish_reason) {
            // Accessing the finish_reason field
            const finishReason = jsonData.choices[0].finish_reason;
            console.log('\nFinish Reason:', finishReason);

            // Stop processing if there's a finish_reason
            response.data.destroy();
          }

        } catch (error) {
          console.error('Error parsing JSON chunk:', error);
        }
      }
    });

    return new Promise((resolve, reject) => {
      response.data.on('end', () => resolve(newMessage));
      response.data.on('error', reject);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

async function chat() {
  const newMessage = await getCompletion();
  history.push(newMessage);

  rl.question('> ', (userInput) => {
    history.push({ role: 'user', content: userInput });
    chat(); // Recursively call chat to continue the conversation
  });
}

chat();

