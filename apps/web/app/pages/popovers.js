import React from 'react'
import { view } from '~/helpers'
import { Form, Input, Segment, Button, Popover } from '~/ui'
import { Place } from '@jot/models'

@view
export default class PopoversTest extends React.Component {
  state = {
    places: null,
  }

  componentDidMount() {
    Place.all().$.subscribe(places => {
      console.log('got places', places)
      this.setState({ places })
    })
  }

  render() {
    // return null
    return (
      <page>
        <section $rxdb if={false}>
          {this.state.places &&
            this.state.places.map((place, index) => (
              <place key={index}>{place.title}</place>
            ))}
        </section>

        <section $popovers if={true}>
          <Form>
            <Segment>
              <Button />
            </Segment>
          </Form>

          <br />
          <br />
          <br />
          <br />
          <br />

          <Segment>
            <Button
              tooltip="left"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                towards: 'left',
              }}
            >
              left
            </Button>
            <Button
              tooltip="top"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                towards: 'top',
              }}
            >
              top
            </Button>
            <Button
              tooltip="bottom"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                towards: 'bottom',
              }}
            >
              bottom
            </Button>
            <Button
              tooltip="right"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                towards: 'right',
              }}
            >
              right
            </Button>
          </Segment>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          forgiveness = 50
          <Segment>
            <Button
              tooltip="left"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                forgiveness: 50,
                towards: 'left',
              }}
            >
              left
            </Button>
            <Button
              tooltip="top"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                forgiveness: 50,
                towards: 'top',
              }}
            >
              top
            </Button>
            <Button
              tooltip="bottom"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                forgiveness: 50,
                towards: 'bottom',
              }}
            >
              bottom
            </Button>
            <Button
              tooltip="right"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                forgiveness: 50,
                towards: 'right',
              }}
            >
              right
            </Button>
          </Segment>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          <Segment>
            <Button
              tooltip="left"
              tooltipProps={{
                openOnHover: true,
                showForgiveness: true,
                forgiveness: 50,
                towards: 'left',
              }}
            >
              left
            </Button>
            <Button
              tooltip="top"
              tooltipProps={{
                openOnHover: true,
                showForgiveness: true,
                forgiveness: 50,
                towards: 'top',
              }}
            >
              top
            </Button>
            <Button
              tooltip="bottom"
              tooltipProps={{
                openOnHover: true,
                showForgiveness: true,
                forgiveness: 50,
                towards: 'bottom',
              }}
            >
              bottom
            </Button>
            <Button
              tooltip="right"
              tooltipProps={{
                openOnHover: true,
                showForgiveness: true,
                forgiveness: 50,
                towards: 'right',
              }}
            >
              right
            </Button>
          </Segment>


          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          forgiveness = 100
          distance = 25
          <Segment>
            <Button
              tooltip="left"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                forgiveness: 100,
                distance: 25,
                towards: 'left',
              }}
            >
              left
            </Button>
            <Button
              tooltip="top"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                forgiveness: 100,
                distance: 25,
                towards: 'top',
              }}
            >
              top
            </Button>
            <Button
              tooltip="bottom"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                forgiveness: 100,
                distance: 25,
                towards: 'bottom',
              }}
            >
              bottom
            </Button>
            <Button
              tooltip="right"
              tooltipProps={{
                open: true,
                showForgiveness: true,
                forgiveness: 100,
                distance: 25,
                towards: 'right',
              }}
            >
              right
            </Button>
          </Segment>

          <Button
            $auto
            tooltip="auto"
            tooltipProps={{
              open: true,
              showForgiveness: true,
              towards: 'auto',
            }}
          >
            auto
          </Button>
          <Button
            $auto
            $top
            tooltip="auto"
            tooltipProps={{
              open: true,
              showForgiveness: true,
              towards: 'auto',
            }}
          >
            auto
          </Button>
        </section>
      </page>
    )
  }

  static style = {
    page: {
      flex: 1,
      padding: 20,
    },
    auto: {
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
    top: {
      bottom: 'auto',
      left: 'auto',
      right: 0,
      top: 0,
    },
  }
}
