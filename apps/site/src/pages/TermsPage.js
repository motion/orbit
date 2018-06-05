import { Header, Footer, PostTemplate } from '~/components'
import { P2, Section } from '~/views'
import SectionContent from '~/views/sectionContent'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

const text = `These Website Standard Terms And Conditions (these “Terms” or these “Website Standard Terms And Conditions”) contained herein on this webpage, shall govern your use of this website, including all pages within this website (collectively referred to herein below as this “Website”). These Terms apply in full force and effect to your use of this Website and by using this Website, you expressly accept all terms and conditions contained herein in full. You must not use this Website, if you have any objection to any of these Website Standard Terms And Conditions.

This Website is not for use by any minors (defined as those who are not at least 18 years of age), and you must not use this Website if you a minor.

## Intellectual Property Rights.

Other than content you own, which you may have opted to include on this Website, under these Terms, Orbit and/or its licensors own all rights to the intellectual property and material contained in this Website, and all such rights are reserved.

You are granted a limited license only, subject to the restrictions provided in these Terms, for purposes of viewing the material contained on this Website,

PandaTip: If the website is only for viewing, then you might be able to stop where we left off above. That said, you will likely need to provide more in the way of descriptive language around what users may use the website to do/for.

## Restrictions.

You are expressly and emphatically restricted from all of the following:

publishing any Website material in any media;

selling, sublicensing and/or otherwise commercializing any Website material;

publicly performing and/or showing any Website material;

using this Website in any way that is, or may be, damaging to this Website;

using this Website in any way that impacts user access to this Website;

using this Website contrary to applicable laws and regulations, or in a way that causes, or may cause, harm to the Website, or to any person or business entity;

engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website, or while using this Website;

using this Website to engage in any advertising or marketing;

Certain areas of this Website are restricted from access by you and Orbit may further restrict access by you to any areas of this Website, at any time, in its sole and absolute discretion.  Any user ID and password you may have for this Website are confidential and you must maintain confidentiality of such information.

## Your Content.

In these Website Standard Terms And Conditions, “Your Content” shall mean any audio, video, text, images or other material you choose to display on this Website. With respect to Your Content, by displaying it, you grant Orbit a non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.

Your Content must be your own and must not be infringing on any third party’s rights. Orbit reserves the right to remove any of Your Content from this Website at any time, and for any reason, without notice.

## No warranties.

This Website is provided “as is,” with all faults, and Orbit makes no express or implied representations or warranties, of any kind related to this Website or the materials contained on this Website. Additionally, nothing contained on this Website shall be construed as providing consult or advice to you.

Limitation of liability.

In no event shall Orbit, nor any of its officers, directors and employees, be liable to you for anything arising out of or in any way connected with your use of this Website, whether such liability is under contract, tort or otherwise, and Orbit, including its officers, directors and employees shall not be liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.

## Indemnification.

You hereby indemnify to the fullest extent Orbit from and against any and all liabilities, costs, demands, causes of action, damages and expenses (including reasonable attorney’s fees) arising out of or in any way related to your breach of any of the provisions of these Terms.

## Severability.

If any provision of these Terms is found to be unenforceable or invalid under any applicable law, such unenforceability or invalidity shall not render these Terms unenforceable or invalid as a whole, and such provisions shall be deleted without affecting the remaining provisions herein.

## Variation of Terms.

Orbit is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review such Terms on a regular basis to ensure you understand all terms and conditions governing use of this Website.

## Assignment.

Orbit shall be permitted to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification or consent required. However, .you shall not be permitted to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.

## Entire Agreement.

These Terms, including any legal notices and disclaimers contained on this Website, constitute the entire agreement between Orbit and you in relation to your use of this Website, and supersede all prior agreements and understandings with respect to the same.

## Governing Law & Jurisdiction.

These Terms will be governed by and construed in accordance with the laws of the State of California, and you submit to the non-exclusive jurisdiction of the state and federal courts located in California for the resolution of any disputes.`

@view.ui
export class TermsPage extends React.Component {
  render() {
    return (
      <page $$flex $$background={Constants.blueTheme.background}>
        <UI.Theme theme={Constants.blueTheme}>
          <Header />
          <Section>
            <SectionContent padded>
              <PostTemplate
                title="Terms of Use"
                paragraphs={text
                  .split('\n\n')
                  .map((paragraph, i) => <P2 key={i}>{paragraph}</P2>)}
              />
            </SectionContent>
          </Section>
          <Footer noMission />
        </UI.Theme>
      </page>
    )
  }
}
