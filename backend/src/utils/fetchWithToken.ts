export async function fetchWithToken(
  url: string,
  token: string,
  options: RequestInit = {}
) {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`, // Lägg till Authorization-headern med JWT
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Failed to fetch";
    throw new Error(errorMessage);
  }

  return await response.json();
}
