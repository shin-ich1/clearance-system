export function isEmailValid(value) {
    return Boolean(value) && /^[^\s@]+@[^\s@]+$/.test(value)
}

export function isPasswordValid(value) {
    return Boolean(value) && value.length >= 8
}