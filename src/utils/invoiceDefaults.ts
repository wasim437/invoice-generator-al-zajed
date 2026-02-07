import { InvoiceData, InvoiceStyle } from '@/types/invoice';

export const defaultCompany = {
  name: 'Al Zajed Technologies LLC',
  tagline: 'Innovate | Integrate | Elevate',
  address: ['Office 003, Building 290, Al Souq Al Kabeer', 'Bur Dubai, Dubai'],
  phone: '+971 4 2398707',
  vatNumber: 'TRN 100535318800003',
  email: 'info@alzajed.com',
};

export const defaultBankDetails = {
  accountName: 'Al Zajed Technologies LLC',
  bankName: 'RAK Bank',
  beneficiaryNo: '0292 8854 9100 1',
  ibanNumber: 'AE 3004 0000 0292 8854 9100 1',
};

export const defaultTerms = [
  'Received goods in good condition.',
  'No warranty for physical damaged items.',
  'Please call with 3 days of raising invoice for any dispute or clarifications.',
  'Cheques to be crossed in favour of Al Zajed Technologies LLC',
  'Warranty as per manufacturers Terms and Condition.',
];

export const defaultInvoice: InvoiceData = {
  invoiceNumber: 'AZT/INV/2026/000106',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  company: defaultCompany,
  billTo: { name: '', address: ['', ''], vatNumber: '' },
  shipTo: { address: ['', ''] },
  items: [{ id: '1', description: '', qty: 1, rate: 0, taxPercent: 5, amount: 0 }],
  lpoNo: '',
  lpoDate: '',
  paymentTerms: '',
  notes: '',
  termsAndConditions: defaultTerms,
  bankDetails: defaultBankDetails,
  vatPercent: 5,
  authorizedSignature: undefined,
  customerSignature: undefined,
  companyStamp: undefined,
};

export const defaultStyle: InvoiceStyle = {
  template: 'classic',
  primaryColor: '#0a5e9c',
  accentColor: '#1da5b8',
  fontFamily: 'Inter',
  fontSize: 13,
  headerSize: 22,
  showLogo: true,
  showBankDetails: true,
  showTerms: true,
  showAmountInWords: true,
  showSignature: true,
  paperSize: 'a4',
  tableBordered: false,
  headerLayout: 'left',
};

export const templatePresets: Record<string, Partial<InvoiceStyle>> = {
  classic: { primaryColor: '#0a5e9c', accentColor: '#1da5b8', headerLayout: 'left', tableBordered: false },
  modern: { primaryColor: '#2563eb', accentColor: '#06b6d4', headerLayout: 'left', tableBordered: false },
  minimal: { primaryColor: '#374151', accentColor: '#6b7280', headerLayout: 'left', tableBordered: false },
  bold: { primaryColor: '#dc2626', accentColor: '#f59e0b', headerLayout: 'left', tableBordered: true },
  executive: { primaryColor: '#1e3a5f', accentColor: '#c9a84c', headerLayout: 'center', tableBordered: true },
  elegant: { primaryColor: '#2d2d2d', accentColor: '#8b6914', headerLayout: 'split', tableBordered: false },
  corporate: { primaryColor: '#0d9488', accentColor: '#14b8a6', headerLayout: 'left', tableBordered: true },
  stripe: { primaryColor: '#635bff', accentColor: '#a259ff', headerLayout: 'left', tableBordered: false },
};
