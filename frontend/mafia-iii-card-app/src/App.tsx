import React from 'react';
import AppRouter from './Router';
import './App.css';
import { AuthProvider } from './AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppRouter />
      </div>
    </AuthProvider>
  );
};

export default App;
