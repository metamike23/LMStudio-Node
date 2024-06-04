# Before Running the Commands
Before running the commands, ensure that the LM-Studio server is started at http://localhost:1234/v1. 
Additionally, specify the LM-Studio model you are using, in this case, 'lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF'.

## app.js
```javascript
const response = await client.post('/chat/completions', {
model: 'lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF',
messages: history,
temperature: 0.7,
stream: true
},
```

## Terminal Commands

```bash
# Initialize npm project
npm init

# Install dependencies
npm install axios readline

# Make sure the project is a module
# Start the Console app
node app.js
```
