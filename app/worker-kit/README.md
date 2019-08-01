# Orbit Sync Kit


### Syncers

Has some helpers for sync style workers

You can manually stop/run any syncers using REPL.

To start any syncer you can use following command:

```
await Syncers.[SyncerName].start()
```

To stop any syncer you can use following command:

```
await Syncers.[SyncerName].stop()
```

To reset any syncer you can use following command:

```
await Syncers.[SyncerName].reset()
```

To apply same operations on multiple syncers you can use following pattern:

```got an error but may not be worth reporting
await Promise.all(Object.keys(Syncers).map(syncer => Syncers[syncer].start()))
```
