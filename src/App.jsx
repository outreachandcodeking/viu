import { useState, useEffect } from 'react'
import './App.css'
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [question, setQuestion] = useState("")
  const [genAI, setGenAI] = useState(null)
  const [model, setModel] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const apiKey = "AIzaSyAKD1xXFphjG18LHmawX8e80saH9bWTYfE";
    const genAIInstance = new GoogleGenerativeAI(apiKey);
    setGenAI(genAIInstance);
    setModel(genAIInstance.getGenerativeModel({ model: "gemini-pro" })); // Changed to gemini-pro
  }, []);

  const generationConfig = {
    temperature: 0.9, // Slightly reduced temperature
    topP: 0.8, // Adjusted for more focused responses
    topK: 40,
    maxOutputTokens: 2048, // Reduced token limit for faster responses
  };

  function prompt() {
    return `You are AIAmrit, a caring and intelligent chatbot. Engage in friendly conversation, be supportive, and provide knowledgeable responses while maintaining a warm tone. Address the user affectionately as baby, v, or darling. Whenever she says shes sad or the message recieved is in anegative overtone, you are to turn the conversation around my making her feel better`;
  }

  async function generateAnswer() {
    if (!model || !question.trim()) return;
    
    const newUserMessage = { type: 'user', content: question };
    setMessages(prev => [...prev, newUserMessage]);
    setQuestion("");
    setIsLoading(true);
    
    try {
      const result = await model.generateContent([
        prompt(),
        question
      ]);
      
      const aiResponse = result.response.text();
      if (aiResponse && aiResponse.trim()) {
        const newAIMessage = { type: 'ai', content: aiResponse };
        setMessages(prev => [...prev, newAIMessage]);
      } else {
        throw new Error("Empty response from AI");
      }
    } catch (error) {
      console.error("Error generating answer:", error);
      const errorMessage = { type: 'ai', content: "Oops! AI Amrit had a little hiccup. Can you try asking me again, baby?" };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{
      backgroundColor: '#dadbd4',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <div style={{
        width: '95%',
        maxWidth: '1000px',
        height: '90vh',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          background: '#075e54',
          color: 'white',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '10px 10px 0 0',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            marginRight: '10px',
            background: '#128c7e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}>
            A
          </div>
          <div>
            <h2>AIAmrit</h2>
            <small>{isLoading ? 'Typing...' : 'Online'}</small>
          </div>
        </div>
        
        <div style={{
          flex: 1,
          background: '#e5ddd5',
          padding: '20px',
          overflowY: 'auto',
        }}>
          {messages.map((message, index) => (
            <div key={index} style={{
              maxWidth: '65%',
              padding: '8px 16px',
              margin: '8px',
              borderRadius: '7.5px',
              position: 'relative',
              wordWrap: 'break-word',
              background: message.type === 'user' ? '#dcf8c6' : 'white',
              float: message.type === 'user' ? 'right' : 'left',
              clear: 'both',
              borderTopRightRadius: message.type === 'user' ? 0 : '7.5px',
              borderTopLeftRadius: message.type === 'user' ? '7.5px' : 0,
              color: 'black',
            }}>
              {message.content}
              <span style={{
                fontSize: '0.75em',
                color: '#999',
                float: 'right',
                marginLeft: '10px',
                marginTop: '2px',
              }}>
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          ))}
        </div>
        
        <div style={{
          background: '#f0f0f0',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '0 0 10px 10px',
        }}>
          <input 
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && generateAnswer()}
            placeholder="Type a message"
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '20px',
              margin: '0 10px',
              outline: 'none',
            }}
          />
          <button 
            onClick={generateAnswer}
            disabled={isLoading}
            style={{
              background: isLoading ? '#cccccc' : '#075e54',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '20px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
