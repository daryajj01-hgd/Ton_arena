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

const API_BASE_URL = ((import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

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

export type BrainSprintGame = {
  sessionId: string;
  questionOrder: number[];
  expiresAt: string;
};

export async function startBrainSprint(sessionToken: string): Promise<{ ok: true; game: BrainSprintGame }> {
  return apiRequest<{ ok: true; game: BrainSprintGame }>("/api/games/brain-sprint/start", {
    method: "POST",
    headers: { authorization: `Bearer ${sessionToken}` },
    body: JSON.stringify({})
  });
}

export type BrainSprintAnswer = {
  status: "accepted";
  isCorrect: boolean;
  correctAnswerIndex: number;
  score: number;
  answeredQuestionIndex: number;
  completed: boolean;
  nextQuestionIndex: number;
};

export async function submitBrainSprintAnswer(
  sessionToken: string,
  sessionId: string,
  answerIndex: number
): Promise<{ ok: true; result: BrainSprintAnswer }> {
  return apiRequest<{ ok: true; result: BrainSprintAnswer }>(
    `/api/games/brain-sprint/${sessionId}/answer`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${sessionToken}` },
      body: JSON.stringify({ answerIndex })
    }
  );
}
