const isBrowser = typeof window !== 'undefined'

const { Entity, Column, PrimaryGeneratedColumn, OneToMany } = isBrowser
  ? require('typeorm/browser')
  : require('typeorm')

export { Entity, Column, PrimaryGeneratedColumn, OneToMany }
