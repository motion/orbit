export default options => ({
  name: 'extends-react',
  decorator: Klass => {
    Object.setPrototypeOf(Klass.prototype, React.Component.prototype)
  },
})
