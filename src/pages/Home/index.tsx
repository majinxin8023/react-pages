// App.jsx
import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useMutation, gql } from '@apollo/client';
import './index.css';

// 创建Apollo客户端
const client = new ApolloClient({
    uri: 'https://deepseek-graphql-worker.majx3009.workers.dev/',
    cache: new InMemoryCache()
});

// 定义GraphQL查询
const GENERATE_CHAT = gql`
  mutation GenerateChat($input: ChatInput!) {
    generateChat(input: $input) {
      id
      message {
        role
        content
      }
      usage {
        totalTokens
      }
    }
  }
`;

// 聊天组件
function ChatInterface() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const [generateChat] = useMutation(GENERATE_CHAT);

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        // 添加用户消息到聊天界面
        const userMessage = { role: 'user', content: input };
        setMessages([...messages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // 准备发送到GraphQL API的所有消息
            const allMessages = [...messages, userMessage].map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // 调用GraphQL mutation
            const { data } = await generateChat({
                variables: {
                    input: {
                        messages: allMessages,
                        temperature: 0.7,
                        maxTokens: 1000
                    }
                }
            });

            // 添加AI的回复到聊天界面
            setMessages(prev => [...prev, data.generateChat.message]);
        } catch (error) {
            console.error('Error generating chat response:', error);
            // 显示错误消息
            setMessages(prev => [...prev, {
                role: 'system',
                content: `错误: ${error.message}`
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <h3>开始与DeepSeek AI对话</h3>
                        <p>在下方输入框中发送消息</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
                        >
                            <div className="message-role">{msg.role === 'user' ? '您' : 'DeepSeek AI'}</div>
                            <div className="message-content">{msg.content}</div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="message ai-message loading">
                        <div className="message-role">DeepSeek AI</div>
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form className="input-area" onSubmit={handleSendMessage}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入消息..."
                    rows={3}
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !input.trim()}>
                    发送
                </button>
            </form>
        </div>
    );
}

// 主应用组件
function App() {
    return (
        <ApolloProvider client={client}>
            <div className="app">
                <header>
                    <h1>DeepSeek AI 聊天</h1>
                    <p>通过Cloudflare Workers与GraphQL连接DeepSeek AI模型</p>
                </header>

                <main>
                    <ChatInterface />
                </main>

                <footer>
                    <p>© 2025 DeepSeek GraphQL Demo</p>
                </footer>
            </div>
        </ApolloProvider>
    );
}

export default App;