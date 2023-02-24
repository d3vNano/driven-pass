import { notFoundError } from "../errors/not-found-error.js";
import { NetworkData } from "../protocols/index.js";
import { netwotkRepository } from "../repositories/index.js";
import { cryptographsGeneralPasswords, decryptsPassword } from "../utils/password-encryption.js";


export async function createNetwork(network: NetworkData, userId: number) {
    const encryptedPassword = cryptographsGeneralPasswords(network.password)

    await netwotkRepository.createNetwork({ ...network, password: encryptedPassword }, userId)

}

export async function listUserNetworks(userId: number) {
    const networks = await netwotkRepository.listUserNetworks(userId)

    if (!networks) {
        throw notFoundError()
    }

    const decryptedNetwork = networks.map(net => {
        return {
            ...net,
            password: decryptsPassword(net.password)
        }
    })
    return decryptedNetwork
}