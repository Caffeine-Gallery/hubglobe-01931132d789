export const idlFactory = ({ IDL }) => {
  const Hub = IDL.Record({
    'id' : IDL.Text,
    'contact' : IDL.Text,
    'name' : IDL.Text,
    'continent' : IDL.Text,
    'description' : IDL.Text,
    'website' : IDL.Text,
    'location' : IDL.Text,
  });
  const NewsArticle = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'date' : IDL.Int,
    'continent' : IDL.Text,
  });
  return IDL.Service({
    'getAllContinents' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getHubsByContinent' : IDL.Func([IDL.Text], [IDL.Vec(Hub)], ['query']),
    'getNewsByContinent' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(NewsArticle)],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
