import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import About from "./pages/About";
import "./App.css";

// 配置 Apollo Client（指向服务端 GraphQL 网关，强制走网络以避免缓存影响）
const client = new ApolloClient({
  uri: "https://deepseek-graphql-worker.majx3009.workers.dev/graphql",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      // 监听类查询也每次从网络获取数据
      fetchPolicy: "network-only",
    },
    query: {
      // 普通查询禁用缓存，确保拿到最新回复
      fetchPolicy: "network-only",
    },
  },
  headers: {
    "Content-Type": "application/json",
    // 如需鉴权可在此处附加 token
  },
});

// 主应用
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
