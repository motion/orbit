import Tilt from 'react-tilt'
import Glow from './glow'

export default ({ width, height, tiltOptions, children }) =>
  <Tilt
    key={0}
    options={{
      max: 10,
      perspective: 1000,
      reverse: true,
      scale: 1,
      ...tiltOptions,
    }}
  >
    <doc
      $$style={{
        cursor: 'default',
        width,
        height,
        borderRadius: 5,
        transition: 'transform 50ms ease-in',
      }}
    >
      {children}
      <Glow
        key={1}
        full
        scale={2}
        resist={20}
        color={[255, 255, 255]}
        zIndex={1000}
        opacity={0.3}
        gradient
      />
      <Glow
        key={2}
        behind
        resist={90}
        width={width}
        height={height - 30}
        blur={10}
        inverse
        color={[0, 0, 0]}
        zIndex={1000}
        opacity={0.3}
        borderRadius={10}
      />
    </doc>
  </Tilt>
