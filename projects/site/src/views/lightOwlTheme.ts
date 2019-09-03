export default {
  plain: {
    color: '#403f53',
    backgroundColor: '#FBFBFB',
  },
  styles: [
    {
      types: ['changed'],
      style: {
        color: 'rgb(162, 191, 252)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['deleted'],
      style: {
        color: 'rgba(239, 83, 80, 0.56)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['inserted', 'attr-name'],
      style: {
        color: '#6283A9',
      },
    },
    {
      types: ['comment'],
      style: {
        color: 'rgb(152, 159, 177)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['string', 'builtin', 'char', 'constant', 'url'],
      style: {
        color: 'rgb(72, 118, 214)',
      },
    },
    {
      types: ['variable'],
      style: {
        color: 'rgb(64, 63, 83)',
      },
    },
    {
      types: ['number'],
      style: {
        color: 'rgb(170, 9, 130)',
      },
    },
    {
      types: ['punctuation', 'function', 'keyword', 'selector', 'doctype'],
      style: {
        color: 'rgb(153, 76, 195)',
      },
    },
    {
      types: ['class-name'],
      style: {
        color: 'rgb(17, 17, 17)',
      },
    },
    {
      types: ['tag'],
      style: {
        color: 'rgb(153, 76, 195)',
      },
    },
    {
      types: ['operator', 'property', 'namespace'],
      style: {
        color: 'rgb(12, 150, 155)',
      },
    },
    {
      types: ['boolean'],
      style: {
        color: 'rgb(188, 84, 84)',
      },
    },
  ],
}
