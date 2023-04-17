import { FC, useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import io, { Socket } from "socket.io-client";

export const AudioCall: FC = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => setStream(stream));

    const socket = io("https://preto-raito.vercel.app/");
    socketRef.current = socket;

    socket.on("offer", async (offer: any) => {
      const peer = new SimplePeer({ initiator: false, trickle: false });
      setPeer(peer);

      peer.on("stream", (stream: MediaStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });

      peer.signal(offer);
      socket.emit("answer", peer.signal);
    });

    socket.on("answer", async (answer: any) => {
      peer?.signal(answer);
    });

    socket.on("connect", () => {
      const peer = new SimplePeer({ initiator: true, trickle: false, stream });
      setPeer(peer);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream as MediaStream;
      }

      peer.on("signal", (offer: any) => {
        socket.emit("offer", offer);
      });

      peer.on("stream", (stream: MediaStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });
    });

    return () => {
      socket.disconnect();
      peer?.destroy();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
    </div>
  );
};
