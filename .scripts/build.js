const fs = require("fs");
const crypto = require("crypto");

const hashedExcuses = {};

console.time("Building")

fs.readFileSync("excuses.txt", "utf8")
  .trim()
  .split("\n")
  .map(
    e =>
      (hashedExcuses[
        crypto
          .createHash("md5")
          .update(e)
          .digest("hex")
      ] = e),
  );

fs.writeFileSync("src/excuses.json", JSON.stringify(hashedExcuses, null, 2));

console.timeEnd("Building");
