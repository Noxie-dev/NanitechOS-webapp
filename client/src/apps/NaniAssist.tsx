import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getIconByName } from '../assets/Icons';

interface Message {
  sender: 'system' | 'cat' | 'user';
  text: string;
  timestamp: Date;
}

interface ContactOption {
  id: string;
  label: string;
  description: string;
}

const NaniAssist: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'system',
      text: 'Welcome to NaniAssist. How can I help you today?',
      timestamp: new Date()
    },
    {
      sender: 'cat',
      text: 'I can provide information about NaniTech, help you navigate the system, or connect you with our team.',
      timestamp: new Date()
    },
    {
      sender: 'cat',
      text: 'Select an option to continue:',
      timestamp: new Date()
    }
  ]);
  
  const [userInput, setUserInput] = useState<string>('');
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const contactOptions: ContactOption[] = [
    { 
      id: '1', 
      label: 'Learn about NaniTech services',
      description: 'Get information about our products and services'
    },
    { 
      id: '2', 
      label: 'Technical support',
      description: 'Get help with technical issues'
    },
    { 
      id: '3', 
      label: 'Contact sales team',
      description: 'Discuss your business needs with our sales team'
    },
    { 
      id: '4', 
      label: 'System information',
      description: 'View information about NaniOS'
    }
  ];

  const handleOptionSelect = (option: ContactOption) => {
    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: option.label,
        timestamp: new Date()
      }
    ]);

    // Response based on selection
    setTimeout(() => {
      if (option.id === '3') {
        setMessages(prev => [
          ...prev,
          {
            sender: 'cat',
            text: 'Please fill out the contact form below to get in touch with our sales team:',
            timestamp: new Date()
          }
        ]);
        setShowContactForm(true);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'cat',
            text: `You selected: ${option.label}. ${option.description}.`,
            timestamp: new Date()
          }
        ]);
      }
    }, 500);
  };

  const handleUserInput = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: userInput,
        timestamp: new Date()
      }
    ]);

    // Simple response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'cat',
          text: `Thank you for your message. A NaniTech representative will review your query and respond shortly.`,
          timestamp: new Date()
        }
      ]);
    }, 1000);

    setUserInput('');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'cat',
          text: 'Please fill out all required fields in the contact form.',
          timestamp: new Date()
        }
      ]);
      return;
    }

    // Submit form
    setMessages(prev => [
      ...prev,
      {
        sender: 'system',
        text: 'Thank you! Your message has been sent to the NaniTech team. We will respond to you shortly.',
        timestamp: new Date()
      }
    ]);

    setShowContactForm(false);
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="terminal-content h-full flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className="terminal-line">
            <span className="terminal-prompt">
              {message.sender === 'system' ? 'nani@os:~$' : 
               message.sender === 'cat' ? 'CAT>' : 
               'user>'}
            </span>
            <span>{message.text}</span>
          </div>
        ))}

        {!showContactForm && (
          <div className="mt-4 space-y-2">
            {contactOptions.map((option) => (
              <motion.button
                key={option.id}
                className="w-full bg-dark/80 hover:bg-dark/50 py-2 px-4 rounded-md text-left transition"
                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOptionSelect(option)}
              >
                <span className="text-accent">{option.id}.</span> {option.label}
              </motion.button>
            ))}
          </div>
        )}

        {showContactForm && (
          <motion.form 
            className="mt-4 space-y-3 bg-dark/30 p-3 rounded-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleContactSubmit}
          >
            <div>
              <label className="block text-light-secondary text-sm mb-1">Name *</label>
              <input 
                type="text" 
                className="w-full bg-dark/70 text-light rounded p-2 outline-none focus:ring-1 focus:ring-accent"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-light-secondary text-sm mb-1">Email *</label>
              <input 
                type="email" 
                className="w-full bg-dark/70 text-light rounded p-2 outline-none focus:ring-1 focus:ring-accent"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-light-secondary text-sm mb-1">Subject</label>
              <input 
                type="text" 
                className="w-full bg-dark/70 text-light rounded p-2 outline-none focus:ring-1 focus:ring-accent"
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-light-secondary text-sm mb-1">Message *</label>
              <textarea 
                className="w-full bg-dark/70 text-light rounded p-2 outline-none focus:ring-1 focus:ring-accent min-h-[100px]"
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                required
              ></textarea>
            </div>
            
            <div className="flex justify-between">
              <button 
                type="button" 
                className="bg-dark/60 text-light py-2 px-4 rounded hover:bg-dark/40 transition"
                onClick={() => setShowContactForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-accent hover:bg-accent/80 text-light py-2 px-4 rounded transition"
              >
                Send Message
              </button>
            </div>
          </motion.form>
        )}
      </div>

      {!showContactForm && (
        <form className="mt-4 flex" onSubmit={handleUserInput}>
          <span className="terminal-prompt pt-2">nani@os:~$</span>
          <input 
            type="text" 
            className="bg-transparent border-none outline-none text-light flex-1 ml-1 p-2"
            placeholder="Type your question here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </form>
      )}
    </div>
  );
};

export default NaniAssist;
