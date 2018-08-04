import { Bit } from './Bit'
import { Person } from './Person'

export interface PersonBit {

  /**
   * Target type.
   */
  target: "person-bit"

  /**
   * Person's email address.
   */
  email: string

  /**
   * Person's name.
   */
  name: string

  /**
   * All known person names.
   */
  allNames: string[]

  /**
   * Person's profile photo.
   */
  photo: string

  /**
   * All known person photos.
   */
  allPhotos: string[]

  /**
   * Bits related to this Person.
   */
  bits: Bit[]

  /**
   * People from integrations.
   */
  people: Person[]

}