import { Space } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { Header } from '../Header'
import { ContentSection } from '../views/ContentSection'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import PrivacyPageContent from './PrivacyPage.mdx'

export default mount({
  '/': route({
    title: 'Privacy',
    view: <PrivacyPage />,
  }),
})

export function PrivacyPage() {
  return (
    <MDX>
      <Header slim />
      <SectionContent>
        <Space size="xxl" />
        <ContentSection>
          <main>
            <PrivacyPageContent />
          </main>
        </ContentSection>
      </SectionContent>
      <BlogFooter />
    </MDX>
  )
}

PrivacyPage.theme = 'light'
