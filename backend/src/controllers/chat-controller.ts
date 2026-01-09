import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ message: "ERROR", cause: message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    user.chats = [] as any;
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ message: "ERROR", cause: message });
  }
};

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });


        const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_SECRET;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is undefined/empty in process.env");
      return res.status(500).json({ message: "Server Error: API Key missing" });
    }
    console.log("DEBUG: Using API Key starting with:", apiKey.substring(0, 4) + "...");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ]
    });

    // 2. Prepare History: Gemini uses 'user' and 'model' roles
    const history = user.chats.map((c: any) => ({
      role: c.role === "assistant" ? "model" : "user",
      parts: [{ text: c.content }],
    }));

    if (history.length > 0 && history[history.length - 1].role === "user") {
      history.pop();
    }

    // 3. Start Chat Session with History
    const chatSession = model.startChat({
      history: history,
    });

    // 4. Send the new message and get response
    const result = await chatSession.sendMessage(message);

    // safe check for safety blocks
    try {
      const botResponseText = result.response.text();
      // 5. Update Database
      user.chats.push({ role: "user", content: message });
      user.chats.push({ role: "assistant", content: botResponseText });

      await user.save();
      return res.status(200).json({ chats: user.chats });
    } catch (textError) {
      console.error("Error retrieving text from response:", textError);
      return res.status(500).json({ message: "Blocked by safety settings or no response text", cause: "Safety Block" });
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ message: "Something went wrong with Gemini API", error: error.message || String(error) });
  }
};