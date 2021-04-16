import prisma from "../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    await prisma.timer
      .delete({
        where: {
          timerUUID: req.body.uuid,
        },
      })
      .catch((err) => console.log(err));

    return res
      .status(200)
      .json({
        success: true,
        message: `Deleted timer with UUID: ${req.body.uuid}`,
      });
  } else {
    // Method is not POST, return 504 method not allowed
    return res.status(504).json({ success: false, data: "Method not allowed" });
  }
};
