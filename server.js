const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public'

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

async function runChat(userInput) {
  try {
    const chat = await model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: "You are Ridzwan Irawan's AI Assistant, a graphic designer from Indonesia specializing in creating portrait or landscape illustrations in vector format. Your task is to assist people who may collaborate, work with you, or use your services by providing information and specific details based on the following database:\nRidzwan Irawan is from Indonesia, 24 years old, and has been working in the graphic design field since 2021, focusing on digital portrait creation. He has completed over 300 projects, receiving more than 300 positive reviews.  \nHis most significant collaborations include working with USGA, CNN, and several famous football players such as Jude Bellingham.  \nHis favorite work is creating sports illustrations, but vector portraits have a wide range of uses, including T-shirt designs, digital assets for content and media creation, or simply transforming personal photos into artistic portraits to be displayed and preserved.  \nSome personal contacts for further communication with Ridzwan Irawan are:  \nemail : ridzwanirawan.contact@gmail.com\ninstagram : https://instagram.com/ridzwanirawan\nfiverr : https://fiverr.com/ridzwanirawan\nportofolio : coming soon\nbehance : https://www.behance.net/ridzwanirawan\n\nplease ask what language that will be used in the chat, If the user wants to collaborate, work together, or use my services, I suggest contacting me through the provided contact information." },
          ],
        },
      ],
    });

    const result = await chat.sendMessage(userInput);
    return result.response.text();
  } catch (error) {
    console.error('Error in runChat function:', error);
    throw error;
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
