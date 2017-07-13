export const messages = [
  {
    name: 'Steel Brain',
    message: (
      <span>
        Hey! <br />
        <br />We really appreciate you taking the time to report an issue. The
        collaborators on this project attempt to help as many people as
        possible, but we're a limited number of volunteers, so it's possible
        this won't be addressed swiftly.<br />
        <br />If you need any help, or just have general Babel or JavaScript
        questions, we have a vibrant Slack community that typically always has
        someone willing to help. You can sign-up here for an invite.
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
