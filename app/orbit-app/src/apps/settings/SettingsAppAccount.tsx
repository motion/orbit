import { loadMany, remove, save, useModel } from '@o/bridge'
import { Space, SpaceModel, UserModel, UserSettings } from '@o/models'
import { Button, Input, Message, Row, Scale, Section } from '@o/ui'
import * as firebase from 'firebase/app'
import React, { useEffect, useState } from 'react'

export default function SettingsAppAccount() {
  const [email, setEmail] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [user, updateUser] = useModel(UserModel, {})

  const cloudSync = async () => {
    try {
      setIsSyncing(true)
      setStatusMessage('Your account is being syncing...')

      const firestoreSpaces = firebase.firestore().doc('/user/' + user.cloudId)

      // get local data
      const localSettings = user.settings
      const localSpaces = await loadMany(SpaceModel, { args: {} })
      console.log('local data', { localSettings, localSpaces })

      // get cloud data
      const cloudSpacesData = await firestoreSpaces.get()
      let cloudSettings: UserSettings, cloudSpaces: Space[]
      if (cloudSpacesData.exists) {
        let cloudData = cloudSpacesData.data()
        console.log('cloud data', cloudData)
        if (cloudSpacesData) {
          cloudSettings = cloudData.settings
          cloudSpaces = cloudData.spaces
        }
      }

      // determine what data should be synced
      let settings: UserSettings, spaces: Space[]

      // if there is data in the cloud and its a first-time sync
      // we treat cloud data as "source of truth" and override local settings with cloud settings
      console.log(JSON.parse(JSON.stringify(user)))
      if (cloudSettings && cloudSpaces && !user.lastTimeSync) {
        settings = cloudSettings
        spaces = cloudSpaces
      } else {
        // else it means we already synced data with the cloud and local changes must went into the cloud
        settings = localSettings
        spaces = localSpaces
      }

      // firestore's merge strategy shouldn't be applied because
      // if space is removed it should also be removed from the cloud
      console.log('synced settings', { settings, spaces })
      await firestoreSpaces.set({ settings, spaces })

      // update spaces
      const removedSpaces = localSpaces.filter(localSpace => {
        return spaces.some(space => space.id === localSpace.id) === false
      })
      for (let space of removedSpaces) {
        remove(SpaceModel, space)
      }
      for (let space of spaces) {
        save(SpaceModel, space)
      }
      console.log('changes made', { removedSpaces, savedSpaces: spaces })

      // update settings and last synced date in the database
      // todo: we probably also need to update active space too
      updateUser(next => {
        next.settings = settings
        next.lastTimeSync = new Date().getTime()
      })

      setIsSyncing(false)
      setStatusMessage('')
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
        setStatusMessage('Good bye!')
        updateUser(next => {
          next.email = null
          next.cloudId = null
          next.lastTimeSync = null
        })
      })
      .catch(err => {
        setStatusMessage('Error during logging out')
        console.error(err)
      })
  }

  const sendEmail = () => {
    firebase
      .auth()
      .sendSignInLinkToEmail(email, {
        url: 'https://orbitauth.com/authorize',
        handleCodeInApp: true,
      })
      .then(async () => {
        // update email in the database
        updateUser(next => {
          next.email = email
        })
      })
      .catch(error => {
        setStatusMessage('Error: ' + error.message)
        console.log(error)
      })
  }

  // for the first-ever time we run sync instantly
  useEffect(() => {
    if (user && user.cloudId && !user.lastTimeSync) {
      cloudSync()
    }
  }, [user ? user.cloudId : null])

  return (
    <Section pad="xl" margin="xl" bordered title="My Account" space>
      {!!statusMessage && <Message>{statusMessage}</Message>}

      {user && user.email && user.cloudId && (
        <>
          {isSyncing === false && user && user.lastTimeSync && (
            <>
              <Message>
                You account was synced last time on {new Date(user.lastTimeSync).toString()}.
                <Button alt="action" onClick={cloudSync}>
                  Sync now
                </Button>
              </Message>
            </>
          )}

          <Button alt="action" onClick={logout}>
            Logout
          </Button>
        </>
      )}

      {user && !user.cloudId && (
        <>
          <Message>
            Orbit syncs your configuration including which spaces you are a member of, and your
            personal preferences, so you can use Orbit on different computers.
          </Message>

          {user.email && (
            <Message>Email with login link has been sent. Please check your email.</Message>
          )}

          <Scale size={1.2}>
            <Row group>
              <Input
                type="email"
                flex={1}
                placeholder="address@example.com"
                value={email}
                onChange={event => setEmail((event.target as any).value)}
              />
              <Button alt="action" onClick={sendEmail}>
                Send Login Link
              </Button>
            </Row>
          </Scale>
        </>
      )}
    </Section>
  )
}
