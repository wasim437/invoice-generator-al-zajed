import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { InvoiceData, InvoiceStyle } from '@/types/invoice';
import { WEBHOOKS } from '@/config/webhooks';
import { Button } from '@/components/ui/button';
import { Download, Save, Loader2, Sheet } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  invoice: InvoiceData;
  style: InvoiceStyle;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export default function InvoiceActions({ invoice, style, subtotal, taxAmount, total }: Props) {
  const [saving, setSaving] = useState(false);

  const generatePDF = async (): Promise<jsPDF> => {
    const element = document.getElementById('invoice-preview');
    if (!element) throw new Error('Preview not found');
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: style.paperSize });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    return pdf;
  };

  const handleDownload = async () => {
    try {
      const pdf = await generatePDF();
      pdf.save(`Invoice_${invoice.invoiceNumber.replace(/\//g, '_')}.pdf`);
      toast({ title: 'Downloaded!', description: 'Invoice PDF saved.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    }
  };

  const handleSave = async () => {
    if (!invoice.billTo.name) {
      toast({ title: 'Missing Info', description: 'Please fill in client name before saving.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      // Duplicate Check
      try {
        const checkRes = await fetch(WEBHOOKS.FETCH_INVOICES);
        if (checkRes.ok) {
          const text = await checkRes.text();
          try {
            const existingInvoices = JSON.parse(text);
            if (Array.isArray(existingInvoices)) {
              const isDuplicate = existingInvoices.some((inv: any) =>
                (inv.invoiceNumber || '').trim().toLowerCase() === (invoice.invoiceNumber || '').trim().toLowerCase()
              );
              if (isDuplicate) {
                if (!confirm(`An invoice with number "${invoice.invoiceNumber}" already exists. Do you want to save it anyway?`)) {
                  setSaving(false);
                  return;
                }
              }
            }
          } catch (e) {
            console.warn('Could not parse invoices list as JSON:', text.slice(0, 100));
          }
        }
      } catch (err) {
        console.warn('Duplicate check fetch failed:', err);
      }

      const element = document.getElementById('invoice-preview');
      if (!element) throw new Error('Preview not found');
      const canvas = await html2canvas(element, { scale: 1, useCORS: true, backgroundColor: '#ffffff' });
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.5);

      const payload = {
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        clientName: invoice.billTo.name,
        clientAddress: invoice.billTo.address.join(', '),
        clientVAT: invoice.billTo.vatNumber,
        shipToAddress: invoice.shipTo.address.join(', '),
        lpoNo: invoice.lpoNo,
        lpoDate: invoice.lpoDate,
        paymentTerms: invoice.paymentTerms,
        items: JSON.stringify(invoice.items),
        subtotal,
        taxAmount,
        total,
        notes: invoice.notes,
        bankDetails: JSON.stringify(invoice.bankDetails),
        invoiceImage: imageBase64,
      };

      console.log('Saving Invoice Payload:', payload);

      const res = await fetch(WEBHOOKS.SAVE_INVOICE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Save Invoice Response Status:', res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error('Save failed details:', errorData);
        throw new Error(`Save failed: ${res.status} ${errorData}`);
      }

      toast({ title: 'Saved to Google Sheets!', description: 'Invoice saved, PDF generated & uploaded to Drive.' });
    } catch (error: any) {
      console.error('Save invoice error:', error);
      toast({
        title: 'Error',
        description: `Failed to save invoice. ${error.message || ''}`,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={handleDownload} variant="outline" size="sm" className="gap-1.5 text-xs">
        <Download className="w-3.5 h-3.5" /> PDF
      </Button>
      <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1.5 text-xs">
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sheet className="w-3.5 h-3.5" />}
        Save to Sheets
      </Button>
    </div>
  );
}
