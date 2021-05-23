import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  // return the headers to the context so httpLink can read them
  console.log(token);
  return {
    headers: {
      ...headers,
      Authorization: token ? `bearer  ${token}` : "",
      Accept: "application/vnd.github.v4.idl",
    },
  };
});
const graphClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default graphClient;
