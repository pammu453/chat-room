import React, { useState } from 'react';
import socket from './socket';

const App = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  
  console.log(messageList)

  const joinRoom = () => {
    if (username && room) {
      socket.emit('join_room', room);
      setIsJoined(true);
    }
  };

  const sendMessage = async () => {
    if (message && isJoined) {
      const messageData = {
        room,
        author: username,
        message,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      };
      await socket.emit('send_message', messageData);
      // setMessageList((list) => [...list, messageData]);
      setMessage('');
    }
  };

  React.useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
    return () => socket.off('receive_message');
  }, []);

  return (
    <div className="App">
      {!isJoined ? (
        <div className="joinChatContainer">
          <h3>Join a Chat</h3>
          <input type="text" placeholder="Name..." onChange={(e) => setUsername(e.target.value)} />
          <input type="text" placeholder="Room ID..." onChange={(e) => setRoom(e.target.value)} />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="messages">
            {messageList.map((msg, index) => (
              <div key={index} className="message">
                <p><strong>{msg.author}</strong>: {msg.message}</p>
                <span>{msg.time}</span>
              </div>
            ))}
          </div>
          <div className="messageInput">
            <input type="text" value={message} placeholder="Message..." onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
