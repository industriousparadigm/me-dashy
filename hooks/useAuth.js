import useSWR from "swr";

function fetcher(route) {
  /* our token cookie gets sent with this request */
  return fetch(route)
    .then((res) => res.ok && res.json())
    .then((user) => user || null);
}

export default function useAuth() {
  const { data: user, error } = useSWR("/api/user", fetcher);

  const loading = user === undefined;

  return {
    user,
    loading,
    error,
  };
}
