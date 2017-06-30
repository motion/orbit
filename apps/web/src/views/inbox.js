import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import rc from 'randomcolor'

@view
export default class Inbox {
  render() {
    const title = text =>
      <title $$row>
        {text}
        &nbsp;&nbsp;
        <UI.Badge background={rc()} color="#fff" height={20}>
          hi
        </UI.Badge>
        <UI.Badge background={rc()} color="#fff" height={20}>
          hi
        </UI.Badge>
      </title>

    const status = text =>
      <status $$row>
        {text} <UI.Progress.Bar percent={Math.random() * 100} />
      </status>

    return (
      <inbox>
        <UI.Title size={4}>Inbox</UI.Title>

        <UI.List
          items={[
            {
              primary: title(
                'Support stable and update options with mango queries '
              ),
              secondary: status('#621 opened 3 days ago by garrensmith '),
              icon: 'alerti',
            },
            {
              primary: title('POST and ETag header'),
              secondary: status('#620 opened 3 days ago by danielwertheim '),
              icon: 'alerti',
            },
            {
              primary: title('Deploy to Heroku Button'),
              secondary: status('#619 opened 4 days ago by spencerthayer '),
              icon: 'alerti',
            },
            {
              primary: title('CouchDB won\'t boot on OTP-20'),
              secondary: status('#619 opened 4 days ago by spencerthayer '),
              icon: 'alerti',
            },
            {
              primary: title(
                'Create a Helm chart to deploy CouchDB using Kubernetes'
              ),
              secondary: status('#619 opened 4 days ago by spencerthayer '),
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
