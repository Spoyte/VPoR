import EthCrypto from "eth-crypto";

export async function encryptData(publicKey: string, data: any): Promise<string> {
    const payload = JSON.stringify(data, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
    );
    const encrypted = await EthCrypto.encryptWithPublicKey(publicKey, payload);
    return EthCrypto.cipher.stringify(encrypted);
}
