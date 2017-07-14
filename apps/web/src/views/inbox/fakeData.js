import * as UI from '@mcro/ui'

export const messages = [
  {
    name: 'Steel Brain',
    message: (
      <span style={{ lineHeight: 1.8 }} $$row>
        <b style={{ opacity: 0.8, marginBottom: 10 }}>
          Version 1.2.4: Raging Eagle
        </b>
        <br />
        Yesterday we shipped a new fraud launch, using TSNE to segment users and
        capture those who are selling adwords to get free gym memberships using
        referrals. <br />
        You can see the update in the fraud panel on all platforms.
        <UI.Button style={{ display: 'inline', marginLeft: 5 }} chromeless>
          (more)
        </UI.Button>
      </span>
    ),
  },
  {
    name: 'Nate Wienert',
    message: (
      <span>
        I would like to be able to add comments both as BlockComments as well as
        LineComments to an AST with babel-types. <br />
        <br />For this I would propose the syntax shown above. Ideally I would
        like to be able to add a comment before a functionDeclaration,
        methodDeclaration, ... too, but this will change a lot of APIs. <br />
        <br />This lead my to the conclusion that these kind of comments might
        be a quick win.
      </span>
    ),
  },
  {
    name: 'Nick Cammarata',
    message: (
      <span>
        My use case is that I would like to generate a file in JS from another
        language not as part of a build chain but for once per library change
        usage. <br />
        <br />This means in conclusion that users of the generated classes
        ideally will never have to know where the original source is and
        including the comments is super important for that.
      </span>
    ),
  },
]

export const threads = [
  {
    title: 'Support stable and update options with mango queries ',
    status: '#621 opened 3 days ago by garrensmith',
    icon: 'alerti',
  },
  {
    title: 'POST and ETag header',
    status: '#620 opened 3 days ago by danielwertheim',
    icon: 'alerti',
  },
  {
    title: 'Deploy to Heroku Button',
    status: '#619 opened 4 days ago by spencerthayer ',
    icon: 'alerti',
  },
  {
    title: "CouchDB won't boot on OTP-20",
    status: '#619 opened 4 days ago by spencerthayer ',
    icon: 'alerti',
  },
  {
    title: 'Create a Helm chart to deploy CouchDB using Kubernetes',
    status: '#619 opened 4 days ago by spencerthayer ',
    icon: 'alerti',
  },
]
