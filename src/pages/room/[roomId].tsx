import { useRouter } from "next/router";
import Pusher, { Members, PresenceChannel } from "pusher-js";
import { useEffect, useRef, useState } from "react";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    {
      urls: "stun:openrelay.metered.ca:80",
    },
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "stun:stun2.l.google.com:19302",
    },
  ],
};

type Props = {
  username: string;
  roomname: string;
};
export default function Home({ username, roomname }: Props) {
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);

  const router = useRouter();

  const host = useRef(false);

  const pusherRef = useRef<Pusher>();
  const channelRef = useRef<PresenceChannel>();

  const rtcConnection = useRef<RTCPeerConnection | null>();
  const userStream = useRef<MediaStream>();

  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      authEndpoint: "/api/pusher/auth",
      auth: {
        params: { username: username },
      },
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    channelRef.current = pusherRef.current.subscribe(`presence-${roomname}`) as PresenceChannel;
    channelRef.current.bind("pusher:subscription_error", (status: number) => {
      console.log("status", status);
      router.push("/");
    });
    channelRef.current?.bind("pusher:subscription_succeeded", (members: Members) => {
      if (members.count === 1) {
        host.current = true;
      } else if (members.count > 2) {
        router.push("/");
      }
      handleRoomJoined();
    });
    channelRef.current?.bind("pusher:member_removed", () => {
      handlePeerLeaving();
    });
    channelRef.current?.bind("client-ready", () => {
      initiateCall();
    });
    channelRef.current?.bind("client-offer", (offer: RTCSessionDescriptionInit) => {
      if (!host.current) {
        handleReceiveOffer(offer);
      }
    });
    channelRef.current?.bind("client-answer", (answer: RTCSessionDescriptionInit) => {
      if (host.current) {
        handleAnswerReceived(answer);
      }
    });
    channelRef.current?.bind("client-ice-candidate", (iceCandidate: RTCIceCandidate) => {
      handleNewIceCandidateMsg(iceCandidate);
    });

    return () => {
      if (pusherRef.current) {
        pusherRef.current.unsubscribe(`presence-${roomname}`);
      }
    };
  }, [username, roomname]);

  const handleRoomJoined = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: { width: 1280, height: 720 } })
      .then((stream) => {
        userStream.current = stream;
        userVideo.current!.srcObject = stream;
        userVideo.current!.onloadedmetadata = () => {
          userVideo.current!.play();
        };
        if (!host.current) {
          channelRef.current!.trigger("client-ready", {});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const initiateCall = () => {
    if (host.current) {
      rtcConnection.current = createPeerConnection();

      userStream.current?.getTracks().forEach((track) => {
        rtcConnection.current?.addTrack(track, userStream.current!);
      });

      rtcConnection.current
        ?.createOffer()
        .then((offer) => {
          rtcConnection.current?.setLocalDescription(offer);
          channelRef.current?.trigger("client-offer", offer);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const createPeerConnection = () => {
    const connection = new RTCPeerConnection(ICE_SERVERS);
    connection.onicecandidate = handleICECandidateEvent;
    connection.ontrack = handleTrackEvent;
    connection.onicecandidateerror = (e) => console.log(e);
    return connection;
  };

  const handleReceiveOffer = (offer: RTCSessionDescriptionInit) => {
    rtcConnection.current = createPeerConnection();
    userStream.current?.getTracks().forEach((track) => {
      rtcConnection.current?.addTrack(track, userStream.current!);
    });

    rtcConnection.current.setRemoteDescription(offer);
    rtcConnection.current
      .createOffer()
      .then((answer) => {
        rtcConnection.current?.setLocalDescription(answer);
        channelRef.current?.trigger("client-answer", answer);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAnswerReceived = (answer: RTCSessionDescriptionInit) => {
    rtcConnection.current?.setRemoteDescription(answer).catch((err) => console.log(err));
  };

  const handleICECandidateEvent = async (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      channelRef.current?.trigger("client-ice-candidate", event.candidate);
    }
  };

  const handleNewIceCandidateMsg = (incoming: RTCIceCandidate) => {
    const candidate = new RTCIceCandidate(incoming);
    rtcConnection.current?.addIceCandidate(candidate).catch((err) => console.log(err));
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
    partnerVideo.current!.srcObject = event.streams[0];
    partnerVideo.current!.onloadedmetadata = () => {
      partnerVideo.current!.play();
    };
  };

  const handlePeerLeaving = () => {
    host.current = true;
    if (partnerVideo.current?.srcObject) {
      (partnerVideo.current.srcObject as MediaStream).getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (rtcConnection.current) {
      rtcConnection.current.ontrack = null;
      rtcConnection.current.onicecandidate = null;
      rtcConnection.current.close();
      rtcConnection.current = null;
    }
  };

  const leaveRoom = () => {
    if (userVideo.current?.srcObject) {
      (userVideo.current.srcObject as MediaStream).getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (partnerVideo.current?.srcObject) {
      (partnerVideo.current.srcObject as MediaStream).getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (rtcConnection.current) {
      rtcConnection.current.ontrack = null;
      rtcConnection.current.onicecandidate = null;
      rtcConnection.current.close();
      rtcConnection.current = null;
    }

    router.push("/");
  };

  const toggleMic = () => {
    toggleMediaStream("audio", micActive);
    setMicActive((prev) => !prev);
  };

  const toggleCamera = () => {
    toggleMediaStream("video", cameraActive);
    setCameraActive((prev) => !prev);
  };

  const toggleMediaStream = (type: "audio" | "video", state: boolean) => {
    userStream.current?.getTracks().forEach((track) => {
      if (track.kind == type) {
        track.enabled = !state;
      }
    });
  };

  return (
    <div>
      <video ref={partnerVideo} autoPlay />
      <div>
        <button onClick={toggleMic} type="button">
          {micActive ? "Mute" : "Unmute"}
        </button>
        <button onClick={toggleCamera} type="button">
          {cameraActive ? "Turn off camera" : "Turn on camera"}
        </button>
        <button onClick={leaveRoom}>Leave</button>
      </div>
      <video ref={userVideo} autoPlay muted />
    </div>
  );
}
