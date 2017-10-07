//<UI.Row
//        stretch
//        css={{
//          margin: [0, -10, 10],
//          background: '#eee',
//        }}
//        itemProps={{
//          size: 1,
//          height: 42,
//          borderWidth: 0,
//          highlightBackground: '#fff',
//          highlightColor: '#000',
//        }}
//      >
//        {store.types.map(type => {
//          const highlight =
//            (isUndefined(type.type) ? type.name : type.type) ===
//            store.filters.type
//          return (
//            <UI.Button
//              key={type}
//              icon={type.icon}
//              highlight={highlight}
//              glow={!highlight}
//              padding={[0, 15]}
//              borderRadius={0}
//              opacity={highlight ? 1 : 0.5}
//              css={{
//                borderBottom: [1, 'solid', '#fff'],
//                borderColor: highlight ? 'transparent' : '#eee',
//              }}
//              onClick={() => {
//                store.setFilter(
//                  'type',
//                  isUndefined(type.type) ? type.name : type.type
//                )
//              }}
//            >
//              {capitalize(type.name)}
//            </UI.Button>
//          )
//        })}
//      </UI.Row>
