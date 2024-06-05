# Before Running the Commands
Before running the commands, ensure that the LM-Studio server is started at http://localhost:1234/v1. 
Additionally, specify the LM-Studio model you are using. 
I am using 'lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF'.


## HuggingFace model card

https://huggingface.co/lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF


## app.js
```javascript
const response = await client.post('/chat/completions', {
model: '<Model Goes Here>',
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

# Start the Console app
node app.js
```

## package.json

```json
{
"name": "lm-studio-node",
"version": "1.0.0",
"description": "LM-Server with node.js",
"main": "app.js",
"type": "module",
"scripts": {
"test": "echo "Error: no test specified" && exit 1"
},
"author": "",
"license": "ISC",
"dependencies": {
"axios": "^1.7.2",
"readline": "^1.3.0"
}
}
```
