import { MouseEvent, ReactNode, useState } from "react";
import ReactLoading from "react-loading";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showsError, setShowsError] = useState(false);

  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");

  const handleFind = (e: MouseEvent<HTMLButtonElement>) => {
    if (input === "") {
      alert("誰かと話したい言葉を入力してください");
      return;
    }
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
      setShowsError(true);
    }, 10000);
  };

  return (
    <div className="bg-black text-white w-screen h-screen relative">
      <div className={`absolute w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center ${isOpen ? "" : "hidden"}`}>
        <ReactLoading color="#fff" type="spinningBubbles" />
      </div>
      <div className="w-full h-full flex justify-center items-center">
        {showsError ? (
          <div className="px-10 flex flex-col items-center gap-y-3">
            <div>503 Service Unavailable</div>
            <div>サーバーが弱くすみません</div>
            <div>製品版出たらメールほしいですか？</div>
            <input
              type="text"
              placeholder="メールアドレス"
              className="h-full w-full rounded-lg outline-none px-2 py-3 text-xl text-black"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
            <div className="h-16 flex items-end">
              <MyButton onClick={() => setShowsError(false)}>トップに戻る</MyButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-y-3 w-full px-14">
            <div>同じ言葉を入力した人と話せます</div>
            <input
              type="text"
              placeholder="誰かと話したい言葉を入力"
              className="h-full w-full rounded-lg outline-none px-2 py-3 text-xl text-black"
              onChange={(e) => {
                setInput(e.target.value);
              }}
              value={input}
            />
            <div className="h-16 flex items-end">
              <MyButton onClick={handleFind}>ひとを探す🔍</MyButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MyButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}
const MyButton = ({ onClick, children }: MyButtonProps) => {
  return (
    <button className="h-fit w-fit rounded-lg px-5 py-3 bg-red-500 border-red-300 border-b-4 active:border-0" onClick={onClick}>
      {children}
    </button>
  );
};
