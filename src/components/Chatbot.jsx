import React, { useState } from 'react';

const GOOGLE_API_KEY = 'AIzaSyD4a_FWjm7GoF2QrLRH-0vnn2TpDsKBIhs'; // placeholder - not normally used for chat completions

export default function MentalHealthChatbot() {
  // This example still uses OpenAI API endpoint as an example
  // But you can replace fetch call to your backend or Google Dialogflow if you have backend integration

  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'You are a compassionate mental health assistant.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Example: If you have backend endpoint that uses Google API key securely,
      // you would call that here instead.

      // For demonstration, this calls OpenAI API with placeholder
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GOOGLE_API_KEY}`, // This won't work with Google API keys!
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: updatedMessages,
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Error from API');
      }

      const data = await res.json();
      const assistantMessage = data.choices[0].message;
      setMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Mental Health Chatbot</h1>
      <div
        style={{
          border: '1px solid #ddd',
          height: 400,
          overflowY: 'auto',
          padding: '1rem',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
          marginBottom: '1rem',
        }}
      >
        {messages
          .filter((m) => m.role !== 'system')
          .map((msg, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: msg.role === 'user' ? '#007BFF' : '#e9ecef',
                color: msg.role === 'user' ? 'white' : 'black',
                padding: '0.75rem 1rem',
                borderRadius: '20px',
                marginBottom: '0.5rem',
                maxWidth: '75%',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.content}
            </div>
          ))}
        {loading && <p>Assistant is typing...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Type your message..."
          style={{ flexGrow: 1, padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '20px 0 0 20px' }}
        />
        <button type="submit" disabled={loading} style={{ borderRadius: '0 20px 20px 0', padding: '0 1.2rem' }}>
          Send
        </button>
      </form>
    </div>
  );
}
