import React, { useEffect, useState } from "react";
import { io } from 'socket.io-client';

function App() {

    const [onlineCount, setOnlineCount] = useState(0);
    const [editting, isEdiiting] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [ws, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(['unknown']);

    useEffect(()=> {
        const socket = io('http://localhost:3000');
        setSocket(socket);

        socket.on('new-count', (json) => {
            setOnlineCount(json.count);
            if(json.msgArr) {
                setMessages(json.msgArr);
            }
        })      
        
        socket.on('msg-change', (json) => {
            setMessages(json.msgArr);
        });

        return () => {
            socket.disconnect();
        };

        //ui
    }, []); 

   
    const editingStyle = {
        opacity: "1",
        zIndex: "100",
    }

    function removeEditor() {
        isEdiiting(false);
    }

    function getMessage(event) {
        setCurrentMessage(event.target.value);
    }

    function sendMessage() {
        removeEditor();
        ws.emit('new-msg', {
            message: currentMessage,
            user: user
        });
        setCurrentMessage('');
    }

    function getUser(event) {
        setUser(event.target.value);
    }

    return <div className="container">
        <h4>refreshing will erase username</h4>
        <h4>online: {onlineCount==1?onlineCount+" (you)":onlineCount}</h4>
    <div class="item-holder">
        <div className="item"><h3>Work On Data</h3><p>unknown</p></div>
        <div className="item"><h3>Design files</h3><p>unknown</p></div>
        {messages.map((msg) => {
            return <div className="item"><h3>{msg.msg}</h3><p>{msg.user}</p></div>
        })}
    </div>
    
    <div className="control">
      <button onClick={()=> {isEdiiting(true)}}>add item</button>
      <input type="text" onChange={getUser} value={user}/>
    </div>

    <div className="editor-container" style={editting?editingStyle:null} >
            <div onClick={removeEditor} className="observer" style={{width: "100%", height: "100%", position: "absolute", top: "0px"}}></div>
            <div className="editor" style={{zIndex: "2"}}>
                <input type="text" onChange={getMessage} value={currentMessage}/>
                <button onClick={sendMessage}>add</button>
            </div>
    </div>

  </div>
}

export default App;