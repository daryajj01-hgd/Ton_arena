type TelegramAuthResponse = {
  ok: true;
  session: { token: string; expiresAt: string };
};

type PlayerResponse = {
  ok: true;
  player: {
    id: string;
    telegramId: string;
    firstName: string | null;
    username: string | null;
  };
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

async function apiRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API_REQUEST_FAILED_${response.status}`);
  }
  return await response.json() as T;
}

export async function authenticateTelegram(initData: string): Promise<TelegramAuthResponse> {
  return apiRequest<TelegramAuthResponse>("/api/auth/telegram", {
    method: "POST",
    body: JSON.stringify({ initData })
  });
}

export async function getCurrentPlayer(sessionToken: string): Promise<PlayerResponse> {
  return apiRequest<PlayerResponse>("/api/me", {
    method: "GET",
    headers: { authorization: `Bearer ${sessionToken}` }
  });
}
