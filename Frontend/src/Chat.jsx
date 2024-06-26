import React, { useState, useEffect, useContext, useRef } from 'react';
import AuthContext from './context/AuthContext';
import { useParams,Link } from 'react-router-dom';
import './css/chat.css'

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [prevMessages, setPrevMessages] = useState(null);
    const [timeSent, setTimesent] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [socket, setSocket] = useState(null);
    const { recipient } = useParams();
    
    const [isLoading, setIsLoading] = useState(true);

    const roomName = [user.username, recipient].sort().join('_');
    const isSocketInitialized = useRef(false);

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
                window.scrollTo(0, document.body.scrollHeight);
            }
        };

        fetchData();
    }, [roomName]);

    useEffect(() => {
        if (!isSocketInitialized.current) {
            const chatSocket = initializeSocket();
            setSocket(chatSocket);
            isSocketInitialized.current = true;
        }

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [roomName]);

    const initializeSocket = () => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//${import.meta.env.VITE_API_URL.replace(/^https?:\/\//, '')}/ws/socket-server/${roomName}/`
        const chatSocket = new WebSocket(wsUrl);

        chatSocket.onopen = () => {
            console.log('WebSocket connection opened');
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
            isSocketInitialized.current = false; 
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
            setTimesent(formatCurrentTime())
        } else {
            console.error('WebSocket is not open. Reconnecting...');
            const newSocket = initializeSocket();
            newSocket.onopen = () => {
                newSocket.send(JSON.stringify({
                    'message': messageInput,
                    'sender': user.username,
                    'recipient': recipient
                }));
                setSocket(newSocket); 
                setMessageInput('');
            };
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatCurrentTime = () => {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    };

    const renderMessagesWithDate = (messages) => {
        const messageElements = [];
        let lastDate = '';

        messages.forEach((msg, index) => {
            const currentDate = formatDate(msg.timestamp);

            if (currentDate !== lastDate) {
                messageElements.push(
                    <p className="date-heading" key={`date-${index}`}>
                        {currentDate}
                    </p>
                );
                lastDate = currentDate;
            }

            messageElements.push(
                <div className={`message ${msg.sender_username === user.username ? 'Sender' : ''}`} key={msg.id}>
                <div className="text"><b>{msg.content}</b> 
                    </div> 
                    
                    <div className="ts-cnt">
                       <p className='time-stamp'>{formatTime(msg.timestamp)}</p> 
                    </div>
            </div>
            );
        });

        return messageElements;
    };

    return (
        <div className='chat-cnt'>
            <div className="chat-header"> <Link to={`/conversations/${user.username}`}><p className='chat-link'>{'<'}</p></Link><h2 className='chat-title'>{recipient}</h2></div>
           
            {isLoading ? (
                <div className="chat-loading-div flex-col">
                     <div className='chat-skel chat-l grad-animation'><div className="text-load"></div> </div>
                     <div className='chat-skel grad-animation'><div className="text-load"></div></div>
                     <div className='chat-skel chat-l grad-animation'><div className="text-load"></div></div>
                     <div className='chat-skel grad-animation'><div className="text-load"></div></div>
                     <div className='chat-skel chat-l grad-animation'><div className="text-load"></div></div>
                    
                </div>
               
            ) : (
                prevMessages && (
                    <div className="chat flex-col">
                        {renderMessagesWithDate(prevMessages)}
                    </div>
                )
            )}
            <div id="chat-log" className='chat flex-col'>
                {messages.map((msg, index) => (
                    <div className={`message ${msg.sender === user.username ? 'Sender' : ''}`} key={index}>
                        <div className="text"><b>{msg.message}</b>
                            </div> <div className="ts-cnt">
                                       <p className='time-stamp'>{formatCurrentTime()}</p> 
                                    </div>
                    </div>
                ))}
            </div>
            <div className="write-msg">
                <textarea
                    type="text"
                    value={messageInput}
                    className='send-msg-ipt'
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                />
                <button className='btn-send-msg' onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
