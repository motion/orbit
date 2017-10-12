import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view({
  store: class ProgressStore {
    active = false
    percent = 0

    willMount() {
      this.go()
    }

    go = () => {
      this.clearId = setInterval(() => {
        this.percent += 1
        if (this.percent === 100) {
          clearInterval(this.clearId)
        }
      }, 200)
    }

    willUnmount() {
      clearInterval(this.clearId)
    }
  },
})
export default class Progress {
  render({ store }) {
    const pad = s => (('' + s).length === 1 ? '0' + s : s)
    return (
      <container>
        <UI.Theme name="dark">
          <mover css={{ width: store.percent + '%' }} />
          <status
            $$row
            css={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <info>
              <UI.Text opacity={0.9} size={0.9}>
                Syncronizing issues from tensorflow/tensorflow ({pad(store.percent)}%)
              </UI.Text>
            </info>
            <UI.Button
              $close
              size={0.7}
              chromeless
              iconSize={13}
              icon="remove"
            />
          </status>
        </UI.Theme>
      </container>
    )
  }

  static style = {
    mover: {
      transition: 'all 80ms ease-in',
      background: '#50da50',
      marginTop: -1,
      height: 2,
      boxShadow: '1px 1px 5px rgba(0,0,0,0.1)',
    },
    status: {
      marginTop: 2,
      padding: [3, 5],
    },
    info: {
      marginLeft: 5,
    },
    close: {
      marginTop: -1,
    },
    container: {
      position: 'absolute',
      background: 'rgba(0,0,0,0.6)',
      width: '100%',
      left: 0,
      right: 0,
      bottom: 0,
      height: 30,
    },
  }
}
