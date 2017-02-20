import { view } from 'my-decorators'
import { Title } from 'my-views'

@view
export default class Home {
  render() {
    return (
      <page $$flex>
        <Title>Home</Title>
        <content $$content>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut perspiciatis id, assumenda nisi. Explicabo amet asperiores, at, natus iusto optio ipsam. Soluta animi hic, obcaecati voluptatem deleniti et maxime accusantium.
        </content>
      </page>
    )
  }
}
