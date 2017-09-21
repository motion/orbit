/*
*  A text mapper is used to map one or multiple bodies of text to more bodies of text
*  The way it does this is by splitting each body of text using separators(spliters)
*/
export default class TextMapper {
  //Initialize the textMapper by setting the spliter(aka separators or delimiters)
  //These are used to define what a body of text (document) is
  //For example if each newline is considered a document: new TextMapper("\n");
  constructor(...spliters) {
    this.spliters = spliters
    this.documents = []
  }

  //Internal function used to split all documents using a character
  //It concatinates the splitd document arrays into a bigger array
  //It replaces the default documents array with the new one
  //If a resulting document consists only of whitespaces it is ignored
  splitDocuments(spliter) {
    let newDocuments = []
    this.documents.forEach(doc => {
      let splitDocument = doc.split(spliter)
      splitDocument.forEach(doc => {
        if (!/^[\s]{0,}$/.test(doc)) {
          newDocuments.push(doc)
        }
      })
    })
    this.documents = newDocuments
  }

  //Returns the generated splitd documents as an array of Strings
  generateDocuments() {
    this.spliters.forEach(spliter => {
      this.splitDocuments(spliter)
    })
    return this.documents
  }

  //Used to set the documents/body of texts that are to be mapped
  feedDocuments(...documents) {
    this.documents = documents
  }
}
