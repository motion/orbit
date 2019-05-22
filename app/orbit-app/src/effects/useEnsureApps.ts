// import { useEffect } from 'react'

// // ensure every static app has a corresponding AppBit

// export function useEnsureApps() {
//   const [space] = useActiveSpace()
//   const appDefs = useAppDefinitions()

//   useEffect(() => {
//     let cancelled = false
//     for (const appDef of appDefs) {
//       loadOne(AppModel, { args: { where: { identifier: appDef.id } } }).then(app => {
//         if (cancelled) return

//         if (!app) {
//           console.log('ensuring model for static app', appDef)
//           save(AppModel, {
//             name: appDef.name,
//             target: 'app',
//             identifier: appDef.id,
//             spaceId: space.id,
//             colors: ['black', 'white'],
//             tabDisplay: 'hidden',
//           })
//         }
//       })
//     }

//     return () => {
//       cancelled = true
//     }
//   }, [space, appDefs])
// }
