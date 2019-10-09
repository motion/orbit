import { CardProps, Icon, Stack, TiltCard } from '@o/ui'
import * as React from 'react'

const FeatureCard = (props: CardProps) => (
  <TiltCard
    size="xl"
    titlePadding="md"
    titleProps={{
      size: 'md',
    }}
    cursor="pointer"
    tagName="a"
    textDecoration="none"
    elevation={1}
    {...props}
  />
)

export function DocsFeatureCard({
  title,
  subTitle,
  icon,
  color,
  background,
  ...rest
}: { title: string; subTitle: string; icon: any } & CardProps) {
  return (
    <FeatureCard subTitle={subTitle} title={title} {...rest}>
      <Stack
        minHeight={150}
        background={background}
        alignItems="center"
        justifyContent="center"
        padding
        flex={1}
      >
        <Icon color={color} size={52} name={icon} />
      </Stack>
    </FeatureCard>
  )
}
