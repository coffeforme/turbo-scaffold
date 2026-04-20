import {
  cloneElement,
  isValidElement,
  useEffect,
  type ReactElement,
  type ReactNode,
} from 'react';
import { hasAccess as checkAccess } from '../access';
import type { AccessRequirements } from '../types';
import { useAuthSession } from './AuthSessionProvider';

type AccessEffect = 'hide' | 'disable' | 'redirect' | 'error';

interface AccessRightProps extends AccessRequirements {
  children: ReactNode;
  effect?: AccessEffect;
  fallback?: ReactNode;
  customError?: ReactNode;
  redirectTo?: string;
  onRedirect?: (target: string) => void;
}

export function AccessRight({
  children,
  effect = 'hide',
  fallback = null,
  customError,
  redirectTo = '/',
  onRedirect,
  ...requirements
}: AccessRightProps) {
  const { session } = useAuthSession();
  const allowed = checkAccess(session, requirements);

  useEffect(() => {
    if (allowed || effect !== 'redirect') {
      return;
    }

    if (onRedirect) {
      onRedirect(redirectTo);
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.assign(redirectTo);
    }
  }, [allowed, effect, onRedirect, redirectTo]);

  if (allowed) {
    return <>{children}</>;
  }

  if (effect === 'disable' && isValidElement(children)) {
    return cloneElement(children as ReactElement<any>, {
      disabled: true,
      'aria-disabled': true,
      title: 'You do not have access to perform this action.',
    });
  }

  if (effect === 'error') {
    return <>{customError ?? fallback}</>;
  }

  if (effect === 'redirect') {
    return <>{fallback}</>;
  }

  return <>{fallback}</>;
}
