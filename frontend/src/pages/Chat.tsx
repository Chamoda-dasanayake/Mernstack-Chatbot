import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helper/api-communicator";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);


  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    try {
      const chatData = await sendChatRequest(content);
      setChatMessages([...chatData.chats]);
    } catch (error) {
      console.error(error);
      toast.error("Server is busy (Rate Limit). Please wait 30s.", { id: "chat-error" });
      // Optional: Remove the user message if it failed? Or let them retry? 
      // For now, simple error feedback is enough to answer "why is it not executing".
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth]);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "calc(100vh - 80px)", // Account for Header height
        maxWidth: "100vw",
        gap: 3,
        bgcolor: "#05101c",
        p: 2,
        overflow: "hidden",
      }}
    >
      {/* Sidebar - Hidden on mobile */}
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2, // Made simpler
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%", // Full height
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
            p: 2
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]}
            {auth?.user?.name.split(" ")[1] && auth?.user?.name.split(" ")[1][0]}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", color: "white", textAlign: "center" }}>
            Hi, {auth?.user?.name}
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3, color: "gray", fontSize: "0.9rem", textAlign: "center" }}>
            Ask me whatever you want. I'm here to help.
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: "#4d5569", // Dark neutral gray
              ":hover": {
                bgcolor: red.A400, // Pop of red on hover
              },
            }}
          >
            Clear History
          </Button>
        </Box>
      </Box>

      {/* Main Chat Area */}
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
          height: "100%", // Take full height
        }}
      >
        {/* Messages Container */}
        <Box
          sx={{
            width: "100%",
            flex: 1,
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "auto", // Allow scroll
            scrollBehavior: "smooth",
            mb: 3,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          {chatMessages.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", opacity: 0.5 }}>
              <Typography fontSize={"28px"} fontWeight={600} color="white" fontFamily="work sans">
                What can I help with?
              </Typography>
            </Box>
          ) : (
            chatMessages.map((chat, index) => (
              //@ts-ignore
              <ChatItem content={chat.content} role={chat.role} key={index} />
            ))
          )}
        </Box>

        {/* Input Area */}
        <div
          style={{
            width: "90%",
            maxWidth: "900px",
            borderRadius: 60,
            backgroundColor: "#2f3542",
            display: "flex",
            margin: "0 auto", // Center horizontally
            marginTop: "auto", // Push to bottom
            marginBottom: "10px", // Small gap from very bottom
            padding: "8px",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="Ask anything..."
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "15px 30px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "18px",
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1, bgcolor: "#4d5569", "&:hover": { bgcolor: "black" } }}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box >
  );
};

export default Chat;