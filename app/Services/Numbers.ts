export function getRandomNumberInRange({
    min,
    max,
    isDecimal,
}: {
    min: number
    max: number
    isDecimal: boolean
}): number {
    const randomValue = Math.random() * (max - min) + min
    return isDecimal
        ? parseFloat(randomValue.toFixed(1))
        : Math.floor(randomValue)
}
