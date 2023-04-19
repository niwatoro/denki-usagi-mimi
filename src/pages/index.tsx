// pages/index.tsx
import Head from "next/head";
import { useEffect, useState } from "react";

interface Props {
  handleCredChange: (username: string, roomname: string) => void;
  handleLogin: () => void;
}

export default function Home({ handleCredChange, handleLogin }: Props) {
  const [roomname, setRoomname] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    handleCredChange(username, roomname);
  }, [roomname, username, handleCredChange]);

  return (
    <div>
      <Head>
        <title>Native WebRTC API with NextJS and Pusher as the Signalling Server</title>
        <meta name="description" content="Use Native WebRTC API for video conferencing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form onSubmit={handleLogin}>
        <h1>Lets join a room!</h1>
        <div className="flex">
          <input onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Enter Username" />
          <input onChange={(e) => setRoomname(e.target.value)} value={roomname} placeholder="Enter Room Name" />
        </div>
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
}
