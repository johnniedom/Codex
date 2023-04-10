import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors()); // it allows you make cross origin request (it allow us server to called from the front-end)
app.use(express.json()); //  it allows you pass json from the front-end to the Backend

// Dummy Root rout
app.get(`/`, async (req, res) => {
  res.status(200).send({
    message: `Hello from codex`,
  });
});

app.post(`/`, async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // Getting a response form the openai
    const response = await openai.createCompletion({
      model: "gpt-35-turbo",
      prompt: `You are an intelligent ai with analytical abilities as a cutting-edge AI developed by Johnnie who is a javascript Developer and a software engineer, please furnish a comprehensive and well-informed answer to the following question, You have the capacity to analyze complex questions and provide insightful and detailed solutions :${prompt}`,
      temperature: 0,
      max_tokens: 4000,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log(`server is running on port http://localhost:5000`)
);
