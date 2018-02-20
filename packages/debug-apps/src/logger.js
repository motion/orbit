import Winston from 'winston'

export default new Winston.Logger({
  transports: [
    new Winston.transports.Console({
      colorize: 'true',
    }),
  ],
})
