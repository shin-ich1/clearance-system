const { getAuth } = require('firebase-admin/auth')
const { getFirestore } = require('firebase-admin/firestore')
const { logger } = require('firebase-functions')
const { HttpsError } = require('firebase-functions/v2/https')

module.exports = async function addOrgAdminUser(request) {
    const { email, orgId } = request.data

    const auth = getAuth()
    const userRecord = await auth.getUserByEmail(email)

    if(!userRecord.emailVerified) {
        throw new HttpsError('failed-precondition', 'Email is not yet verified.')
    }

    const firestore = getFirestore()
    const orgRef = firestore.collection('organizations')
        .doc(orgId)
    const orgDoc = await orgRef.get()
    if(!orgDoc.exists) {
        throw new HttpsError('failed-precondition', 'Organization does not exist.')
    }

    const roleId = `orgadmin_${userRecord.uid}_${orgId}`
    const roleData = {
        type: 'orgadmin',
        userId: userRecord.uid,
        userEmail: userRecord.email,
        orgId
    }

    try {
        await firestore.collection('roles')
        .doc(roleId)
        .create(roleData)
    } catch(e) {
        throw e.message.includes('ALREADY_EXISTS')
            ? new HttpsError('already-exists', `${email} is already an admin in this organization.`)
            : new HttpsError('unknown', e.message)
    }

    return { id: roleId, ...roleData }
}