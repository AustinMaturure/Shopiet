import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './context/AuthContext';
import { useParams } from 'react-router-dom';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [prevMessages, setPrevMessages] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [socket, setSocket] = useState(null);
    const { recipient } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    const roomName = [user.username, recipient].sort().join('_');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/${roomName}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setPrevMessages(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [roomName]);

    useEffect(() => {
        const chatSocket = initializeSocket();
        setSocket(chatSocket);

        return () => {
            if (chatSocket) {
                chatSocket.close();
            }
        };
    }, [roomName]);

    const initializeSocket = () => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//${import.meta.env.VITE_API_URL.replace(/^https?:\/\//, '')}/ws/socket-server/${roomName}/`
        const chatSocket = new WebSocket(wsUrl);
        chatSocket.onopen = () => {
            console.log('WebSocket connection opened')
        };

        chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === 'chat_message') {
                setMessages(prevMessages => [...prevMessages, {
                    message: data.message,
                    sender: data.sender
                }]);
            }
        };

        chatSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        chatSocket.onclose = (e) => {
            console.error('Chat socket closed unexpectedly', e);
        };

        return chatSocket;
    };

    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                'message': messageInput,
                'sender': user.username,
                'recipient': recipient
            }));
            setMessageInput('');
        } else {
            console.error('WebSocket is not open. Reconnecting...');
            const newSocket = initializeSocket();
            newSocket.onopen = () => {
                newSocket.send(JSON.stringify({
                    'message': messageInput,
                    'sender': user.username,
                    'recipient': recipient
                }));
                setMessageInput('');
            };
        }
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                prevMessages && (
                    <div className="chat">
                        {prevMessages.map((message) => (
                            <div className="message" key={message.id}>
                                <b>{message.sender_username === user.username ? 'You' : message.sender_username}</b>: {message.content}
                            </div>
                        ))}
                    </div>
                )
            )}
            <div id="chat-log">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <b>{msg.sender === user.username ? 'You' : msg.sender}</b>: {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
