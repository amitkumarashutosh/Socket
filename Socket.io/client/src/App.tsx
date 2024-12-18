import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState(null);
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e: any) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected successfully: " + socket.id);

      socket.on("receive-message", (data) => {
        console.log(data);
        setMessages((prevMessages) => [...prevMessages, data.message]);
      });

      // socket.on("welcome", (data) => {
      //   console.log(data);
      // });
    });

    // socket.emit("message", "I want to learn coding");
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div>
      <h1 className="text-center text-normal text-gray-700 m-2">
        Join the room
      </h1>
      <form
        onSubmit={joinRoomHandler}
        className="w-3/5 mx-auto p-3 bg-gray-200 flex flex-col gap-2"
      >
        <Input
          className="bg-white"
          value={room}
          name="roomName"
          placeholder="Room name"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Join
        </Button>
      </form>
      <h1 className="text-center text-normal text-gray-700 m-2">{socketId}</h1>
      <form
        onSubmit={handleSubmit}
        className="w-3/5 mx-auto p-3 bg-gray-200 flex flex-col gap-2"
      >
        <Input
          className="bg-white"
          value={message}
          name="message"
          placeholder="message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <Input
          className="bg-white"
          value={room}
          name="room"
          placeholder="roomId"
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Send
        </Button>
      </form>
      <div>
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className="text-center p-2 bg-gray-200 flex items-center justify-center w-[45%] mx-auto m-1"
            >
              {msg}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
