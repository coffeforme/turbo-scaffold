import type { AccessRequirements, AuthSession } from './types';

const includesAll = (source: string[], expected: string[]) =>
  expected.every((item) => source.includes(item));

const includesAny = (source: string[], expected: string[]) =>
  expected.some((item) => source.includes(item));

const matchClaims = (
  claims: Record<string, unknown>,
  expectedClaims: Record<string, unknown>,
  requireAll: boolean,
) => {
  const entries = Object.entries(expectedClaims) as Array<[string, unknown]>;

  if (entries.length === 0) {
    return true;
  }

  return requireAll
    ? entries.every(([key, value]) => claims[key] === value)
    : entries.some(([key, value]) => claims[key] === value);
};

export const hasAccess = (
  session: AuthSession | null | undefined,
  requirements: AccessRequirements,
) => {
  const user = session?.user;

  if (!user) {
    return false;
  }

  const requireAll = requirements.requireAll ?? false;
  const roles = user.roles ?? [];
  const permissions = user.permissions ?? [];
  const claims = user.claims ?? {};

  const checks = [
    requirements.roles?.length
      ? requireAll
        ? includesAll(roles, requirements.roles)
        : includesAny(roles, requirements.roles)
      : undefined,
    requirements.permissions?.length
      ? requireAll
        ? includesAll(permissions, requirements.permissions)
        : includesAny(permissions, requirements.permissions)
      : undefined,
    requirements.claims
      ? matchClaims(claims, requirements.claims, requireAll)
      : undefined,
  ].filter((value): value is boolean => typeof value === 'boolean');

  if (checks.length === 0) {
    return true;
  }

  return requireAll ? checks.every(Boolean) : checks.some(Boolean);
};
