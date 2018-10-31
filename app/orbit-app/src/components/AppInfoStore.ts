import { BitModel, SourceModel, JobModel, Source } from '@mcro/models'
import { observeCount, observeOne } from '@mcro/model-bridge'

export type AppInfoProps = {
  sourceId?: number
  model?: Source
  source?: Source
}

export class AppInfoStore {
  props: AppInfoProps

  get sourceId() {
    return +(this.props.model || this.props.source || { id: null }).id || this.props.sourceId
  }

  bitsCount = 0
  private bitsCounts$ = observeCount(BitModel, {
    args: {
      sourceId: this.sourceId,
    },
  }).subscribe(value => {
    this.bitsCount = value
  })

  source: Source = null
  private source$ = observeOne(SourceModel, {
    args: {
      where: {
        id: this.sourceId,
      },
    },
  }).subscribe(value => {
    this.source = value
  })

  job = null
  private job$ = observeOne(JobModel, {
    args: {
      where: { sourceId: this.sourceId },
      order: { id: 'DESC' },
    },
  }).subscribe(value => {
    this.job = value
  })

  willUnmount() {
    this.bitsCounts$.unsubscribe()
    this.source$.unsubscribe()
    this.job$.unsubscribe()
  }
}
