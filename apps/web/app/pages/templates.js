import React from 'react'
import { view } from '@jot/black'
import { Template } from '@jot/models'
import { Button } from '~/ui'
import Page from '~/page'

class TemplateStore {
  templates = Template.all()

  createTemplate = async () => {
    console.log('new template')
    const next = {
      name: prompt('title?'),
      content: {},
    }

    await Template.create(next)
  }

  editTemplate = (_id, value) => {
    const template = this.templates.filter(t => t._id === _id)[0]
    template.content = JSON.parse(value)
    template.save()
  }
}

@view({
  store: TemplateStore,
})
export default class Templates {
  render({ store }) {
    return (
      <Page
        header
        $$padded
        title="Templates"
        actions={[
          <Button icon="simple-add" onClick={store.createTemplate}>
            new template
          </Button>,
        ]}
      >
        <h2>Templates</h2>
        <templates>
          {(store.templates || []).map(template =>
            <template>
              <h4>{template.name}</h4>
              <input
                defaultValue={JSON.stringify(template.content)}
                onBlur={e => store.editTemplate(template._id, e.target.value)}
              />
            </template>
          )}
        </templates>
      </Page>
    )
  }

  static style = {
    templates: {
      marginTop: 20,
    },
  }
}
