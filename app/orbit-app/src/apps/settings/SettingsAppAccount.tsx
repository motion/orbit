import { Button, Input, Message, Section, SegmentedRow, Space, Theme, Title } from '@o/ui'
import React, { useEffect, useState } from 'react'
import * as firebase from 'firebase'
import { loadMany, useModel } from '@o/bridge'
import { SpaceModel, UserModel } from '@o/models'

export default function SettingsAppAccount() {
  const [email, setEmail] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [user, updateUser] = useModel(UserModel, {})

  const cloudSync = async () => {
    try {
      setIsSyncing(true)
      setStatusMessage('Your account is being syncing...')

      const firestoreSpaces = firebase
        .firestore()
        .doc('/user/' + user.cloudId)

      const cloudSpaces = await firestoreSpaces.get()
      console.log('cloud data', cloudSpaces.data())

      const localSpaces = await loadMany(SpaceModel, { args: {} })
      console.log('local data', { settings: user.settings, spaces: localSpaces })

      await firestoreSpaces.set({
        settings: user.settings,
        spaces: localSpaces
      })

      // update email in the database
      updateUser({
        ...user,
        lastTimeSync: new Date().getTime()
      })

      setIsSyncing(false)

    } catch (err) {
      setStatusMessage('Error during cloud syncing')
      console.error(err)
    }
  }

  const logout = () => {
    setStatusMessage('Logging out...')

    firebase
      .auth()
      .signOut()
      .then(() => {
        updateUser({
          ...user,
          email: null,
          cloudId: null,
          lastTimeSync: null
        })
      })
      .catch(err => {
        setStatusMessage('Error during logging out')
        console.error(err)
      });
  }

  // for the first-ever time we run sync instantly
  useEffect(() => {
    if (user && !user.lastTimeSync) {
      cloudSync()
    }
  }, [user ? user.cloudId : null])

  const sendEmail = () => {
    firebase
      .auth()
      .sendSignInLinkToEmail(email, {
        url: 'https://orbitauth.com/authorize',
        handleCodeInApp: true,
      })
      .then(async () => {

        // update email in the database
        updateUser({ ...user, email })

        setStatusMessage(`Email with further instructions has been sent to ${email}.`)
      })
      .catch(error => {
        setStatusMessage('Error: ' + error.message)
        console.log(error)
      })
  }

  return (
    <Section sizePadding={2}>
      <Title>My Account</Title>

      <Message>
        { statusMessage }
      </Message>

      { user && user.email && <div>

        { isSyncing === false && user && user.lastTimeSync && <div>

          <Message>
            You account was synced last time on { new Date(user.lastTimeSync).toString() }.
            <Button onClick={cloudSync}>Sync now</Button>
          </Message>

        </div> }

        <Button onClick={logout}>Logout</Button>

      </div> }

      { user && !user.email && <div>

        <Message>
          Orbit syncs your configuration including which spaces you are a member of, and your personal
          preferences, so you can use Orbit on different computers.
        </Message>

        <Space />

        <Section>
          <SegmentedRow size={1.5}>
            <Input
              type="email"
              flex={1}
              placeholder="address@example.com"
              value={email}
              onChange={event => setEmail((event.target as any).value)}
            />
            <Theme name="selected">
              <Button onClick={sendEmail}>Send Login Link</Button>
            </Theme>
          </SegmentedRow>
        </Section>
      </div> }

    </Section>
  )
}
