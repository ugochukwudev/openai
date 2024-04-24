import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
// import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

// const configuration = new Configuration({
//   apiKey: "",
// });

//const openai = new OpenAIApi(configuration);
const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
// const openai = new OpenAI({
//   apiKey:
//     process.env.OPENAI_API_KEY,
// });
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // const response = await openai.chat.completions
    //   .create({
    //     messages: [{ role: "system", content: "Hello GPT" }],
    //     model: "No models available",
    //     frequency_penalty: 2.0,
    //     top_p: 1,
    //     max_tokens: 4096,
    //     model: "",
    //   })
    //   model: "text-davinci-003", // createCompletion({
    //   prompt: `${prompt}`,
    //   temperature: 0, // Higher values means the model will take more risks.
    //   max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
    //   top_p: 1, // alternative to sampling with temperature, called nucleus sampling
    //   frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
    //   presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    // });
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    // console.log(response);
    res.status(200).send({
      bot: text,
    });
  } catch (error) {
    //console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(5000, () => {
  console.log("AI server started on http://localhost:5000");
  console.log(process.env.OPENAI_API_KEY, process.env.port);
});
