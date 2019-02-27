NEXT

- PersonBit/Person => Bit.type "person"
- Move syncers into @mcro/apps, inside AppDefinition
- types: models/entities dont have required types, can we make that enforced?
  - AppBit should have required types: identifier, spaceId, name
- bugfix: if you rm sqlite database, then startup, it gives a sql error first time
- Turn on strict null checks in TS and fix so we can use it going forward
