// pages/index.tsx
import Head from "next/head";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface Props {
  handleCredChange: (username: string, word: string) => void;
  handleLogin: () => void;
}

export default function Home({ handleCredChange, handleLogin }: Props) {
  const [word, setWord] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    handleCredChange(username, word);
  }, [word, username, handleCredChange]);

  return (
    <div>
      <Head>
        <title>電気ウサギの耳 - 話したいことないですか？</title>
        <meta name="description" content="Use Native WebRTC API for video conferencing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen bg-black flex flex-col justify-center items-center">
        <div className="h-24 mb-5 flex items-start">
          <Image className="w-full h-full" src={"../logo.svg"} alt="logo" width={999} height={999} />
        </div>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col items-center">
            <MyInput onChange={(e) => setUsername(e.target.value)} value={username} placeholder="📛名前を入力" />
            <MyInput onChange={(e) => setWord(e.target.value)} value={word} placeholder="🗣️話したい言葉を入力" />
            <div className="h-16 flex items-end">
              <button className="bg-red-500 border-b-4 border-b-red-300 rounded-lg py-3 pr-10 pl-8 text-white active:border-none" type="submit">
                🔍話す人を探す
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

type MyInputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
};
const MyInput: FC<MyInputProps> = ({ onChange, value, placeholder }) => {
  return <input required className="rounded-lg p-2 m-1 outline-none" onChange={onChange} value={value} placeholder={placeholder} />;
};
