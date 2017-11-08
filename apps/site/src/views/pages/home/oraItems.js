import * as React from 'react'
import SidebarTitle from './sidebarTitle2'

export default {
  0: [
    {
      children: (
        <SidebarTitle title="Hi, I'm Ora" icon="objects_planet" noBack />
      ),
      glow: false,
    },
    {
      primary: `I live on your desktop`,
      children: `Scroll down to see me in action!`,
      icon: 'tech_desktop',
    },
    {
      // primary: 'How I work',
      primary: 'On the desktop?',
      children: `I don't need any internet or cloud to run, I just sync the stuff your company
      gives you permission to locally.`,
      icon: '2_menu-dots',
    },
    {
      primary: 'I have so many questions',
      children: `Scroll down and I'll do my best!`,
      icon: 'help',
    },
  ],
  1: [
    {
      children: (
        <SidebarTitle
          title="Hands-free Intelligence"
          subtitle="An assistant that's always there, not hidden in a tab or bot"
          icon="think"
          noBack
        />
      ),
    },
    {
      primary: 'Integrations',
      children:
        'Not just your knowledgebase or wiki, but your docs, Slack conversations, and more.',
      icon: 'social-slack',
      category: 'Results',
    },
    {
      primary: 'Contextual',
      children: `With a keystroke you can see whats relevant to whatever you're currently doing, whether writing an email, document, or having a conversation.`,
      icon: 'brain',
      category: 'Results',
    },
  ],
  2: [
    {
      children: (
        <SidebarTitle
          title="The No-Cloud Infrastructur"
          subtitle="In order to work, Orbit needed to invent a new model"
          icon="think"
          noBack
        />
      ),
    },
    {
      primary: 'Uses your Permissions',
      children:
        'Orbit authenticates using your personal permissions, so it never can expose the wrong thing.',
      icon: 'lock',
      category: 'Results',
    },
    {
      primary: 'Not on premise',
      children:
        'Orbit runs securely on your device, without sending any data outside your computer.',
      icon: 'lock',
      category: 'Results',
    },
  ],
}
