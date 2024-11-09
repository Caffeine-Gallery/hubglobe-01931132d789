import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Hub {
  'id' : string,
  'contact' : string,
  'country' : string,
  'name' : string,
  'continent' : string,
  'description' : string,
  'website' : string,
  'location' : string,
}
export interface _SERVICE {
  'getAllContinents' : ActorMethod<[], Array<string>>,
  'getHubsByContinent' : ActorMethod<[string], Array<Hub>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
