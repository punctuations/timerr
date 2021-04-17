import prisma from "../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const timer = await prisma.timer
      .findMany({
        where: {
          dash: req.body.dashUUID,
        },
      })
      .catch((err) => console.log(err));

    return res.status(200).json({ success: true, prisma: timer });
  } else {
    // Method is not POST, return 504 method not allowed
    return res.status(504).json({ success: false, data: "Method not allowed" });
  }
};
