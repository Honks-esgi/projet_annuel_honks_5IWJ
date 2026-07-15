import mock from './mock.json';
import type { AuthUser } from '../store/auth';
import type { GameItem } from '../components/molecules/GameCard';
import type { FriendListItem } from '../components/molecules/FriendRow';
import type { FriendRequest } from '../components/molecules/FriendRequestCard';

type RawUser      = typeof mock.User[number];
type RawGame      = typeof mock.Game[number];
type RawFriendship = typeof mock.Friendship[number];

function fullName(u: RawUser) {
  return `${u.firstName} ${u.lastName}`;
}

function userStatus(u: RawUser): 'online' | 'away' | 'offline' {
  if (u.status === 'ONLINE') return 'online';
  if (u.status === 'AWAY')   return 'away';
  return 'offline';
}

// Friend IDs (ACCEPTED) relative to a given user
function acceptedFriendIds(userId: string): string[] {
  return mock.Friendship
    .filter((f) => f.status === 'ACCEPTED' && (f.requesterId === userId || f.receiverId === userId))
    .map((f) => (f.requesterId === userId ? f.receiverId : f.requesterId));
}

// Game a user is currently playing (via active session)
function currentGameForUser(userId: string): string | null {
  const activeSessionId = mock.SessionParticipant
    .find((p) => p.userId === userId && mock.Session.some((s) => s.id === p.sessionId && s.status === 'ACTIVE'))
    ?.sessionId ?? null;
  if (!activeSessionId) return null;
  const session = mock.Session.find((s) => s.id === activeSessionId);
  if (!session) return null;
  const honk = mock.Honk.find((h) => h.id === session.honkId);
  if (!honk) return null;
  const game = mock.Game.find((g) => g.igdbId === honk.gameId);
  return game?.name ?? null;
}

// — Auth —

export function getAuthUser(): AuthUser {
  const u = mock.User[0];
  return { id: u.id, name: fullName(u), username: u.username, email: u.email };
}

// — Dashboard —

export type ReceivedHonk = {
  id:           string;
  from:         { id: string; name: string; avatarUrl: string | null };
  game:         string;
  sentAt:       string;
  expiresInMin: number;
};

export type AllReceivedHonk = ReceivedHonk & {
  response: 'PENDING' | 'ACCEPTED' | 'DECLINED';
};

export function getAllReceivedHonks(currentUserId: string): AllReceivedHonk[] {
  return mock.HonkRecipient
    .filter((r) => r.userId === currentUserId)
    .flatMap((r) => {
      const honk    = mock.Honk.find((h) => h.id === r.honkId);
      const creator = mock.User.find((u) => u.id === honk?.creatorId);
      const game    = mock.Game.find((g) => g.igdbId === honk?.gameId);
      if (!honk || !creator || !game) return [];
      const createdAt    = new Date(honk.createdAt).getTime();
      const expiresAt    = new Date(honk.expiresAt).getTime();
      const diffMin      = Math.max(0, Math.round((Date.now() - createdAt) / 60000));
      const sentAt       = diffMin < 60 ? `${diffMin} min` : `${Math.round(diffMin / 60)}h`;
      const expiresInMin = Math.max(0, Math.round((expiresAt - Date.now()) / 60000));
      const response     = r.response as 'PENDING' | 'ACCEPTED' | 'DECLINED';
      return [{ id: r.id, from: { id: creator.id, name: fullName(creator), avatarUrl: creator.avatarUrl }, game: game.name, sentAt, expiresInMin, response }];
    });
}

export function getReceivedHonks(currentUserId: string): ReceivedHonk[] {
  return mock.HonkRecipient
    .filter((r) => r.userId === currentUserId && r.response === 'PENDING')
    .flatMap((r) => {
      const honk    = mock.Honk.find((h) => h.id === r.honkId);
      const creator = mock.User.find((u) => u.id === honk?.creatorId);
      const game    = mock.Game.find((g) => g.igdbId === honk?.gameId);
      if (!honk || !creator || !game) return [];
      const createdAt    = new Date(honk.createdAt).getTime();
      const expiresAt    = new Date(honk.expiresAt).getTime();
      const diffMin      = Math.round((Date.now() - createdAt) / 60000);
      const sentAt       = diffMin < 60 ? `${diffMin} min` : `${Math.round(diffMin / 60)}h`;
      const expiresInMin = Math.max(0, Math.round((expiresAt - Date.now()) / 60000));
      return [{ id: r.id, from: { id: creator.id, name: fullName(creator), avatarUrl: creator.avatarUrl }, game: game.name, sentAt, expiresInMin }];
    });
}

export type ActiveSession = {
  id:       string;
  game:     string;
  coverUrl: string | null;
  players:  { id: string; role: string }[];
};

export function getActiveSessions(currentUserId: string): ActiveSession[] {
  const mySessionIds = mock.SessionParticipant
    .filter((p) => p.userId === currentUserId)
    .map((p) => p.sessionId);
  return mock.Session
    .filter((s) => mySessionIds.includes(s.id) && s.status === 'ACTIVE')
    .map((s) => {
      const honk     = mock.Honk.find((h) => h.id === s.honkId);
      const game     = mock.Game.find((g) => g.igdbId === honk?.gameId);
      const players  = mock.SessionParticipant.filter((p) => p.sessionId === s.id).map((p) => ({ id: p.userId, role: p.role }));
      return { id: s.id, game: game?.name ?? '?', coverUrl: game?.coverUrl ?? null, players };
    });
}

export type OnlineFriendAvatar = {
  id:       string;
  name:     string;
  status:   'online' | 'away' | 'offline';
  avatarUrl: string | null;
};

export function getOnlineFriendAvatars(currentUserId: string): OnlineFriendAvatar[] {
  const ids = acceptedFriendIds(currentUserId);
  return mock.User
    .filter((u) => ids.includes(u.id) && (u.status === 'ONLINE' || u.status === 'AWAY'))
    .map((u) => ({ id: u.id, name: fullName(u), status: userStatus(u), avatarUrl: u.avatarUrl }));
}

// — Games —

export function getGames(): GameItem[] {
  return mock.Game.map((g) => ({
    id:         String(g.igdbId),
    name:       g.name,
    coverUrl:   g.coverUrl,
    isFavorite: g.isFavorite,
    platforms:  g.platforms,
  }));
}

// — Friends —

export function getFriendsByStatus(currentUserId: string): {
  online:  FriendListItem[];
  offline: FriendListItem[];
} {
  const ids = acceptedFriendIds(currentUserId);
  const friends = mock.User
    .filter((u) => ids.includes(u.id))
    .map((u): FriendListItem => ({
      id:          u.id,
      name:        fullName(u),
      status:      userStatus(u),
      avatarUrl:   u.avatarUrl,
      currentGame: currentGameForUser(u.id),
    }));
  return {
    online:  friends.filter((f) => f.status === 'online' || f.status === 'away'),
    offline: friends.filter((f) => f.status === 'offline'),
  };
}

export function getAllFriends(currentUserId: string): FriendListItem[] {
  const ids = acceptedFriendIds(currentUserId);
  return mock.User
    .filter((u) => ids.includes(u.id))
    .map((u): FriendListItem => ({
      id:          u.id,
      name:        fullName(u),
      status:      userStatus(u),
      avatarUrl:   u.avatarUrl,
      currentGame: currentGameForUser(u.id),
    }));
}

export function getReceivedFriendRequests(currentUserId: string): FriendRequest[] {
  return mock.Friendship
    .filter((f): f is RawFriendship & { status: 'PENDING' } =>
      f.receiverId === currentUserId && f.status === 'PENDING')
    .flatMap((f) => {
      const requester = mock.User.find((u) => u.id === f.requesterId);
      if (!requester) return [];
      const mutualIds     = acceptedFriendIds(currentUserId);
      const requesterFriendIds = acceptedFriendIds(f.requesterId);
      const mutualFriends = mutualIds.filter((id) => requesterFriendIds.includes(id)).length;
      return [{ id: f.id, name: fullName(requester), avatarUrl: requester.avatarUrl, mutualFriends, status: 'pending' as const }];
    });
}
