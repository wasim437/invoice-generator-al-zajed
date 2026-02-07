export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  taxPercent: number;
  amount: number;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  address: string[];
  phone: string;
  vatNumber: string;
  email: string;
}

export interface ClientInfo {
  name: string;
  address: string[];
  vatNumber: string;
}

export interface ShipToInfo {
  address: string[];
}

export interface BankDetails {
  accountName: string;
  bankName: string;
  beneficiaryNo: string;
  ibanNumber: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  company: CompanyInfo;
  billTo: ClientInfo;
  shipTo: ShipToInfo;
  items: InvoiceItem[];
  lpoNo: string;
  lpoDate: string;
  paymentTerms: string;
  notes: string;
  termsAndConditions: string[];
  bankDetails: BankDetails;
  vatPercent: number;
  authorizedSignature?: string;
  customerSignature?: string;
  companyStamp?: string;
}

export type TemplateName = 'classic' | 'modern' | 'minimal' | 'bold' | 'executive' | 'elegant' | 'corporate' | 'stripe';

export interface InvoiceStyle {
  template: TemplateName;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  headerSize: number;
  showLogo: boolean;
  showBankDetails: boolean;
  showTerms: boolean;
  showAmountInWords: boolean;
  showSignature: boolean;
  paperSize: 'a4' | 'letter';
  tableBordered: boolean;
  headerLayout: 'left' | 'center' | 'split';
}

export interface SavedInvoice {
  invoiceNumber: string;
  clientName: string;
  total: number;
  date: string;
  status: string;
  pdfUrl?: string;
  clientEmail?: string;
  emailStatus?: string;
  clientAddress?: string;
  clientVAT?: string;
  shipToAddress?: string;
  dueDate?: string;
  lpoNo?: string;
  lpoDate?: string;
  paymentTerms?: string;
  subtotal?: number;
  taxAmount?: number;
  notes?: string;
  items?: string;
  bankDetails?: string;
}

export interface SentEmail {
  invoiceNumber: string;
  clientEmail: string;
  subject: string;
  sentAt: string;
  pdfUrl?: string;
}
