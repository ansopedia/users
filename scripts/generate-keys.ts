import crypto from "crypto";
import fs from "fs";
import path from "path";

const generateKeyPair = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  const keysDir = path.join(process.cwd(), "keys");

  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir);
  }

  fs.writeFileSync(path.join(keysDir, "private.pem"), privateKey);
  fs.writeFileSync(path.join(keysDir, "public.pem"), publicKey);
};

generateKeyPair();
