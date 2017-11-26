import * as React from 'react'
import * as UI from '@mcro/ui'
import { Section, SectionContent, Title, Link, Logo } from '~/views'

const iconProps = {
  color: '#fff',
  size: 40,
}

const colProps = {
  css: {
    minHeight: 200,
    flex: 1,
    padding: [0, 50, 0, 0],
    justifyContent: 'space-between',
  },
}

export default () => (
  <UI.Theme name="dark">
    <footer>
      <Section css={{ background: '#000' }} padded>
        <SectionContent>
          <content $$row>
            <column
              {...colProps}
              css={{ ...colProps.css, flex: 1.5, paddingRight: 80 }}
            >
              <Logo css={{ marginBottom: 50 }} />

              <row $$row $$flex $$justify="space-between">
                <UI.Icon name="twitter" {...iconProps} />
                <UI.Icon name="linkedin" {...iconProps} />
                <UI.Icon name="facebook" {...iconProps} />
                <UI.Icon name="github" {...iconProps} />
              </row>
            </column>

            <column {...colProps}>
              <Title>Contact</Title>
              <Link>team@tryorbit.com</Link>
              <Link>Phone +1 (520) 999-5555</Link>
              <Link>Press kit</Link>
            </column>

            <column {...colProps}>
              <Title>Orbit</Title>
              <Link>About us</Link>
              <Link>Pricing</Link>
              <Link>For Sales</Link>
              <Link>For Support</Link>
              <Link>Press kit</Link>
            </column>
          </content>
        </SectionContent>
      </Section>
    </footer>
  </UI.Theme>
)
