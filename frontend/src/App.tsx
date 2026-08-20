import { useGetHealthQuery } from './app/api';

function App() {
  const { data, isLoading, error } = useGetHealthQuery();

  if (isLoading) return <p>Checking API...</p>;
  if (error) return <p>API error — is the backend running?</p>;

  return <p>API status: {data?.status}</p>;
}

export default App;