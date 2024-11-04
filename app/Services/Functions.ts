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

export function getNumberWithZero({ number }: { number: number }): string {
    return number < 10 ? `0${number}` : `${number}`
}

function toStr(value: string) {
    const val = value.trim()
    return val.length == 0 ? '-' : val
}

function toNum(value: string) {
    const val = value.trim()
    if (val.length == 0) return 0
    if (val.includes('.')) return parseFloat(val)
    return parseInt(val)
}

export function getDataFromCsv(
    {
        folder = 'csv',
        filename,
        separator = ',',
    }: {
        folder: 'csv'
        filename: string
        separator: ',' | ';'
    },
    mapper?: (
        data: string[][],
        toStr: (value: string) => string,
        toNum: (value: string) => number,
    ) => any[],
) {
    const fullpath = Application.resourcesPath(folder, filename)

    const data = fs
        .readFileSync(fullpath, 'utf-8')
        .trim()
        .split('\n')
        .slice(1)
        .map((element) => element.trim().split(separator))

    if (!mapper) return data

    return mapper(data, toStr, toNum)
}

export const success_toast = 'success-toast'
export const error_toast = 'error-toast'
