import * as React from "react"
import { view, store } from "@mcro/black"
import { includes } from "lodash"
import * as UI from "@mcro/ui"
import RelevancyStore from "./store"
import { observer } from "mobx-react"

@view({
  store: RelevancyStore
})
export default class RelevancyPage {
  render({ store }) {
    store.entities
    store.version
    let article = store.article
    store.entities
      .filter(i => i.length > 2)
      .map(name => name.trim().replace(/\n/gi, ""))
      .forEach(name => {
        console.log("replacing", name)
        article = article.replace(
          new RegExp(name + "([^a-zA-Zds:])", "gi"),
          (_, char) => {
            return "::" + name.replace(/\ /g, "-") + "::" + char
          }
        )
      })

    const lines = article.split("\n")

    return (
      <outer $$row>
        <container>
          <lines>
            {lines.map(line => {
              let highlighted = null
              return (
                <line $$row>
                  {line.split(" ").map(word => {
                    const highlight = word.indexOf("::") > -1
                    if (highlight) {
                      console.log("highlighting", word)
                    }
                    word = word.replace(/::/g, "")
                    word = word.replace(/-/g, " ")

                    return (
                      <word
                        onMouseOver={() => {
                          if (highlight) {
                            store.highlight = word
                          }
                        }}
                        onMouseLeave={() => (store.highlight = null)}
                        $highlight={highlight}
                      >
                        {word}
                      </word>
                    )
                  })}
                </line>
              )
            })}
          </lines>
        </container>
        <UI.Title size={3} $title>
          {store.highlight || "nothing selected"}
        </UI.Title>
      </outer>
    )
  }

  static style = {
    outer: {},
    container: {
      height: "100%",
      overflow: "scroll",
      pointerEvents: "all",
      marginLeft: 35
    },
    title: {
      marginTop: 20,
      marginLeft: 20
    },
    lines: {
      flex: 1,
      marginTop: 20
    },
    word: {
      marginLeft: 5,
      opacity: 0.7
    },
    highlight: {
      opacity: "1 !important",
      fontWeight: 800
    },
    line: {
      flex: 1,
      flexWrap: "wrap",
      width: 600,
      marginTop: 5
    }
  }
}
