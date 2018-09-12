import { Logger } from '@mcro/logger'
import { Person } from '@mcro/models'

/**
 * Common utilities.
 */
export class CommonUtils {

  /**
   * Generates a hash number for a given object.
   * Make sure given object does not have circular structure.
   *
   * @see https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
   */
  static hash(value: any): number {
    const str = JSON.stringify(value)
    let hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

}
