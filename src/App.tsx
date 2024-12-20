import React from 'react';
import WebhookForm from './components/WebhookForm';

function App() {
  return (
    <div className="min-h-screen bg-[#2f3136]">
      <header className="bg-[#202225] text-white p-4 mb-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Discord Webhook Sender</h1>
        </div>
      </header>
      <WebhookForm />
    </div>
  );
}

export default App;