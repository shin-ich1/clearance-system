const { getAuth } = require('firebase-admin/auth')
const { getFirestore } = require('firebase-admin/firestore')
const { logger } = require('firebase-functions')
const { HttpsError } = require('firebase-functions/v2/https')

module.exports = async function bindStudentUser(request) {
    const { email, studentId } = request.data

    const auth = getAuth()
    const userRecord = await auth.getUserByEmail(email)

    if(!userRecord.emailVerified) {
        throw new HttpsError('failed-precondition', 'Email is not yet verified.')
    }

    const firestore = getFirestore()
    const studentRef = firestore
        .collection('students')
        .doc(studentId)

    const studentDoc = await studentRef.get()
    const studentData = studentDoc.data()
    if(studentData.userId) {
        throw new HttpsError('failed-precondition', 'Student has already been bound to a user.')
    }

    await auth.updateUser(userRecord.uid, {
        displayName: `${studentData.firstname} ${studentData.lastname}`
    })

    await firestore.collection('roles')
        .doc(`student_${userRecord.uid}_${studentDoc.id}`)
        .create({
            type: 'student',
            studentId: studentDoc.id,
            userId: userRecord.uid
        })

    const delta = { userId: userRecord.uid }
    await studentRef.update(delta)
    
    return delta
}