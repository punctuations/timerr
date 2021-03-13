import prisma from "../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Is method POST?
  if (req.method == "POST") {
    // Method is post, add new timer, good place to check if all fields are in req.body
    await prisma.timer
      .create({
        data: {
          name: req.body.name,
          notify: req.body.notifyPref,
          childLock: req.body.childLock,
          timeLeft: 0,
        },
      })
      .catch((err) => console.log(err));

    return res.status(200).json({ success: true });
  } else {
    // Method is not POST, return 504 method not allowed
    return res.status(504).json({ success: false, data: "Method not allowed" });
  }
};
