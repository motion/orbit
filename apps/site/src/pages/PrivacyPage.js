import { Header, Footer, PostTemplate } from '~/components'
import { Section } from '~/views'
import SectionContent from '~/views/sectionContent'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

const text = `This privacy notice discloses the privacy practices for tryorbit.com. This privacy notice applies solely to information collected by this website. It will notify you of the following:

1. What personally identifiable information is collected from you through the website, how it is used and with whom it may be shared.
2. What choices are available to you regarding the use of your data.
3. The security procedures in place to protect the misuse of your information.
4. How you can correct any inaccuracies in the information.

## Information Collection, Use, and Sharing
We are the sole owners of the information collected on this site. We only have access to/collect information that you voluntarily give us via email or other direct contact from you. We will not sell or rent this information to anyone.

We will use your information to respond to you, regarding the reason you contacted us. We will not share your information with any third party outside of our organization, other than as necessary to fulfill your request, e.g. to ship an order.

Unless you ask us not to, we may contact you via email in the future to tell you about specials, new products or services, or changes to this privacy policy.

## Your Access to and Control Over Information
You may opt out of any future contacts from us at any time. You can do the following at any time by contacting us via the email address or phone number given on our website:

- See what data we have about you, if any.
- Change/correct any data we have about you.
- Have us delete any data we have about you.
- Express any concern you have about our use of your data.

## Security
We take precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline.

Wherever we collect sensitive information (such as credit card data), that information is encrypted and transmitted to us in a secure way. You can verify this by looking for a lock icon in the address bar and looking for "https" at the beginning of the address of the Web page.

While we use encryption to protect sensitive information transmitted online, we also protect your information offline. Only employees who need the information to perform a specific job (for example, billing or customer service) are granted access to personally identifiable information. The computers/servers in which we store personally identifiable information are kept in a secure environment.

If you feel that we are not abiding by this privacy policy, you should contact us immediately via via email at hello@tryorbit.com.

We use "cookies" on this site. A cookie is a piece of data stored on a site visitor's hard drive to help us improve your access to our site and identify repeat visitors to our site. For instance, when we use a cookie to identify you, you would not have to log in a password more than once, thereby saving time while on our site. Cookies can also enable us to track and target the interests of our users to enhance the experience on our site. Usage of a cookie is in no way linked to any personally identifiable information on our site.`

@view.ui
export class PrivacyPage extends React.Component {
  render() {
    return (
      <page $$flex $$background={Constants.blueTheme.background}>
        <UI.Theme theme={Constants.blueTheme}>
          <Header />
          <Section>
            <SectionContent padded>
              <PostTemplate title="Privacy Policy" body={text} />
            </SectionContent>
          </Section>
          <Footer noMission />
        </UI.Theme>
      </page>
    )
  }
}
