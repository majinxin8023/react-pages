import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import ReactMarkdown from "react-markdown";
import "./Chat.css";

// GraphQL 查询：定义入参 message，返回 success/reply/message 字段
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
const Chat: React.FC = () => {
  const [message, setMessage] = useState(""); // 输入框内容
  const [chatHistory, setChatHistory] = useState<
    Array<{ type: "user" | "assistant"; content: string; id: string }>
  >([]); // 聊天记录（按顺序渲染）
  const [isGenerating, setIsGenerating] = useState(false); // 是否正在请求/生成中
  const [sendMessage, { loading }] = useLazyQuery(SEND_MESSAGE); // 惰性执行查询；loading 可用于展示加载态

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 阻止表单默认提交刷新
    if (!message.trim()) return; // 空消息不发送

    const userMessageId = `user-${Date.now()}`; // 用时间戳生成稳定 id
    const assistantMessageId = `assistant-${Date.now()}`; // 预占位的助手消息 id

    // 添加用户消息到聊天历史
    setChatHistory((prev) => [
      ...prev,
      { type: "user", content: message, id: userMessageId },
    ]);

    // 添加一个临时的"生成中"消息（用于显示打字指示器）
    setChatHistory((prev) => [
      ...prev,
      {
        type: "assistant",
        content: "",
        id: assistantMessageId,
      },
    ]);

    setIsGenerating(true); // 切换为生成中，禁用输入与按钮

    try {
      // 调用 GraphQL 接口，将 message 作为变量传入
      const { data } = await sendMessage({
        variables: { message },
      });

      if (data?.chat?.success) {
        // 更新助手回复内容
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: data.chat.reply }
              : msg
          )
        );
      } else {
        // 处理错误情况
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content:
                    data?.chat?.message ||
                    "Sorry, there was an error processing your message.",
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: "Sorry, there was an error processing your message.",
              }
            : msg
        )
      );
    } finally {
      setIsGenerating(false); // 恢复可交互状态
    }

    setMessage(""); // 清空输入框
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1>DeepSeek Chat</h1>
        <p>智能对话助手，为您提供专业的咨询服务</p>
      </div>

      <div className="chat-container">
        <div className="chat-history">
          {/* 渲染聊天记录：用户消息右对齐、助手消息左对齐 */}
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${
                msg.type === "user" ? "user" : "assistant"
              }`}
            >
              {msg.type === "assistant" ? (
                msg.content ? (
                  // 助手回复使用 Markdown 渲染（支持代码块/列表等）
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  // 生成中：显示打字指示器与提示文案
                  <div className="typing-indicator-container">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="typing-text">正在生成回答...</span>
                  </div>
                )
              ) : (
                msg.content
              )}
            </div>
          ))}
        </div>

        {/* 输入框与发送按钮区域：生成中时禁用，避免重复请求 */}
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="请输入您的问题..."
            className="chat-input"
            disabled={isGenerating} // 生成中禁用输入
          />
          <button
            type="submit"
            className={`chat-submit-btn ${isGenerating ? "disabled" : ""}`}
            disabled={isGenerating} // 生成中禁用按钮
          >
            {isGenerating ? "生成中..." : "发送"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
