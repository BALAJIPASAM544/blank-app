export type EmailPriority = 'Urgent' | 'Normal';
export type EmailSentiment = 'Positive' | 'Neutral' | 'Negative';

export interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  body: string;
  dateTime: string; // ISO or display
  priority: EmailPriority;
  sentiment: EmailSentiment;
}

export interface ExtractedInfo {
  phone?: string;
  alternateEmail?: string;
  productOrderId?: string;
}

export interface EmailDetails extends EmailItem {
  extracted?: ExtractedInfo;
  aiReply?: string;
}

export interface AnalyticsOverview {
  totalEmails: number;
  positiveEmails: number;
  negativeEmails: number;
  neutralEmails: number;
  urgentEmails: number;
  averageResponse: string;
}

