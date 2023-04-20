import { adminDB } from "@/firebase/server";
import generateRandomString from "@/pages/utils/generateRandomString";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  roomname: string;
};
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const json = JSON.parse(req.body);
  const docRef = adminDB.collection("words").doc(json.word);
  const doc = await docRef.get();
  let roomname: string | null | undefined = doc.data()?.roomname;
  if (roomname === null || roomname === undefined) {
    roomname = generateRandomString();
    await docRef.set({ roomname: roomname });
  } else {
    await docRef.set({});
  }
  res.status(200).json({ roomname: roomname });
}
