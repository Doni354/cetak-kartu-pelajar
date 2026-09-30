/**
 * Helper to communicate with Google Apps Script Web App.
 * Automatically handles the 302 redirect to script.googleusercontent.com
 * without leaking headers or failing on redirect.
 */
export async function fetchAppsScript(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const initial = await fetch(url, {
    ...options,
    redirect: "manual",
  });

  if (initial.status >= 300 && initial.status < 400) {
    const location = initial.headers.get("location");
    if (location) {
      return fetch(location);
    }
  }

  return initial;
}
