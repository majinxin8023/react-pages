import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useMutation } from '@apollo/client';

// 定义消息接口
interface Message {
  text: string;
  isUser: boolean;
}

// 定义 GraphQL mutation
const SEND_MESSAGE = gql`
  mutation SendMessage($message: String!) {
    sendMessage(message: $message) {
      response
    }
  }
`;

// 初始化 Apollo Client
const client = new ApolloClient({
  uri: 'https://deepseek-graphql-worker.majx3009.workers.dev/', // 替换为你的 Cloudflare Worker URL
  cache: new InMemoryCache(),
});

/**
 * 聊天组件，处理对话 UI
 * 管理用户输入、发送消息和显示响应
 */
const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendMessage, { loading, error }] = useMutation<{ sendMessage: { response: string } }>(SEND_MESSAGE, {
    onCompleted: (data) => {
      // 将用户消息和 AI 响应添加到对话中
      setMessages([
        ...messages,
        { text: message, isUser: true },
        { text: data.sendMessage.response, isUser: false },
      ]);
      setMessage(''); // 清空输入框
    },
  });

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage({ variables: { message } });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 头部 */}
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-xl font-bold">与 DeepSeek 聊天</h1>
      </header>

      {/* 聊天消息 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-3 rounded-lg max-w-[75%] ${
              msg.isUser ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-300 text-black mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-center text-gray-500">加载中...</div>}
        {error && <div className="text-center text-red-500">错误: {error.message}</div>}
      </div>

      {/* 输入表单 */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入你的消息..."
            className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            发送
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * 根组件，将 Chat 包裹在 ApolloProvider 中
 */
const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);

export default App;