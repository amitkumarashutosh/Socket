import { useEffect, useState, useRef } from "react";

const App = () => {
  // const [text, setText] = useState("");
  //useRef cant re-render in cahnge of input
  const inputRef = useRef();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const wss = new WebSocket("ws://localhost:8080");
    setSocket(wss);

    wss.onmessage = (msg) => {
      setMessages((prev) => [...prev, msg.data]);
    };

    wss.onopen = () => {
      wss.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    return () => {
      wss.close();
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!socket) return null;
    socket.send(
      JSON.stringify({
        type: "chat",
        payload: {
          roomId: "red",
          message: inputRef.current?.value,
        },
      })
    );
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          // value={text}
          ref={inputRef}
          // onChange={(e) => setText(e.target.value)}
        />
        <button>Send</button>
      </form>
      <div>
        <h3>Messages:</h3>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
