export const idlFactory = ({ IDL }) => {
  const Hub = IDL.Record({
    'id' : IDL.Text,
    'contact' : IDL.Text,
    'country' : IDL.Text,
    'name' : IDL.Text,
    'continent' : IDL.Text,
    'description' : IDL.Text,
    'website' : IDL.Text,
    'location' : IDL.Text,
  });
  return IDL.Service({
    'getAllContinents' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getHubsByContinent' : IDL.Func([IDL.Text], [IDL.Vec(Hub)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
