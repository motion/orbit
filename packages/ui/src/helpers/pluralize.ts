import pluralizer from 'pluralize'

export const pluralize = (amount: number, name: string) => pluralizer(amount, name)