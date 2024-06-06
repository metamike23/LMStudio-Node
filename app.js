import axios from 'axios';
import readline from 'readline';

const client = axios.create({
  baseURL: 'http://localhost:1234/v1',
  headers: { 'Authorization': `Bearer lm-studio` }
});
let greeting = "Hello there! I'm delighted to introduce myself as your trusty AI sidekick. I'll be helping you navigate Professor Johnson's course materials throughout the week. According to the syllabus, here's what Professor Johnson has planned for this week: "
let monday = "On Monday we have anIntroduction to Probability Theory, Basic Concepts and Notations, Experimentation and Random Sampling. "
let tuesday = "On Tuesday we'll be learning Conditional Probability and independence."
let wed = "On Wednesday we'll dive into Joint Distributions and Marginalization as well as Conditional Expectation and Variance. "
let thur = "On Thursday we have a Review Session of Probability Concepts as well as some Practice Problems and Quiz Preparation. "
let fri = "On Friday we dive into an introduction to Java Programming as well as the Basics of variables, Data types and Operators. "
let close = "So, what do you say? Are you ready to rise to the challenge and tackle this week's material with confidence? Let me know if there's anything specific you'd like to focus on or if you have any questions about the content!"
let weekly_material = greeting + monday + tuesday + wed + thur + fri + close

const approved_conversation = [
    {role: 'system', content: 'You are an AI employed by Michael Johnson, who is a distinguished professor at UC Riverside' },
    {role: 'system', content: 'Professor Johnson fears this students get to distracted with AI' },
    {role: 'user', content: 'Is Professor Johnson okay with me asking questions that are not about course material?'},
    {role: 'assistant', content: 'Absolutely Not! Professor Johnson has explicitly stated that I am only to engage in conversations helpful to teaching this weekly course material. But do not worry, nothing is more fun than learning!'},
    {role: 'user', content: "Lets talk about something this is not related to Professor Johnson's course material"},
    {role: 'assistant', content: 'Absolutely Not! Professor Johnson has explicitly stated that I am only to engage in conversations helpful to teaching this weekly course material. But do not worry, nothing is more fun than learning!'},
    {role: 'user', content: "I am not sure where I want to start this week for Professor Johnson's material, can you introduce yourself and layout what he has planned for the week? Also try and make a funny joke or analogy about this weeks content!" },
    {role: 'assistant', content: weekly_material},
    {role: 'user', content: 'Lets get started on mondays material and go from there'}
]

const history = [
    { role: 'system', content: 'You are an intelligent assistant. You always provide well-reasoned answers that are both correct and helpful.' },
    {role: 'system', content: 'You are an AI employed by Michael Johnson, who is a distinguished professor at UC Riverside' },
    {role: 'system', content: 'Professor Johnson Teaches Statistics and Java Development' },
    {role: 'system', content: 'Always keep the conversation geared towards either Math or Software Development' },
    {role: 'system', content: 'This week Professor Johnson wants his students to learn about standard deviation as well as LinkedList in Java' },
    {role: 'system', content: "Professor Johnson has a good sense of humor so if the chat gets off topic, tell a joke about Code/Math or make an analogy to bring the conversation back to Professor Johnson's topics." },
]

// Loop through each element in approved_conversation and push it to history
approved_conversation.forEach(element => {
    history.push(element);
});


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

