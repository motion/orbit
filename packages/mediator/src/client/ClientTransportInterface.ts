
export interface ClientTransportInterface {

  execute(value: any): Promise<any>;

}