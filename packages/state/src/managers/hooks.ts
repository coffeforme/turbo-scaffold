import { useState, useCallback, useEffect } from 'react';
import { getStateManager, getCurrentManagerType } from './StateManagerProvider';
import type { ContactFormData, FeedbackFormData } from '../shared/types';

export interface UseAgnosticContactFormConfig {
  submitContact?: (data: ContactFormData) => Promise<void>;
  onSuccess?: () => void;
  onFailure?: (error: string) => void;
  resetOnSuccess?: boolean;
}

export interface UseAgnosticFeedbackFormConfig {
  submitFeedback?: (data: FeedbackFormData) => Promise<void>;
  onSuccess?: () => void;
  onFailure?: (error: string) => void;
  resetOnSuccess?: boolean;
}

const defaultSubmitContact = async (data: ContactFormData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (Math.random() <= 0.5) {
    throw new Error('Random error occurred');
  }
  return data;
};

const defaultSubmitFeedback = async (data: FeedbackFormData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (Math.random() <= 0.5) {
    throw new Error('Random error occurred');
  }
  return data;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : 'Unknown error';
};

// Agnostic counter hook
export const useAgnosticCounter = () => {
  const [value, setValue] = useState(() => getStateManager().getCounterValue());

  useEffect(() => {
    setValue(getStateManager().getCounterValue());
  }, [getCurrentManagerType()]);

  const increment = useCallback(() => {
    getStateManager().incrementCounter();
    setValue(getStateManager().getCounterValue());
  }, []);

  const decrement = useCallback(() => {
    getStateManager().decrementCounter();
    setValue(getStateManager().getCounterValue());
  }, []);

  return {
    value,
    increment,
    decrement,
  };
};

// Agnostic contact form hook
export const useAgnosticContactForm = (config?: UseAgnosticContactFormConfig) => {
  const [formData, setFormData] = useState<ContactFormData>(() => getStateManager().getContactFormData());

  const [contactState, setContactState] = useState(() => getStateManager().getContactState());

  useEffect(() => {
    setFormData(getStateManager().getContactFormData());
    setContactState(getStateManager().getContactState());
  }, [getCurrentManagerType()]);

  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    getStateManager().updateContactField(field, value);
    setFormData(getStateManager().getContactFormData());
    setContactState(getStateManager().getContactState());
  }, []);

  const resetForm = useCallback(() => {
    getStateManager().resetContactForm();
    setFormData(getStateManager().getContactFormData());
    setContactState(getStateManager().getContactState());
  }, []);

  const submitForm = useCallback(async () => {
    getStateManager().submitContactStart();
    setContactState(getStateManager().getContactState());

    try {
      await (config?.submitContact ?? defaultSubmitContact)(formData);
      getStateManager().submitContactSuccess();
      setContactState(getStateManager().getContactState());
      if (config?.resetOnSuccess) {
        resetForm();
      }
      config?.onSuccess?.();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      getStateManager().submitContactFailure(errorMessage);
      setContactState(getStateManager().getContactState());
      config?.onFailure?.(errorMessage);
    }
  }, [config, formData, resetForm]);

  return {
    formData,
    updateField,
    submitForm,
    resetForm,
    submitting: contactState.submitting,
    submitted: contactState.submitted,
    error: contactState.error,
  };
};

// Agnostic feedback form hook
export const useAgnosticFeedbackForm = (config?: UseAgnosticFeedbackFormConfig) => {
  const [formData, setFormData] = useState<FeedbackFormData>(() => getStateManager().getFeedbackFormData());

  const [feedbackState, setFeedbackState] = useState(() => getStateManager().getFeedbackState());

  useEffect(() => {
    setFormData(getStateManager().getFeedbackFormData());
    setFeedbackState(getStateManager().getFeedbackState());
  }, [getCurrentManagerType()]);

  const updateField = useCallback((field: keyof FeedbackFormData, value: string | number) => {
    getStateManager().updateFeedbackField(field, value);
    setFormData(getStateManager().getFeedbackFormData());
    setFeedbackState(getStateManager().getFeedbackState());
  }, []);

  const resetForm = useCallback(() => {
    getStateManager().resetFeedbackForm();
    setFormData(getStateManager().getFeedbackFormData());
    setFeedbackState(getStateManager().getFeedbackState());
  }, []);

  const submitForm = useCallback(async () => {
    getStateManager().submitFeedbackStart();
    setFeedbackState(getStateManager().getFeedbackState());

    try {
      await (config?.submitFeedback ?? defaultSubmitFeedback)(formData);
      getStateManager().submitFeedbackSuccess();
      setFeedbackState(getStateManager().getFeedbackState());
      if (config?.resetOnSuccess) {
        resetForm();
      }
      config?.onSuccess?.();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      getStateManager().submitFeedbackFailure(errorMessage);
      setFeedbackState(getStateManager().getFeedbackState());
      config?.onFailure?.(errorMessage);
    }
  }, [config, formData, resetForm]);

  return {
    formData,
    updateField,
    submitForm,
    resetForm,
    submitting: feedbackState.submitting,
    submitted: feedbackState.submitted,
    error: feedbackState.error,
  };
};

// Agnostic user hook
export const useAgnosticUser = () => {
  const [userState, setUserState] = useState(() => getStateManager().getUserState());

  useEffect(() => {
    setUserState(getStateManager().getUserState());
  }, [getCurrentManagerType()]);

  const setUser = useCallback((user: any) => {
    getStateManager().setUser(user);
    setUserState(getStateManager().getUserState());
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    getStateManager().setUserLoading(loading);
    setUserState(getStateManager().getUserState());
  }, []);

  const setError = useCallback((error: string) => {
    getStateManager().setUserError(error);
    setUserState(getStateManager().getUserState());
  }, []);

  const clearUser = useCallback(() => {
    getStateManager().clearUser();
    setUserState(getStateManager().getUserState());
  }, []);

  return {
    user: userState.user,
    loading: userState.loading,
    error: userState.error,
    setUser,
    setLoading,
    setError,
    clearUser,
  };
};
