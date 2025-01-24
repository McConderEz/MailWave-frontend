export type Letter = {
  id: number;
  from: string;
  to: string[];
  body?: string;
  attachmentNames: string[];
  subject?: string;
  folder: string;
  emailPrefix: string;
  date: Date;
  isCrypted: boolean;
  isSigned: boolean;
};
