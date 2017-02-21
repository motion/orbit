import { view } from 'my-decorators'
import { Title, Page } from 'my-views'

@view
export default class Home {
  render() {
    return (
      <Page>
        <Title>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi, amet pariatur in qui optio dicta nam ex obcaecati esse dolore veniam rerum reiciendis, ullam dolorum quo incidunt eius magnam veritatis.
        </Title>
        <content>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut perspiciatis id, assumenda nisi. Explicabo amet asperiores, at, natus iusto optio ipsam. Soluta animi hic, obcaecati voluptatem deleniti et maxime accusantium.
        </content>
      </Page>
    )
  }
}
