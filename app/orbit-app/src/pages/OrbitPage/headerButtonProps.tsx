export const headerButtonProps = {
  circular: true,
  background: 'transparent',
  glint: false,
  glintBottom: false,
  borderWidth: 0,
  margin: [-1, 2],
  opacity: 0.75,
  hoverStyle: { opacity: 1, background: theme => theme.backgroundStronger },
  transition: 'all ease 200ms',
  tooltipProps: {
    distance: 18,
  },
  iconSize: 14,
  activeStyle: false,
} as const
