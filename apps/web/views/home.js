import { view } from 'my-decorators'
import { Title, Text, Page } from 'my-views'

@view
export default class Home {
  render() {
    return (
      <Page>
        <Title>
          "One philosopher who Bannon seems to have an affinity for is Julius Evola"
          <sub>
            2017 &middot; NYTimes
          </sub>
        </Title>

        <claim>
          <Title size="20">
            The claim:
          </Title>
          <Text>
            <a>Stephen Bannon</a> <underline>has an affinity</underline> for <a>Julius Evola</a>
          </Text>
        </claim>

        <content>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut perspiciatis id, assumenda nisi. Explicabo amet asperiores, at, natus iusto optio ipsam. Soluta animi hic, obcaecati voluptatem deleniti et maxime accusantium.
        </content>
      </Page>
    )
  }

  static style = {
    sub: {
      textAlign: 'right',
      fontSize: 20,
      opacity: 0.5,
    }
  }
}
