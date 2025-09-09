// run-init.js
import "dotenv/config";
import { initDb } from "./lib/posts.js";

(async () => {
  await initDb();
  console.log("Database initialized!");
})();
