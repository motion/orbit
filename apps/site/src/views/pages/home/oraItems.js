import * as React from 'react'
import SidebarTitle from './sidebarTitle2'

export default {
  'example-1': [
    {
      children: (
        <SidebarTitle title="Slack with @nick" icon="social-slack" noBack />
      ),
      glow: false,
    },
    {
      category: 'Results',
      primary: 'Product Page Add to Cart Bug',
      icon: 'issue',
      children: `We noticed if you hold down for more than 300ms on the button, it won't always
      add to cart, but it will...`,
    },
  ],

  'example-2': [
    {
      children: (
        <SidebarTitle title={`1on1 on Fossa Sales`} icon="mail" noBack />
      ),
      glow: false,
    },
    {
      category: 'Results',
      primary: 'Fossa Sales',
      date: Date.now() - 10000,
      icon: 'google',
      children: `...we ended up coming just short of our Q4 goals, which we had set aggresively...`,
    },
  ],

  'example-3': [
    {
      children: (
        <SidebarTitle
          title={`Event: Product Page Planning 12/17`}
          icon="calendar"
          noBack
        />
      ),
      glow: false,
    },
    {
      category: 'Results',
      primary: 'Plans for December',
      date: Date.now() - 1000,
      icon: 'dropbox',
      children: `...we ended up coming just short of our Q4 goals, which we had set aggresively...`,
    },
  ],

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
