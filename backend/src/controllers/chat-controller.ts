import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import OpenAI from "openai";

type ChatMessage = OpenAI.ChatCompletionMessageParam;

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
    // FIX: Check if error is an instance of Error to access .message safely
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
    
    user.chats = [] as any; // Clear the chats array
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    // FIX: Check if error is an instance of Error to access .message safely
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

    const chats: ChatMessage[] = user.chats.map((c: any) => ({
      role: c.role,
      content: c.content,
    }));

    chats.push({ role: "user", content: message });
    user.chats.push({ role: "user", content: message });

    const openai = configureOpenAI();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chats,
    });

    const botMessage = response.choices[0].message;

    user.chats.push({
      role: botMessage.role,
      content: botMessage.content || "", // Ensure content is not null
    });

    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};