const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";
const tokenKey = "joldas-session-token";

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  homeCity: string | null;
  bio: string | null;
  interests: string[];
  preferredDestinations: string[];
  budgetMin: number | null;
  budgetMax: number | null;
}

export interface Trip {
  id: string;
  destination: string;
  region: string | null;
  description: string;
  startsAt: string;
  endsAt: string;
  budgetPerPerson: number;
  maxMembers: number;
  interests: string[];
  hostId: string;
  host?: { profile: { displayName: string } | null };
  memberCount: number;
}

export interface ItineraryItem {
  id: string;
  title: string;
  details: string;
  scheduledAt: string | null;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  notes: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  user: { profile: { displayName: string } | null };
}

export function getToken() {
  return sessionStorage.getItem(tokenKey);
}

export function setToken(token: string | null) {
  if (token) sessionStorage.setItem(tokenKey, token);
  else sessionStorage.removeItem(tokenKey);
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof body.error === "string" ? body.error : `API request failed (${response.status})`);
  }
  return body as T;
}

export const api = {
  register: (data: { email: string; password: string; displayName: string }) =>
    apiRequest<{ user: { id: string; email: string }; token: string }>("/auth/register", {
      method: "POST", body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    apiRequest<{ user: { id: string; email: string }; token: string }>("/auth/login", {
      method: "POST", body: JSON.stringify(data),
    }),
  profile: () => apiRequest<Profile>("/profile"),
  updateProfile: (data: Partial<Profile>) =>
    apiRequest<Profile>("/profile", { method: "PUT", body: JSON.stringify(data) }),
  trips: (filters: { destination?: string; dateFrom?: string; dateTo?: string; interests?: string; budgetMax?: string }) => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => { if (value) query.set(key, value); });
    const suffix = query.size ? `?${query.toString()}` : "";
    return apiRequest<Trip[]>(`/trips${suffix}`);
  },
  createTrip: (data: {
    destination: string; region?: string; description?: string; startsAt: string; endsAt: string;
    budgetPerPerson: number; maxMembers: number; interests: string[];
  }) => apiRequest<Trip>("/trips", { method: "POST", body: JSON.stringify(data) }),
  joinTrip: (id: string) => apiRequest<{ joined: boolean; memberCount: number }>(`/trips/${id}/join`, { method: "POST" }),
  itinerary: (id: string) => apiRequest<ItineraryItem[]>(`/trips/${id}/itinerary`),
  addItinerary: (id: string, data: { title: string; details?: string; scheduledAt?: string | null }) =>
    apiRequest<ItineraryItem>(`/trips/${id}/itinerary`, { method: "POST", body: JSON.stringify(data) }),
  expenses: (id: string) => apiRequest<{ items: Expense[]; total: number }>(`/trips/${id}/expenses`),
  addExpense: (id: string, data: { title: string; amount: number; notes?: string }) =>
    apiRequest<Expense>(`/trips/${id}/expenses`, { method: "POST", body: JSON.stringify(data) }),
  messages: (id: string) => apiRequest<ChatMessage[]>(`/trips/${id}/chat`),
  sendMessage: (id: string, content: string) =>
    apiRequest<ChatMessage>(`/trips/${id}/chat`, { method: "POST", body: JSON.stringify({ content }) }),
};
