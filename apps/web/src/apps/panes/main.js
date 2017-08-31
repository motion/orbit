// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser, Document, Thing } from '~/app'
import { filterItem } from './helpers'
import { OS } from '~/helpers'
import * as Pane from './pane'

import type { PaneProps, PaneResult } from '~/types'

const thingToResult = (thing: Thing): PaneResult => ({
    title: thing.title,
    type: thing.type,
    icon: 'icon',
    data: thing.data,
    category: 'Thing',
})

class BarMainStore {
    props: PaneProps
    topThings = Thing.find({ sort: 'createdAt' })

    start() {
        this.props.getRef(this)
    }

    helper = {
        filter: (x, opts) => filterItem(x || [], this.props.search, opts),
    }
    get things(): Array<PaneResult> {
        console.time('get things()')
        if (!this.topThings) {
            return []
        }
        const filtered = this.helper.filter(this.topThings.map(thingToResult), {
            max: 8,
        })
        console.timeEnd('get things()')
        return filtered
    }
    get browse(): Array<PaneResult> {
        return this.helper.filter([
            {
                title: 'Recent',
                type: 'feed',
                icon: 'radio',
                data: {
                    special: true,
                },
            },
            {
                title: 'Test',
                type: 'test',
                icon: 'radio',
                data: {
                    special: true,
                },
            },
            {
                data: { message: 'assigned' },
                title: 'Assigned to me',
                type: 'message',
                icon: 'check',
            },
            {
                data: { message: 'my team' },
                title: 'My Team',
                category: 'Browse',
                type: 'message',
                url() {
                    return '/?home=true'
                },
                icon: 'objects_planet',
            },
            {
                data: { message: 'from company' },
                title: 'Company',
                category: 'Browse',
                type: 'message',
                url() {
                    return '/?home=true'
                },
                icon: 'objects_planet',
            },
        ])
    }

    get people(): Array<PaneResult> {
        return this.helper.filter([
            {
                title: 'Stephanie',
                type: 'feed',
                data: {
                    image: 'steph',
                },
                category: 'People',
            },
            {
                title: 'Nate',
                type: 'feed',
                data: { image: 'me' },
                category: 'People',
            },
            {
                title: 'Nick',
                type: 'feed',
                data: { image: 'nick' },
                category: 'People',
            },
        ])
    }

    get extras() {
        return this.helper.filter([
            {
                title: 'Settings',
                icon: 'gear',
                type: 'message',
                data: {
                    message: 'Open Settings',
                    icon: 'gear',
                },
                onSelect: () => {
                    OS.send('open-settings')
                },
                category: 'Settings',
            },
        ])
    }

    get all(): Array<PaneResult> {
        return [...this.browse, ...this.things, ...this.people, ...this.extras]
    }

    get results(): Array<PaneResult> {
        if (!CurrentUser.loggedIn) {
            return [{ title: 'Login', type: 'login', static: true }]
        }
        return this.all
    }

    select = (index: number) => {
        this.props.navigate(this.results[index])
    }
    getActions() {
        return ['one', 'two', 'four']
    }
}

@view.provide({ paneStore: Pane.Store })
@view({
    store: BarMainStore,
})
export default class BarMain extends React.Component {
    render({
    store,
        isActive,
        paneProps,
        onSelect,
  }: PaneProps & { store: BarMainStore }) {
        const secondary = item => {
            if (item.data && item.data.service === 'github')
                return (
                    <secondary>
                        <spread $$row>
                            <left>
                                {item.data.comments.length} replies
              </left>
                            <right>
                                {item.data.labels}
                            </right>
                        </spread>
                    </secondary>
                )

            return null
        }

        return (
            <Pane.Card isActive={isActive} width={340} $pane>
                <none if={store.results.length === 0}>No Results</none>
                <UI.List
                    itemProps={paneProps.itemProps}
                    groupKey="category"
                    items={store.results}
                    getItem={(result, index) =>
                        <Pane.Selectable
                            key={index}
                            options={{
                                actions: store.getActions(result),
                                id: result.title,
                                index,
                            }}
                            render={(isActive, actions) =>
                                <UI.ListItem
                                    onClick={() => onSelect(index)}
                                    highlight={isActive}
                                    key={result.id}
                                    icon={
                                        result.data && result.data.image
                                            ? <img $image src={`/images/${result.data.image}.jpg`} />
                                            : result.icon || (result.doc && result.doc.icon)
                                    }
                                    primary={result.title}
                                    secondary={<container>
                                        {secondary(result)}
                                        {actions}
                                    </container>}
                                />
                            }
                        />}
                />
            </Pane.Card>
        )
    }

    static style = {
        none: {
            alignSelf: 'center',
            fontSize: 18,
            color: 'rgba(255,255,255,.5)',
        },
        spread: {
            justifyContent: 'space-between',
        },
        image: {
            width: 20,
            height: 20,
            borderRadius: 1000,
            margin: 'auto',
        },
    }
}
