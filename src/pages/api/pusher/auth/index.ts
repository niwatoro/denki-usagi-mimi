import { pusher } from "@/lib/pusher";
import { generateRandomString } from "@/pages/utils/generateRandomString";
import { NextApiRequest, NextApiResponse } from "next";
import { ChannelAuthResponse, PresenceChannelData } from "pusher";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<ChannelAuthResponse | void> {
  const { socket_id, channel_name, username } = req.body;
  const randomString = generateRandomString();

  const presenceChannel: PresenceChannelData = {
    user_id: randomString,
    user_info: {
      username: "@" + username,
    },
  };

  try {
    const auth = pusher.authorizeChannel(socket_id, channel_name, presenceChannel);
    res.send(auth);
  } catch (error) {
    console.log(error);
    res.send(500);
  }
}
