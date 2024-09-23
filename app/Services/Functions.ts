import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'

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

export function getDataFromCsv(
    {
        folder,
        filename,
    }: {
        folder: 'csv'
        filename: string
    },
    mapper?: (data: string[][], toStr: (value: string) => string) => any[],
) {
    const fullpath = Application.resourcesPath(folder, filename)

    const data = fs
        .readFileSync(fullpath, 'utf-8')
        .trim()
        .split('\n')
        .slice(1)
        .map((element) => element.trim().split(','))

    if (!mapper) return data

    const toStr = (value: string) =>
        value.trim().length == 0 ? '-' : value.trim()

    return mapper(data, toStr)
}
