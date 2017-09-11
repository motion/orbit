const avatars = {
  nate: '/images/me.jpg',
  nick: '/images/nick.jpg',
}

export default {
  title: 'main gh issue',
  body: `
      Performance has been unacceptably slow recently and there are many easy
      wins in Acorn that we can attack first
      `,
  createdAt: +Date.now() - 10000000,
  author: {
    login: 'ncammarata',
    avatarUrl: avatars.nick,
  },
  comments: [
    {
      createdAt: +Date.now(),
      body: (
        <div>
          <p>
            In 14584c2 I accidentally introduced a dependency cycle, so we'll
            have that same publishing issue we have in 6.x.
          </p>
          <br />

          <p>
            I made babel-traverse depend on babel-helper-function-name, which
            depends back on babel-traverse. It also appears that depends on
            babel-template and babel-template depends on babel-traverse.
          </p>
          <br />

          <p>
            We should do a check for dependency cycles in our packages and
            probably fail PRs if they exist
          </p>
        </div>
      ),
      author: {
        login: 'natew',
        avatarUrl: avatars.nate,
      },
    },
  ],
}
