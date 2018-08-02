export interface Job {

  /**
   * Target type.
   */
  target: "job"

  id: number
  type: string
  lastError: string
  status: string
  tries: number
  percent: number
  createdAt: Date
  updatedAt: Date
  lock: string

}

