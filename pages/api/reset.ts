import prisma from "../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    await prisma.timer
      .update({
        where: {
          timerUUID: req.body.uuid,
        },
        data: {
          endsAt: moment().add(req.body.rawTime, req.body.rawUnits).format(),
        },
      })
      .catch((err) => console.log(err));

    return res.status(200).json({
      success: true,
      message: `Reset timer with UUID: ${req.body.uuid}`,
    });
  } else {
    // Method is not POST, return 504 method not allowed
    return res.status(504).json({ success: false, data: "Method not allowed" });
  }
};
