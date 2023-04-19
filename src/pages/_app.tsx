import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "./components/layout";

export default function App({ Component, pageProps }: AppProps) {
  const [username, setUsername] = useState("");
  const [roomname, setRoomname] = useState("");
  const router = useRouter();

  const handleLogin = (event: Event) => {
    event.preventDefault();
    router.push(`/room/${roomname}`);
  };
  return (
    <Layout>
      <Component
        handleCredChange={(username: string, roomname: string) => {
          setUsername(username);
          setRoomname(roomname);
        }}
        username={username}
        roomname={roomname}
        handleLogin={handleLogin}
        {...pageProps}
      />
    </Layout>
  );
}
