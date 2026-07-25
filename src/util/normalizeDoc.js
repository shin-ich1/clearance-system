export default function normalizeDoc(doc) {
    return { id: doc.id, ...doc.data() }
}