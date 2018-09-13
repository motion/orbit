import { Logger } from '@mcro/logger'
import { Person } from '@mcro/models'
import stringHash from 'string-hash';

/**
 * Common utilities.
 */
export class CommonUtils {

  /**
   * Generates a hash number for a given object.
   * Make sure given object does not have circular structure.
   *
   * @see https://github.com/darkskyapp/string-hash
   */
  static hash(value: any): number {
    return stringHash(JSON.stringify(value))
  }

}
