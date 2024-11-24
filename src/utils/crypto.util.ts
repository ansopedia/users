import fs from "fs";
import path from "path";

import { ErrorTypeEnum } from "@/constants";

import logger from "./logger";

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export class CryptoUtil {
  private static instance: CryptoUtil | null = null;
  private keyPair: KeyPair | null = null;

  private constructor() {}

  static getInstance(): CryptoUtil {
    if (CryptoUtil.instance === null) {
      CryptoUtil.instance = new CryptoUtil();
    }
    return CryptoUtil.instance;
  }

  async loadKeys(): Promise<KeyPair> {
    if (this.keyPair) return this.keyPair;

    try {
      const keysDir = path.join(process.cwd(), "keys");

      const publicKey = await fs.promises.readFile(path.join(keysDir, "public.pem"), "utf8");

      const privateKey = await fs.promises.readFile(path.join(keysDir, "private.pem"), "utf8");

      this.keyPair = { publicKey, privateKey };
      return this.keyPair;
    } catch (error) {
      logger.error("Error loading keys:", error);
      throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
    }
  }

  getPublicKey(): string {
    if (this.keyPair?.publicKey === null || this.keyPair?.publicKey === undefined) {
      throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
    }
    return this.keyPair.publicKey;
  }

  getPrivateKey(): string {
    if (this.keyPair?.privateKey === null || this.keyPair?.privateKey === undefined) {
      throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
    }
    return this.keyPair.privateKey;
  }
}
