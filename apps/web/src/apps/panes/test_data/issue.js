const avatars = {
  nate: '/images/me.jpg',
}

export default {
  title: 'main gh issue',
  body: 'main content',
  createdAt: +Date.now(),
  author: {
    login: 'natew',
    avatarUrl: avatars.nate,
  },
  comments: [
    {
      createdAt: +Date.now(),
      body: 'hello',
      author: {
        login: 'natew',
        avatarUrl: avatars.nate,
      },
    },
  ],
}
