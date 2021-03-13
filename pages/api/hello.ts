import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../src/lib/db'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'POST') {
    prisma.timer
		.create({
			data: {
				name: req.body.name,
				notify: req.body.notifyPref,
				childLock: req.body.childLock,
				timeLeft: 0,
			},
		}).catch(err => console.log(err))
  }
  res.statusCode = 200;
  res.json({ name: 'John Doe' });
}