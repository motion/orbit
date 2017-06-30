import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class Inbox {
  render() {
    return (
      <inbox>
        <UI.Title size={4}>Inbox</UI.Title>

        <UI.List
          items={[
            {
              primary: 'Support stable and update options with mango queries ',
              secondary: '#621 opened 3 days ago by garrensmith ',
              icon: 'alerti',
            },
            {
              primary: 'POST and ETag header',
              secondary: '#620 opened 3 days ago by danielwertheim ',
              icon: 'alerti',
            },
            {
              primary: 'Deploy to Heroku Button',
              secondary: '#619 opened 4 days ago by spencerthayer ',
              icon: 'alerti',
            },
            {
              primary: 'CouchDB won\'t boot on OTP-20',
              secondary: '#619 opened 4 days ago by spencerthayer ',
              icon: 'alerti',
            },
            {
              primary: 'Create a Helm chart to deploy CouchDB using Kubernetes',
              secondary: '#619 opened 4 days ago by spencerthayer ',
              icon: 'alerti',
            },
          ]}
        />
      </inbox>
    )
  }

  static style = {
    inbox: {
      padding: 20,
    },
  }
}
