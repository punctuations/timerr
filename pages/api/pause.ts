import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@lib/supabaseClient";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { error } = await supabase
      .from("Timer")
      .update({
        paused: req.body.pausedState,
        updatedAt: new Date().toISOString(),
      })
      .match({ timerUUID: req.body.uuid });
    if (error) return res.status(500).json({ success: false, data: error });

    return res.status(200).json({
      success: true,
      message: `Updated timer with UUID: ${req.body.uuid}`,
    });
  } else {
    // Method is not POST, return 504 method not allowed
    return res.status(504).json({ success: false, data: "Method not allowed" });
  }
};
