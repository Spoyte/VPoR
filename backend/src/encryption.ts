import EthCrypto from "eth-crypto";

export async function encryptData(publicKey: string, data: any): Promise<string> {
    const payload = JSON.stringify(data);
    const encrypted = await EthCrypto.encryptWithPublicKey(publicKey, payload);
    return EthCrypto.cipher.stringify(encrypted);
}
