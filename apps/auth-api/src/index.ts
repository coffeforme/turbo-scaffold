import cors from 'cors';
import express from 'express';

type SessionRecord = {
  accessToken: string;
  refreshToken: string;
  idToken: string | null;
  expiresAt: number;
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
    permissions: string[];
    claims: Record<string, unknown>;
  };
};

const app = express();
const port = Number(process.env.PORT ?? 4001);
const sessions = new Map<string, SessionRecord>();
const refreshIndex = new Map<string, string>();

app.use(cors());
app.use(express.json());

const issueTokens = () => {
  const nonce = Math.random().toString(36).slice(2, 10);

  return {
    accessToken: `access_${nonce}_${Date.now()}`,
    refreshToken: `refresh_${nonce}_${Date.now()}`,
    idToken: `id_${nonce}_${Date.now()}`,
  };
};

const buildIdentity = (body: Record<string, unknown>) => {
  const provider = typeof body.provider === 'string' ? body.provider : 'custom-api';
  const externalUser =
    typeof body.externalUser === 'object' && body.externalUser ? body.externalUser : null;
  const fallbackEmail =
    provider === 'azure' || provider === 'mixed-auth' ? 'member@contoso.com' : 'user@example.com';
  const email =
    typeof body.email === 'string'
      ? body.email
      : externalUser && 'email' in externalUser && typeof externalUser.email === 'string'
        ? externalUser.email
        : fallbackEmail;

  const isAdmin = email.includes('admin');

  return {
    id: email,
    email,
    name:
      externalUser && 'name' in externalUser && typeof externalUser.name === 'string'
        ? externalUser.name
        : isAdmin
          ? 'Admin User'
          : 'Workspace User',
    roles: isAdmin ? ['admin', 'user'] : ['user'],
    permissions: isAdmin
      ? ['view', 'upload', 'create', 'delete']
      : ['view', 'upload', 'create'],
    claims: {
      tenant: provider === 'azure' || provider === 'mixed-auth' ? 'contoso' : 'local',
      provider,
      canDelete: isAdmin,
    },
  };
};

const createSession = (body: Record<string, unknown>) => {
  const tokens = issueTokens();
  const user = buildIdentity(body);
  const expiresAt = Date.now() + 1000 * 60 * 60;

  const session: SessionRecord = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    idToken: typeof body.externalIdToken === 'string' ? body.externalIdToken : tokens.idToken,
    expiresAt,
    user,
  };

  sessions.set(session.accessToken, session);
  refreshIndex.set(session.refreshToken, session.accessToken);

  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    idToken: session.idToken,
    expiresAt: session.expiresAt,
    user: session.user,
  };
};

const readBearerToken = (authorization?: string) => {
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length);
};

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

app.post('/auth/login', (request, response) => {
  const payload = request.body as Record<string, unknown>;
  const email = typeof payload.email === 'string' ? payload.email : null;
  const password = typeof payload.password === 'string' ? payload.password : null;
  const hasExternalToken =
    typeof payload.externalAccessToken === 'string' || typeof payload.externalIdToken === 'string';

  if (!hasExternalToken && (!email || !password)) {
    response.status(400).json({
      message: 'Provide email/password or an external provider token.',
    });
    return;
  }

  response.json(createSession(payload));
});

app.post('/auth/logout', (request, response) => {
  const token = readBearerToken(request.header('authorization'));

  if (token && sessions.has(token)) {
    const session = sessions.get(token)!;
    refreshIndex.delete(session.refreshToken);
    sessions.delete(token);
  }

  response.status(204).send();
});

app.get('/auth/session', (request, response) => {
  const token = readBearerToken(request.header('authorization'));

  if (!token || !sessions.has(token)) {
    response.status(401).json({ message: 'No active session found.' });
    return;
  }

  const session = sessions.get(token)!;
  response.json({
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    idToken: session.idToken,
    expiresAt: session.expiresAt,
    user: session.user,
  });
});

app.post('/auth/refresh', (request, response) => {
  const { refreshToken } = request.body as { refreshToken?: string };

  if (!refreshToken || !refreshIndex.has(refreshToken)) {
    response.status(401).json({ message: 'Invalid refresh token.' });
    return;
  }

  const currentAccessToken = refreshIndex.get(refreshToken)!;
  const currentSession = sessions.get(currentAccessToken);

  if (!currentSession) {
    response.status(401).json({ message: 'Session not found.' });
    return;
  }

  sessions.delete(currentAccessToken);
  refreshIndex.delete(refreshToken);

  response.json(
    createSession({
      email: currentSession.user.email,
      externalIdToken: currentSession.idToken,
      provider: currentSession.user.claims.provider,
    }),
  );
});

app.listen(port, () => {
  console.log(`Auth API listening on http://localhost:${port}`);
});
