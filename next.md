highest level things required for beta:

  - integrations:
      - github
      - google docs
      - jira
      - calendar (google + others?)
  - teams:
    - onboarding process
    - figuring who is who across integrations
    - feeds on a person-basis
  - search:
    - filter algo
      - enforce never show same result twice (hashlike)
    - potentially filter by source
    - combine multiple topics into feeds
  - quick actions:
    - jira/github cards w actions
  - orbits:
    - some test of sharing to team orbit

maybe:

  - notifications
    - if we have apps that have feeds, may want notifications


-fast pouch
  - https://github.com/pouchdb-community/socket-pouch (web sockets)
  - https://github.com/jkleinsc/telegraph (web workers)


### technical downsides

- cant use docker-compose offline due to HOST_IP problem
- cant use flow due to variety of problems
