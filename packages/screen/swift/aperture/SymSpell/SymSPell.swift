//
//  SymSpell.swift
//  Autocorrect
//
//  Created by Cyril Zakka on 12/30/15.
//  Copyright © 2015 Cyril Zakka. All rights reserved.
//
import Foundation

extension String {
  subscript (bounds: CountableClosedRange<Int>) -> String {
    let start = index(startIndex, offsetBy: bounds.lowerBound)
    let end = index(startIndex, offsetBy: bounds.upperBound)
    return String(self[start...end])
  }
  
  subscript (bounds: CountableRange<Int>) -> String {
    let start = index(startIndex, offsetBy: bounds.lowerBound)
    let end = index(startIndex, offsetBy: bounds.upperBound)
    return String(self[start..<end])
  }
}

class SymSpell {
  var editDistanceMax = 2 as Int
  var verbose = 1 as Int
  
  init (editDistance: Int, verbose: Int) {
    self.editDistanceMax = editDistance
    self.verbose = verbose
  }
  
  /* Verbose Settings
   0: returns the top suggestion
   1: returns all suggestions of the smallest edit distance
   2: returns all suggestions <= editDistanceMax (slower, no early termination)
   */
  
  class DictionaryItem {
    var suggestions = [Int]()
    var count = 0 as Int
  }
  
  
  class SuggestItem {
    var term = "" as String
    var distance = 0 as Int
    var count = 0 as Int
    func isEqual(object: AnyObject?) -> Bool {
      if let object = object as? SuggestItem {
        return term == object.term
      } else {
        return false
      }
    }
    var hash: Int {
      return term.hashValue
    }
  }
  
  /*
   Dictionary that contains both the original words and the deletes derived from them. A term might be both word and delete from another word at the same time.
   For space reduction an item might be of either class: DictionaryItem or Int.
   A DictionaryItem is used for word, word/delete, and delete with multiple suggestions. Int is used for deletes with a single suggestion.
   */
  var dictionary = [String:AnyObject]()
  
  /*
   List of unique words. By using the suggestions (Int) as index for this list they are translated into the original string.
   */
  var wordList = [String]()
  
  //Create a non-unique wordlist from a provided corpus. Is language-independent and can even be used with Chinese characters.
  func parseWords(text: String!) -> [String] {
    do {
      let regex = try NSRegularExpression(pattern: "[\\w-[\\d_]]+", options: [])
      let nsString = text.lowercased() as NSString
      let results = regex.matches(in: text.lowercased(),
                                  options: [], range: NSMakeRange(0, nsString.length))
      return results.map { nsString.substring(with: $0.range)}
    } catch let error as NSError {
      NSLog("invalid regex: \(error.localizedDescription)")
      return []
    }
  }
  
  var maxLength = 0 as Int
  
  // For every word provided, all deletes with an edit distance of 1...editDistanceMax is created and added to the dictionary. Every delete entry has a suggestion list which points to the original term or terms it was created from. Dictionary items are dynamically updated.
  func createDictionaryEntry(_ key: String, language: String) -> Bool {
    var result = false
    var value = DictionaryItem()
    // Int or DictionaryItem existed before word
    if let valueo = dictionary[language + key] {
      if valueo is Int {
        let tmp = valueo as! Int
        value = DictionaryItem()
        value.suggestions.append(tmp)
        dictionary[language + key] = value
      } else { //Already exists: word appears several times, word1==deletes(word2)
        value = valueo as! DictionaryItem
      }
      // prevent overflow
      if value.count < Int.max {
        value.count += 1
      }
    } else if wordList.count < Int.max {
      value.count += 1
      dictionary[language + key] = value
      if key.count > maxLength {
        maxLength = key.count
      }
    }
    
    /*  Edits/suggestions are created only once, no matter how often word occurs.
     Edits/suggestions are created only as soon as the word occurs in the corpus, even if the same term existed before in the dictionary as an edit from another word
     A treshold might be specified, when a term occurs so frequently in the corpus that it is considered a valid word for spelling correction
     */
    if value.count == 1 {
      //word2index
      wordList.append(key)
      let keyint = Int(wordList.count - 1)
      result = true
      //create deletes
      for delete in edits(key[key.startIndex..<key.endIndex], editDistance: 0, deletes: []) {
        if let value2 = dictionary[language+(delete as! String)] {
          //Already exists: word1==deletes(word2), deletes(word1)==deletes(word2) or because Int/DictionaryItem single delete existed before
          if value2 is Int {
            let tmp = value2 as! Int
            let di = DictionaryItem()
            di.suggestions.append(tmp)
            dictionary[language+(delete as! String)] = di
            
            if !di.suggestions.contains(keyint) {
              di.suggestions.append(keyint)
              addLowestDistance(di, suggestion: key, suggestionint: keyint, delete: delete as! String)
            }
          } else if !(value2 as! DictionaryItem).suggestions.contains(keyint) {
            (value2 as! DictionaryItem).suggestions.append(keyint)
            addLowestDistance(value2 as! DictionaryItem, suggestion: key, suggestionint: keyint, delete: delete as! String)
          }
        } else {
          dictionary[language+(delete as! String)] = keyint as AnyObject
        }
      }
    }
    return result
  }
  
  // Save some time and space
  func addLowestDistance(_ item: DictionaryItem, suggestion: String, suggestionint: Int, delete: String) {
    //remove all existing suggestions of higher distance, if verbose<2
    if (verbose < 2) && (item.suggestions.count > 0) && (wordList[item.suggestions[0]].count - delete.count) > (suggestion.count - delete.count) {
      item.suggestions = []
    }
    
    if (verbose == 2) || (item.suggestions.count == 0) || (wordList[item.suggestions[0]].count - delete.count) >= (suggestion.count - delete.count) {
      item.suggestions.append(suggestionint)
    }
  }
  
  //inexpensive and language independent: only deletes, no transposes + replaces + inserts
  //replaces and inserts are expensive and language dependent
  func edits(_ word: Substring, editDistance: Int, deletes: NSMutableSet) -> NSMutableSet {
    let editDistance = editDistance + 1
    if word.count > 1 {
      for i in 0..<(word.count - 1) {
        //delete ith character
        let start = word[word.startIndex..<word.index(word.startIndex, offsetBy: i)]
        let end = word[word.index(word.startIndex, offsetBy: i + 1)..<word.endIndex]
        let delete = start + end
        if !deletes.contains(delete) {
          deletes.add(delete)
          //recursion, if maximum edit distance not yet reached
          if editDistance < editDistanceMax {
            edits(delete, editDistance: editDistance, deletes: deletes)
          }
        }
      }
    }
    return deletes
  }
  
  func lookup(_ input: String, language: String, editDistanceMax: Int) -> [SuggestItem] {
    //save some time
    if (input.count - editDistanceMax > maxLength) {
      return [SuggestItem]()
    }
    
    var candidates = [Substring]()
    let hashSet1 = NSMutableSet()
    
    var suggestions = [SuggestItem]()
    let hashSet2 = NSMutableSet()
    
    //add original term
    candidates.append(input[input.startIndex..<input.endIndex])
    
    while candidates.count > 0 {
      let candidate = candidates[0]
      candidates.remove(at: 0)
      
      //save some time
      //early termination
      //suggestion distance=candidate.distance... candidate.distance+editDistanceMax
      //if canddate distance is already higher than suggestion distance, than there are no better suggestions to be expected
      if verbose < 2 && suggestions.count > 0 && input.count - candidate.count > suggestions[0].distance {
        break
      }
      
      if let valueo = dictionary[language+candidate] {
        var value = DictionaryItem()
        if valueo is Int {
          value.suggestions.append(valueo as! Int)
        } else {
          value = valueo as! DictionaryItem
        }
        //if count>0 then candidate entry is correct dictionary term, not only delete item
        if value.count > 0 && !hashSet2.contains(candidate) {
          hashSet2.add(candidate)
          //add correct dictionary term term to suggestion list
          let si = SuggestItem()
          si.term = String(candidate)
          si.count = value.count
          si.distance = input.count - candidate.count
          suggestions.append(si)
          //early termination
          if verbose < 2 && input.count - candidate.count == 0 {
            break
          }
        }
        
        //iterate through suggestions (to other correct dictionary items) of delete item and add them to suggestion list
        for suggestionint in value.suggestions {
          //save some time
          //skipping double items early: different deletes of the input term can lead to the same suggestion
          //index2word
          let suggestion = wordList[suggestionint]
          if !hashSet2.contains(suggestion) {
            hashSet2.add(suggestion)
            
            //True Damerau-Levenshtein Edit Distance: adjust distance, if both distances>0
            //We allow simultaneous edits (deletes) of editDistanceMax on on both the dictionary and the input term.
            //For replaces and adjacent transposes the resulting edit distance stays <= editDistanceMax.
            //For inserts and deletes the resulting edit distance might exceed editDistanceMax.
            //To prevent suggestions of a higher edit distance, we need to calculate the resulting edit distance, if there are simultaneous edits on both sides.
            //Example: (bank==bnak and bank==bink, but bank!=kanb and bank!=xban and bank!=baxn for editDistanceMaxe=1)
            //Two deletes on each side of a pair makes them all equal, but the first two pairs have edit distance=1, the others edit distance=2.
            var distance = 0
            
            if suggestion != input {
              if suggestion.count == candidate.count {
                distance = input.count - candidate.count
              } else if input.count == candidate.count {
                distance = suggestion.count - candidate.count
              } else {
                //common prefixes and suffixes are ignored, because this speeds up the Damerau-levenshtein-Distance calculation without changing it.
                var ii = 0
                var jj = 0
                
                while (ii < suggestion.count) && (ii < input.count) && suggestion[suggestion.index(suggestion.startIndex, offsetBy: ii)] == input[input.index(input.startIndex, offsetBy: ii)] {
                  ii += 1
                }
                while jj < suggestion.count - ii && jj < input.count - ii && suggestion[suggestion.index(suggestion.startIndex, offsetBy: suggestion.count - jj - 1)] == input[input.index(input.startIndex, offsetBy: input.count - jj - 1)] {
                  jj += 1
                }
                
                if ii > 0 || jj > 0 {
                  distance = damerauLevenshteinDistance((suggestion as NSString).substring(with: NSMakeRange(ii, suggestion.count - ii - jj)), target: (input as NSString).substring(with: NSMakeRange(ii, input.count - ii - jj)))
                } else {
                  distance = damerauLevenshteinDistance(suggestion, target: input)
                }
              }
            }
            
            //save some time.
            //remove all existing suggestions of higher distance, if verbose<2
            if verbose < 2 && suggestions.count > 0 && suggestions[0].distance > distance {
              suggestions = []
            }
            //do not process higher distances than those already found, if verbose<2
            if verbose < 2 && suggestions.count > 0 && suggestions[0].distance < distance {
              continue
            }
            
            if distance <= editDistanceMax {
              if let value2 = dictionary[language+suggestion] {
                let si = SuggestItem()
                si.term = suggestion
                si.count = (value2 as! DictionaryItem).count
                si.distance = distance
                suggestions.append(si)
                
              }
            }
          }
        } // end for each
      } // end if
      
      //add edits
      //derive edits (deletes) from candidate (input) and add them to candidates list
      //this is a recursive process until the maximum edit distance has been reached
      if input.count - candidate.count < editDistanceMax {
        //save some time
        //do not create edits with edit distance smaller than suggestions already found
        if verbose < 2 && suggestions.count > 0 && input.count - candidate.count >= suggestions[0].distance {
          continue
        }

        for i in 0..<candidate.count {
          let start = candidate[candidate.startIndex..<candidate.index(candidate.startIndex, offsetBy: i)]
          let end = candidate[candidate.index(candidate.startIndex, offsetBy: i + 1)..<candidate.endIndex]
          let delete = start + end
          if !hashSet1.contains(delete) {
            hashSet1.add(delete)
            candidates.append(delete)
          }
        }
      }
    } // end while
    if verbose < 2 {
      suggestions.sort(by: { (s1: SuggestItem, s2: SuggestItem) -> Bool in
        return s1.count > s2.count
      })
    } else {
      suggestions.sort(by: { (s1: SuggestItem, s2: SuggestItem) -> Bool in
        return 2*(s1.distance - s2.distance) < s1.count - s2.count
      })
    }
    
    if verbose == 0 && suggestions.count > 1 {
      return [suggestions[0]]
    } else {
      return suggestions
    }
  }
  
  func correct(_ input: String, language: String) -> [SuggestItem] {
    var suggestions: [SuggestItem] = []
    suggestions = lookup(input, language: language, editDistanceMax: editDistanceMax)
    return suggestions
  }
  
  func damerauLevenshteinDistance(_ source: String, target: String) -> Int {
    return Int((source as NSString).mdc_damerauLevenshteinDistance(to: target))
  }
}

