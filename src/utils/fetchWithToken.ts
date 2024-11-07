export async function fetchWithToken(
  url: string,
  token: string,
  options: RequestInit = {}
) {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorMessage = `HTTP error! status: ${response.status}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error("Invalid JSON response from server");
  }
}
