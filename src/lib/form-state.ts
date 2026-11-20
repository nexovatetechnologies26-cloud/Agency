// Result shape returned by server actions used with useActionState.
export type FormState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fields?: Record<string, string>;
};

export const initialFormState: FormState = {};
