import { RepositoryOperationType } from './Repository'

export interface Provider {
  execute(
    entity: string,
    operation: RepositoryOperationType,
    parameters: any[] = [],
  ): Promise<void>
}
