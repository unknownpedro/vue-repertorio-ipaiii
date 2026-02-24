// src/utils/dateUtils.ts

export function getDomingoOrdinal(data: Date): number {
    const dia = data.getDate();
    return Math.ceil(dia / 7);
}

export function isDomingo(data: Date): boolean {
    return data.getDay() === 0;
}