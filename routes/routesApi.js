import { Router } from "express";
import path from "path";

const router = Router();

router.route("/").get(async (req, res) => {
  res.sendFile(path.resolve("static/webpage.html"));
  return;
});

export default router;
