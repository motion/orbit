import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from './pane'

const issueActions = [
    'Comment',
    'Archive',
    'Milestone',
    'Label',
    'Set Assignee',
]

const branchActions = ['Copy Link', 'View']
const actions = {
    issueComment: issueActions,
    issueCreate: issueActions,
    branchMerge: branchActions,
    branchMake: branchActions,
}

const events = [
    {
        name: 'created branch replace-docker',
        when: '3 days ago',
        type: 'branchMake',
    },
    {
        name: 'merged branch replace-docker',
        when: '2 days ago',
        type: 'branchMerge',
    },
    {
        name: 'created issue "cannot tab between panes"',
        when: '4 days ago',
        type: 'issueCreate',
    },
    {
        name: 'commented on "use version of React on Dan\'s computer"',
        when: '5 days ago',
        type: 'issueComment',
    },
    {
        name: 'commented on "work on mac"',
        when: '6 days ago',
        type: 'issueComment',
    },
    {
        name: 'commented on "work on mac"',
        when: '6 days ago',
        type: 'issueComment',
    },
    {
        name: 'commented on "work on mac"',
        when: '6 days ago',
        type: 'issueComment',
    },
    {
        name: 'commented on "work on mac"',
        when: '6 days ago',
        type: 'issueComment',
    },
    {
        name: 'commented on "work on mac"',
        when: '6 days ago',
        type: 'issueComment',
    },
    {
        name: 'commented on "work on mac"',
        when: '6 days ago',
        type: 'issueComment',
    },
    {
        name: 'commented on "work on mac"',
        when: '6 days ago',
        type: 'issueComment',
    },
    {
        name: 'commented on "work on mac"',
        when: '6 days ago',
        type: 'issueComment',
    },
].map(event => ({ ...event, actions: actions[event.type], showChild: false }))

@view
class BarContents {
    render() {
        return (
            <contents $$row>
                <UI.Icon size={20} name="person" />
                <label>Nate</label>
                <arrow>→</arrow>
                <label>Feed</label>
            </contents>
        )
    }

    static style = {
        contents: {
            alignItems: 'center',
            color: '#eee',
        },
        arrow: {
            fontSize: 20,
        },
        label: {
            marginLeft: 10,
            marginRight: 10,
            fontWeight: 600,
            fontSize: 18,
        },
    }
}

class TestPageStore {
    children = null
    results = events
    barContents = <BarContents />

    start() {
        this.props.getRef(this)
    }
}
@view.provide({ store: TestPageStore, paneStore: Pane.Store })
export default class Message {
    render({ data, isActive, onSelect }) {
        return (
            <Pane.Card light isActive={isActive} icon={data.icon}>
                <UI.Theme name="light">
                    <container>
                        <top $$row>
                            <left $$row>
                                <img $avatar src={`/images/${'me'}.jpg`} />
                                <h3>Nate Weinert</h3>
                            </left>
                            <Pane.Actions id="paneActions" actions={['new']} />
                        </top>
                        {false && <figma $$undraggable>
                            <iframe height={500} seamless src="https://www.figma.com/file/NoOi8acSNhO29VLMe790Ut?embed_host=dropbox-paper&viewer=1" />
                        </figma>}
                        <UI.List items={events} getItem={(event, index) =>
                            <Pane.Selectable
                                options={{ ...event, id: `select${index}`, index }}
                                render={(isActive, actions) =>
                                    <UI.ListItem
                                        onClick={() => onSelect(index)}
                                        highlight={isActive}
                                        key={event.id}
                                        primary={event.name}
                                        secondary={<container>
                                            {actions}
                                        </container>}
                                    />
                                } />
                        }
                        /></container>
                </UI.Theme>
            </Pane.Card>
        )
    }

    static style = {
        container: {},
        top: {
            justifyContent: 'space-between',
            margin: 10,
        },
        iframe: {
            border: '0px solid black',
        },
        left: {
            alignItems: 'center',
        },
        avatar: {
            width: 30,
            height: 30,
            borderRadius: 30,
        },
        h3: {
            marginLeft: 10,
        },
    }
}
