const isBrowser = typeof window !== 'undefined'
const typeorm = isBrowser
  ? require('typeorm/browser')
  : eval(`require('typeorm')`)

const {
  BaseEntity,
  Index,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  getConnection,
  OneToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Not,
  Equal,
  MoreThan,
  Raw,
  IsNull,
  Any,
  In,
  Between,
  Like,
  getRepository,
  Brackets,
  LessThan,
} = typeorm

export {
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  BaseEntity,
  Index,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  getConnection,
  OneToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Not,
  Equal,
  MoreThan,
  Raw,
  IsNull,
  Any,
  In,
  Between,
  Like,
  getRepository,
  Brackets,
  LessThan,
}

// globals
if (isBrowser) {
  // @ts-ignore
  window.typeorm = typeorm
} else {
  // @ts-ignore
  global.typeorm = typeorm
}
