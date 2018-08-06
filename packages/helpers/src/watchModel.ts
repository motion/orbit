export function watchModel(
  Model: any,
  where: Object,
  onChange: Function,
  options?,
) {
  const { interval = 1000 } = options || {}
  let setting
  let refreshInterval
  Model.findOne({ where }).then(first => {
    setting = first
    if (setting) {
      onChange(setting)
    }
    refreshInterval = setInterval(async () => {
      const next = await Model.findOne({ where })
      if (!next) {
        return
      }
      if (!setting) {
        setting = next
        onChange(setting)
        return
      }
      if (Date.parse(next.updatedAt) === Date.parse(setting.updatedAt)) {
        return
      }
      setting = next
      onChange(setting)
    }, interval)
  })
  return {
    cancel: () => {
      clearInterval(refreshInterval)
    },
  }
}
