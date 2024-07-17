import axios from 'axios';
import readline from 'readline';

const client = axios.create({
  baseURL: 'http://belto.myftp.biz:5009',
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
    const response = await client.post('/chat', {
      model: 'lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF',
      messages: history,
      temperature: 0.7,
      stream: true
    }, {
      responseType: 'stream'
    });

    let newMessage = { role: 'assistant', content: '' };
    response.data.on('data', chunk => {
      const text = chunk.toString();
      process.stdout.write(text);
      newMessage.content += text;
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

