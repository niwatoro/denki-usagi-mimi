// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiUrl = "https://wajziv1051.execute-api.ap-northeast-1.amazonaws.com/default/sendEmailToMyGmail";
  const apiKey = "wSTT514lsn8QdSjUQkvOW6R8ldcyHhQb3JBXaDuK";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(req.body),
  });
  const result = await response.json();
  res.status(404).json(result);
}
