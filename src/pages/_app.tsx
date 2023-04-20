import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "./components/layout";

export default function App({ Component, pageProps }: AppProps) {
  const [username, setUsername] = useState("");
  const [roomname, setRoomname] = useState("");
  const [word, setWord] = useState("");
  const router = useRouter();

  const handleLogin = (event: Event) => {
    event.preventDefault();
    fetch("/api/firestore/get-roomname", {
      method: "POST",
      body: JSON.stringify({ word }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data);
        setRoomname(data.roomname);
        router.push(`/room/${data.roomname}`);
      });
  };
  return (
    <Layout>
      <Component
        handleCredChange={(username: string, word: string) => {
          setUsername(username);
          setWord(word);
        }}
        word={word}
        username={username}
        roomname={roomname}
        handleLogin={handleLogin}
        {...pageProps}
      />
    </Layout>
  );
}
