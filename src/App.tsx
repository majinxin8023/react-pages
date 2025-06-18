import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useLazyQuery,
} from "@apollo/client";
import { useState } from "react";

// 配置 Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:8787/graphql",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
  headers: {
    "Content-Type": "application/json",
  },
});

// GraphQL 查询
const SEND_MESSAGE = gql`
  query Chat($message: String!) {
    chat(message: $message) {
      success
      reply
      message
    }
  }
`;

// 聊天组件
function Chat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ type: "user" | "assistant"; content: string }>
  >([]);
  const [sendMessage, { loading }] = useLazyQuery(SEND_MESSAGE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // 添加用户消息到聊天历史
    setChatHistory((prev) => [...prev, { type: "user", content: message }]);

    try {
      const { data } = await sendMessage({
        variables: { message },
      });

      if (data?.chat?.success) {
        // 添加助手回复到聊天历史
        setChatHistory((prev) => [
          ...prev,
          { type: "assistant", content: data.chat.reply },
        ]);
      } else {
        // 处理错误情况
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            content:
              data?.chat?.message ||
              "Sorry, there was an error processing your message.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "Sorry, there was an error processing your message.",
        },
      ]);
    }

    setMessage("");
  };

  return (
    <div
      className="chat-container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}
    >
      <div
        className="chat-history"
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "4px",
        }}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              padding: "8px",
              backgroundColor: msg.type === "user" ? "#e3f2fd" : "#f5f5f5",
              borderRadius: "4px",
              maxWidth: "80%",
              marginLeft: msg.type === "user" ? "auto" : "0",
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          disabled={loading}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

// 主应用
function App() {
  return (
    <ApolloProvider client={client}>
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          DeepSeek Chat
        </h1>
        <Chat />
      </div>
    </ApolloProvider>
  );
}

export default App;
