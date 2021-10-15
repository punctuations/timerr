import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@lib/supabaseClient";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { data, error } = await supabase
      .from("Timer")
      .select("*")
      .eq("timerUUID", req.body.uuid);
    if (error) return res.status(500).json({ success: false, data: error });

    return res.status(200).json({ success: true, supabase: data });
  } else {
    // Method is not POST, return 504 method not allowed
    return res.status(504).json({ success: false, data: "Method not allowed" });
  }
};
