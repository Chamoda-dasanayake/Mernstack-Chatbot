
import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractCodeFromString(message: string) {
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks;
  }
}

function isCodeBlock(str: string) {
  if (
    str.includes("=") ||
    str.includes(";") ||
    str.includes("[") ||
    str.includes("]") ||
    str.includes("{") ||
    str.includes("}") ||
    str.includes("#") ||
    str.includes("//")
  ) {
    return true;
  }
  return false;
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();

  return role === "assistant" ? (
    <Box
      sx={{
        display: "flex",
        p: 1,
        gap: 2,
        alignItems: "center",
        my: 2, // Spacing between messages
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
        <img src="openai.png" alt="ai" width={"30px"} style={{ display: "none" }} />
        {/* Fallback to text if no better icon, but let's use a nice Model icon */}
        <Typography fontSize={"14px"} fontWeight={700}>AI</Typography>
      </Avatar>
      <Box
        sx={{
          bgcolor: "#1a2530",
          p: 2,
          borderRadius: "4px 20px 20px 20px", // Classic bot bubble: sharp top-left
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          maxWidth: "100%", // Don't overflow
          width: "fit-content", // Fit text
        }}
      >
        {!messageBlocks && (
          <Typography sx={{ fontSize: "16px", color: "white" }}>{content}</Typography>
        )}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter style={coldarkDark} language="javascript">
                {block}
              </SyntaxHighlighter>
            ) : (
              <Typography sx={{ fontSize: "16px", color: "white" }}>{block}</Typography>
            )
          )}
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        p: 1,
        gap: 2,
        alignItems: "center",
        flexDirection: "row-reverse", // Avatar on right
        my: 2,
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
        {auth?.user?.name[0]}
        {auth?.user?.name.split(" ")[1] && auth?.user?.name.split(" ")[1][0]}
      </Avatar>
      <Box
        sx={{
          bgcolor: "#00fffc",
          background: "linear-gradient(135deg, #00fffc 0%, #00b3bd 100%)",
          color: "black",
          p: 2,
          borderRadius: "20px 4px 20px 20px", // Classic user bubble: sharp top-right
          boxShadow: "0 2px 10px rgba(0,255,252,0.1)",
          maxWidth: "100%",
          width: "fit-content",
        }}
      >
        {!messageBlocks && (
          <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>{content}</Typography>
        )}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter style={coldarkDark} language="javascript">
                {block}
              </SyntaxHighlighter>
            ) : (
              <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>{block}</Typography>
            )
          )}
      </Box>
    </Box>
  );
};

export default ChatItem;