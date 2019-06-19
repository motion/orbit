import { Space } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { Header } from '../Header'
import { ContentSection } from '../views/ContentSection'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import FAQPageContent from './FAQPage.mdx'

export default mount({
  '/': route({
    title: 'FAQ',
    view: <FAQPage />,
  }),
})

export function FAQPage() {
  return (
    <MDX>
      <Header slim />
      <SectionContent>
        <Space size="xxl" />
        <ContentSection>
          <main>
            <FAQPageContent />
          </main>
        </ContentSection>
      </SectionContent>
      <BlogFooter />
    </MDX>
  )
}

FAQPage.theme = 'light'
