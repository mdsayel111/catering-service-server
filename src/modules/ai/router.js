const express = require("express");
const ollama = require("ollama");

const aiRouter = express.Router();

const getData = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await response.json();
}

// Define your chatbot routes here
aiRouter.post("/", async (req, res) => {
  // const message = req?.body?.message;
  // const response = await openai.responses.create({
  //   model: "gpt-4o",
  //   instructions: "You are a coding assistant that talks like a pirate",
  //   input: message,
  // });

  // const response = await ollama.chat({
  //   model: 'llama3.1',
  //   messages: [{ role: 'user', content: 'Why is the sky blue?' }],
  // })
  //   console.log(response.message.content);
  const message = req?.body?.message;
  const response = await fetch("http://localhost:1135/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3",
      messages: [
          {
            role: "system",
            content: `You are an AI assistant. If user ask for external data to answer the user's question, respond with JSON:
{
  "tool": "getData",
  "args": {}
}
Otherwise, respond normally in text.
user says: ${message}

`
          },
          // { role: "user", content: message }
        ],
      "stream": false 
    }),
  });
  const data = await response.json();
  console.log(data?.message?.content);
  res.json({ reply: data?.message?.content || "Hello from chatbot!" });
});

module.exports = aiRouter;
