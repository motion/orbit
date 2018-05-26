import css from './css'

const styler = css()

console.log(
  styler({
    color: 'red',
    alpha: 0.5,
    background: [0, 0, 0, 0.5],
    border: [1, 'red'],
    boxShadow: [0, 0, 0, [0, 0, 0, 0.5]],
  }),
)
