import { ReactNode } from 'react';

export interface FAQ {
  question: string;
  answer: ReactNode;
}

export interface FAQStructuredDataProps {
  faqs: FAQ[];
}

export interface FAQStructuredData {
  '@context': string;
  '@type': string;
  mainEntity: FAQQuestionStructuredData[];
}

export interface FAQQuestionStructuredData {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}


