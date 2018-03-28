const isBrowser = typeof global === 'undefined'

const {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} = isBrowser ? require('typeorm/browser') : require('typeorm')

export { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany }
