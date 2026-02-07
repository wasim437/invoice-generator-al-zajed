import { forwardRef } from 'react';
import { InvoiceData, InvoiceStyle } from '@/types/invoice';
import { numberToWords } from '@/utils/numberToWords';
import alZajedLogo from '@/assets/al-zajed-logo.png';

interface InvoicePreviewProps {
  invoice: InvoiceData;
  style: InvoiceStyle;
  subtotal: number;
  taxAmount: number;
  total: number;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoice, style, subtotal, taxAmount, total }, ref) => {
    const fontStyle = { fontFamily: style.fontFamily + ', sans-serif' };
    const bordered = style.tableBordered;

    const renderHeaderLeft = () => (
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          {style.showLogo && (
            <img src={alZajedLogo} alt="Logo" className="w-20 h-20 object-contain" />
          )}
          <div>
            <h1 className="font-bold" style={{ fontSize: `${style.headerSize}px`, color: style.primaryColor }}>
              {invoice.company.name}
            </h1>
            <p className="text-xs italic" style={{ color: style.accentColor }}>{invoice.company.tagline}</p>
            {invoice.company.address.map((line, i) => <p key={i} className="text-gray-600">{line}</p>)}
            <p className="text-gray-600">{invoice.company.phone}</p>
            <p className="text-gray-600">VAT Number: {invoice.company.vatNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold tracking-wider" style={{ color: style.primaryColor }}>TAX INVOICE</h2>
          <div className="mt-2 text-xs space-y-1">
            <p><span className="font-semibold">Invoice Number:</span> {invoice.invoiceNumber}</p>
            <p><span className="font-semibold">Invoice Date:</span> {invoice.invoiceDate}</p>
            <p><span className="font-semibold">Due Date:</span> {invoice.dueDate}</p>
          </div>
        </div>
      </div>
    );

    const renderHeaderCenter = () => (
      <div className="text-center mb-8">
        {style.showLogo && <img src={alZajedLogo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-2" />}
        <h1 className="font-bold" style={{ fontSize: `${style.headerSize}px`, color: style.primaryColor }}>
          {invoice.company.name}
        </h1>
        <p className="text-italic mb-1" style={{ color: style.accentColor }}>{invoice.company.tagline}</p>
        <p className="text-gray-600">{invoice.company.address.join(', ')} | {invoice.company.phone}</p>
        <p className="text-gray-600">VAT: {invoice.company.vatNumber}</p>
        <div className="mt-3 inline-block px-4 py-2 rounded" style={{ backgroundColor: style.primaryColor, color: 'white' }}>
          <span className="text-lg font-bold tracking-widest">TAX INVOICE</span>
        </div>
        <div className="flex justify-center gap-6 mt-3 text-xs">
          <p><span className="font-semibold">Invoice #:</span> {invoice.invoiceNumber}</p>
          <p><span className="font-semibold">Date:</span> {invoice.invoiceDate}</p>
          <p><span className="font-semibold">Due:</span> {invoice.dueDate}</p>
        </div>
      </div>
    );

    const renderHeaderSplit = () => (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: `3px solid ${style.primaryColor}` }}>
          <div className="flex items-center gap-3">
            {style.showLogo && <img src={alZajedLogo} alt="Logo" className="w-16 h-16 object-contain" />}
            <div>
              <h1 className="font-bold" style={{ fontSize: `${style.headerSize}px`, color: style.primaryColor }}>{invoice.company.name}</h1>
              <p className="text-xs italic" style={{ color: style.accentColor }}>{invoice.company.tagline}</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-widest" style={{ color: style.primaryColor }}>INVOICE</h2>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <div>
            {invoice.company.address.map((l, i) => <p key={i}>{l}</p>)}
            <p>{invoice.company.phone}</p>
            <p>VAT: {invoice.company.vatNumber}</p>
          </div>
          <div className="text-right space-y-1">
            <p><span className="font-semibold text-gray-900">Invoice #:</span> {invoice.invoiceNumber}</p>
            <p><span className="font-semibold text-gray-900">Date:</span> {invoice.invoiceDate}</p>
            <p><span className="font-semibold text-gray-900">Due:</span> {invoice.dueDate}</p>
          </div>
        </div>
      </div>
    );

    return (
      <div
        ref={ref}
        id="invoice-preview"
        className="bg-white text-gray-900 relative overflow-hidden"
        style={{
          ...fontStyle,
          fontSize: `${style.fontSize}px`,
          width: style.paperSize === 'a4' ? '794px' : '816px',
          minHeight: style.paperSize === 'a4' ? '1123px' : '1056px',
          padding: '40px',
        }}
      >
        {/* Template decorations */}
        {style.template === 'modern' && (
          <div className="absolute top-0 left-0 right-0 h-2" style={{ background: `linear-gradient(90deg, ${style.primaryColor}, ${style.accentColor})` }} />
        )}
        {style.template === 'bold' && (
          <div className="absolute top-0 left-0 w-3 bottom-0" style={{ backgroundColor: style.primaryColor }} />
        )}
        {style.template === 'executive' && (
          <>
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: style.accentColor }} />
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: style.accentColor }} />
          </>
        )}
        {style.template === 'elegant' && (
          <div className="absolute top-0 left-0 right-0 h-16" style={{ background: `linear-gradient(180deg, ${style.primaryColor}15, transparent)` }} />
        )}
        {style.template === 'corporate' && (
          <div className="absolute top-0 left-0 right-0 h-3" style={{ background: `linear-gradient(90deg, ${style.primaryColor}, ${style.accentColor}, ${style.primaryColor})` }} />
        )}
        {style.template === 'stripe' && (
          <>
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${style.primaryColor}, ${style.accentColor})` }} />
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${style.accentColor}, ${style.primaryColor})` }} />
          </>
        )}

        {/* Header */}
        {style.headerLayout === 'center' ? renderHeaderCenter() :
          style.headerLayout === 'split' ? renderHeaderSplit() : renderHeaderLeft()}

        {/* Bill To / Ship To */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-3 rounded" style={{ backgroundColor: `${style.primaryColor}08`, borderLeft: `3px solid ${style.primaryColor}` }}>
            <h3 className="font-bold text-sm mb-1" style={{ color: style.primaryColor }}>Bill To:</h3>
            <p className="font-semibold text-sm">{invoice.billTo.name}</p>
            {invoice.billTo.address.map((line, i) => <p key={i} className="text-gray-600">{line}</p>)}
            {invoice.billTo.vatNumber && <p className="text-gray-600">VAT: {invoice.billTo.vatNumber}</p>}
          </div>
          <div className="p-3 rounded" style={{ backgroundColor: `${style.accentColor}08`, borderLeft: `3px solid ${style.accentColor}` }}>
            <h3 className="font-bold text-sm mb-1" style={{ color: style.accentColor }}>Ship To:</h3>
            {invoice.shipTo.address.map((line, i) => <p key={i} className="text-gray-600">{line}</p>)}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-6" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: style.primaryColor, color: 'white' }}>
              <th className="p-2 text-left w-8">#</th>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-center w-16">Qty</th>
              <th className="p-2 text-right w-20">Rate</th>
              <th className="p-2 text-center w-16">Tax</th>
              <th className="p-2 text-right w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={item.id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className={`p-2 ${bordered ? 'border border-gray-300' : 'border-b border-gray-200'}`}>{idx + 1}</td>
                <td className={`p-2 whitespace-pre-line ${bordered ? 'border border-gray-300' : 'border-b border-gray-200'}`}>{item.description}</td>
                <td className={`p-2 text-center ${bordered ? 'border border-gray-300' : 'border-b border-gray-200'}`}>{item.qty}</td>
                <td className={`p-2 text-right ${bordered ? 'border border-gray-300' : 'border-b border-gray-200'}`}>{item.rate.toFixed(2)}</td>
                <td className={`p-2 text-center ${bordered ? 'border border-gray-300' : 'border-b border-gray-200'}`}>VAT {item.taxPercent}%</td>
                <td className={`p-2 text-right ${bordered ? 'border border-gray-300' : 'border-b border-gray-200'}`}>{(item.qty * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-64">
            <div className="flex justify-between text-sm py-1 border-b border-gray-200">
              <span>Sub Total</span><span>AED {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm py-1 border-b border-gray-200">
              <span>VAT ({invoice.vatPercent}%)</span><span>AED {taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm py-1 border-b border-gray-200">
              <span>Total</span><span>AED {(subtotal + taxAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold py-2 text-base" style={{ color: style.primaryColor }}>
              <span>Amount Due</span><span>AED {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        {style.showAmountInWords && (
          <div className="mb-4 p-2 rounded text-sm font-semibold" style={{ backgroundColor: `${style.primaryColor}0a` }}>
            With words: {numberToWords(total)}
          </div>
        )}

        {/* LPO & Notes + Bank Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            {invoice.lpoNo && <p><span className="font-semibold">LPO No:</span> {invoice.lpoNo}</p>}
            {invoice.lpoDate && <p><span className="font-semibold">LPO Date:</span> {invoice.lpoDate}</p>}
            {invoice.paymentTerms && <p><span className="font-semibold">Payment Terms:</span> {invoice.paymentTerms}</p>}
            {invoice.notes && <p className="mt-2"><span className="font-semibold">Note:</span> {invoice.notes}</p>}
          </div>
          {style.showBankDetails && (
            <div>
              <h4 className="font-bold text-sm mb-1" style={{ color: style.primaryColor }}>Bank Details:</h4>
              <p>Account Name: {invoice.bankDetails.accountName}</p>
              <p>Bank Name: {invoice.bankDetails.bankName}</p>
              <p>Beneficiary No: {invoice.bankDetails.beneficiaryNo}</p>
              <p>IBAN Number: {invoice.bankDetails.ibanNumber}</p>
            </div>
          )}
        </div>

        {/* Terms */}
        {style.showTerms && invoice.termsAndConditions.length > 0 && (
          <div className="mb-6 text-xs">
            <h4 className="font-bold text-sm mb-1" style={{ color: style.primaryColor }}>Terms & Conditions:</h4>
            <ol className="list-decimal list-inside space-y-0.5">
              {invoice.termsAndConditions.map((term, i) => <li key={i}>{term}</li>)}
            </ol>
          </div>
        )}

        {/* Signatures with uploaded photos */}
        {style.showSignature && (
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-300 text-xs">
            <div className="text-center">
              <div className="w-40 h-16 mb-1 flex items-end justify-center">
                {invoice.authorizedSignature ? (
                  <img src={invoice.authorizedSignature} alt="Authorized Signature" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="w-full border-b border-gray-400" />
                )}
              </div>
              <p className="font-semibold">Authorized Sign.</p>
            </div>

            {/* Company Stamp */}
            {invoice.companyStamp && (
              <div className="flex items-end">
                <img src={invoice.companyStamp} alt="Company Stamp" className="w-24 h-24 object-contain opacity-80" />
              </div>
            )}

            <div className="text-center">
              <div className="w-40 h-16 mb-1 flex items-end justify-center">
                {invoice.customerSignature ? (
                  <img src={invoice.customerSignature} alt="Customer Signature" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="w-full border-b border-gray-400" />
                )}
              </div>
              <p className="font-semibold">Customer Sign. / Date</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
export default InvoicePreview;
