---
title: Releases
---

<br />

## Alpha 1

[Download](https://orbitauth.com/download)

This is the first alpha, so obligatory tadas: 🎉🎉🎉.

There's no way around the fact that this will likely break. We've only tested it in limited scenarios, so you are helping us more than we are giving you anything. Thank you.

With that in mind, I've enabled some light analytics for the insider releases. We aren't sending or tracking any private data, and you can firewall it, but it should save a lot of time. Orbit will send just crash reports error stacks and very high level metadata.

### A note on security

This build passes your Oauth keys through a server of ours, just to hand them back to your computer. We don't store or log them anywhere.

Normally we'd be running a local proxy to capture them entirely on your computer, but Google required https and that would require a heavy onboard process to do simply. We have a plan to fix it, but for now a light serverless function secured with SSL/LetsEncrypt passes your keys back to your computer.

### Release notes

#### Features

- Apps included: Slack, Gmail, GDrive, Github, Jira, Confluence.
- Orbit Home with keyboard nav, topic search.
- Search with natural language by people, date, integration, time.
- Person directory works in minimal form.
- Use **`⌘+,`** or the Orbit icon in Tray to access some settings.

#### Known Bugs

- Clicking between certain items within the peek window doesn't work.
- Slack says "not authorized", still works but is confusing for now.
- Topic modeling "invert" bug, can return least relevant words rather than most.
- Resizing screens, moving screens, moving spaces can glitch.
- Syncers still need some work to throttle, sync in chunks.
- Date and people filtering can get tripped up.
- Syncs too many people that aren't necessary.

<br />
