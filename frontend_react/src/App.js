import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ConversationsPage from './pages/ConversationsPage';
import MessagesPage from './pages/MessagesPage';
import UserSettingsPage from './pages/UserSettingsPage';

function App() {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/conversations" element={<ConversationsPage />} />
            <Route path="/messages/:conversationId" element={<MessagesPage />} />
            <Route path="/settings" element={<UserSettingsPage />} />
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
