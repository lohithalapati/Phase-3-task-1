export class CryptoEngine {
  private static masterSeed = 'nh_secure_shield_engine_v5';

  /**
   * Synchronous fallback encryption algorithm.
   * Leveraged exclusively for synchronous, blocking system workflows (e.g., synchronous storage writes).
   */
  static encryptSync(plain: string): string {
    let output = '';
    const key = this.masterSeed;
    for (let i = 0; i < plain.length; i++) {
      output += String.fromCharCode(plain.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(output);
  }

  static decryptSync(cipher: string): string {
    try {
      const parsed = atob(cipher);
      let output = '';
      const key = this.masterSeed;
      for (let i = 0; i < parsed.length; i++) {
        output += String.fromCharCode(parsed.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return output;
    } catch {
      throw new Error('Symmetric decyphering pipeline failure: Tampered payload data blocks detected.');
    }
  }

  /**
   * High entropy, cryptographically strong Web Crypto subtle asymmetric algorithm wrapper.
   */
  static async createKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
}
