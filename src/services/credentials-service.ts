import { conflictError } from "@/errors/conflict-error";
import { forbiddenError } from "@/errors/forbidden-error";
import { notFoundError } from "@/errors/not-found-error";
import { CredentialData } from "@/protocols";
import { credentialRepository } from "@/repositories";
import { cryptographsGeneralPasswords, decryptsPassword } from "@/utils/password-encryption";

export async function createCredential(credential: CredentialData, userId: number) {
    const credentialTitle = await credentialRepository.findCredentialTitle(userId, credential.title)

    if (credentialTitle) {
        throw conflictError("This title is already exist")
    }

    const encryptedPassword = cryptographsGeneralPasswords(credential.password)

    await credentialRepository.createCredential({ ...credential, password: encryptedPassword }, userId)
}

export async function listUserCredentials(userId: number) {
    const userCredentials = await credentialRepository.listUserCredentials(userId)

    if (!userCredentials) {
        throw notFoundError()
    }

    const decryptedCredential = userCredentials.map(credential => {
        return {
            ...credential, password: decryptsPassword(credential.password)
        }
    })

    return decryptedCredential
}

export async function listCredentialById(userId: number, credentialId: number) {
    const credential = await credentialRepository.listCredentialById(credentialId)

    if (!credential) {
        throw notFoundError()
    }

    if (credential.userId !== userId) {
        throw forbiddenError()
    }

    const decryptedPassword = decryptsPassword(credential.password)
    const decryptedCredential = { ...credential, password: decryptedPassword }

    return decryptedCredential
}

export async function deleteCredential(userId: number, credentialId: number) {
    const deletedCredential = await credentialRepository.listCredentialById(credentialId)

    if (!deletedCredential) {
        throw notFoundError()
    }

    if (deletedCredential.userId !== userId) {
        throw forbiddenError()
    }

    await credentialRepository.deleteCredential(deletedCredential.id)
}