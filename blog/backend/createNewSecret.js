import fs from "node:fs";
import crypto from "crypto";

fs.appendFileSync(
  ".env",
  "\n" + `SECRET="${crypto.randomBytes(32).toString("hex")}"`
);
