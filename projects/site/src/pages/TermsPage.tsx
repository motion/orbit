import { Space } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { Header } from '../Header'
import { ContentSection } from '../views/ContentSection'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import TermsPageContent from './TermsPage.mdx'

export default mount({
  '/': route({
    title: 'Terms',
    view: <TermsPage />,
  }),
})

export function TermsPage() {
  return (
    <MDX>
      <Header slim />
      <SectionContent>
        <Space size="xxl" />
        <ContentSection>
          <main>
            <TermsPageContent />
          </main>
        </ContentSection>
      </SectionContent>
      <BlogFooter />
    </MDX>
  )
}

TermsPage.theme = 'light'
