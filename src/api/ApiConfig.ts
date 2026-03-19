/**
 * The base url of the GPA API.
 */
export const API_BASE_URL = 'http://localhost:5126/api/gpa';

/**
 * A generic utility function for making POST requests to the backend API.
 * It automatically handles JSON serialization, standard headers, and basic error checking.
 * @template TResponse - The expected TypeScript interface/type of the returned JSON data.
 * @param endpoint - The specific route to append to the base URL.
 * @param payload - The data object to be sent in the request body.
 * @returns {Promise<TResponse>} A promise that resolves to the strongly-typed response from the server.
 * @throws {Error} Will throw an error if the network response is not "ok".
 */
export const callApi = async <TResponse>(endpoint: string, payload: any): Promise<TResponse> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};
