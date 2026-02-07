import { InvoiceData, InvoiceItem } from '@/types/invoice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  invoice: InvoiceData;
  updateField: <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => void;
  updateCompany: (field: string, value: string) => void;
  updateBillTo: (field: string, value: any) => void;
  updateShipTo: (field: string, value: any) => void;
  updateBankDetails: (field: string, value: string) => void;
  addItem: () => void;
  updateItem: (id: string, field: keyof InvoiceItem, value: any) => void;
  removeItem: (id: string) => void;
}

export default function InvoiceForm({
  invoice, updateField, updateCompany, updateBillTo, updateShipTo,
  updateBankDetails, addItem, updateItem, removeItem,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Invoice Details */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3">Invoice Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Invoice Number</Label>
            <Input value={invoice.invoiceNumber} onChange={e => updateField('invoiceNumber', e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Invoice Date</Label>
            <Input type="date" value={invoice.invoiceDate} onChange={e => updateField('invoiceDate', e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Due Date</Label>
            <Input type="date" value={invoice.dueDate} onChange={e => updateField('dueDate', e.target.value)} className="h-9 text-sm" />
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3">Company Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Company Name</Label>
            <Input value={invoice.company.name} onChange={e => updateCompany('name', e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Tagline</Label>
            <Input value={invoice.company.tagline} onChange={e => updateCompany('tagline', e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Phone</Label>
            <Input value={invoice.company.phone} onChange={e => updateCompany('phone', e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">VAT Number</Label>
            <Input value={invoice.company.vatNumber} onChange={e => updateCompany('vatNumber', e.target.value)} className="h-9 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Address (one line per row)</Label>
            <Textarea
              value={invoice.company.address.join('\n')}
              onChange={e => updateCompany('address', e.target.value.split('\n') as any)}
              rows={2} className="text-sm"
            />
          </div>
        </div>
      </section>

      {/* Bill To */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3">Bill To</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Client Name</Label>
            <Input value={invoice.billTo.name} onChange={e => updateBillTo('name', e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">VAT Number</Label>
            <Input value={invoice.billTo.vatNumber} onChange={e => updateBillTo('vatNumber', e.target.value)} className="h-9 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Address</Label>
            <Textarea
              value={invoice.billTo.address.join('\n')}
              onChange={e => updateBillTo('address', e.target.value.split('\n'))}
              rows={2} className="text-sm"
            />
          </div>
        </div>
      </section>

      {/* Ship To */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3">Ship To</h3>
        <Textarea
          value={invoice.shipTo.address.join('\n')}
          onChange={e => updateShipTo('address', e.target.value.split('\n'))}
          rows={2} className="text-sm" placeholder="Shipping address..."
        />
      </section>

      {/* Line Items */}
      <section className="glass-panel rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-sm text-primary">Line Items</h3>
          <Button size="sm" variant="outline" onClick={addItem} className="h-8 text-xs">
            <Plus className="w-3 h-3 mr-1" /> Add Item
          </Button>
        </div>
        <div className="space-y-3">
          {invoice.items.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-3 rounded-md bg-muted/50">
              <div className="col-span-12 sm:col-span-5">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={item.description}
                  onChange={e => updateItem(item.id, 'description', e.target.value)}
                  rows={2} className="text-sm"
                />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <Label className="text-xs">Qty</Label>
                <Input type="number" min={1} value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} className="h-9 text-sm" />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <Label className="text-xs">Rate</Label>
                <Input type="number" min={0} step={0.01} value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} className="h-9 text-sm" />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <Label className="text-xs">Tax %</Label>
                <Input type="number" min={0} value={item.taxPercent} onChange={e => updateItem(item.id, 'taxPercent', Number(e.target.value))} className="h-9 text-sm" />
              </div>
              <div className="col-span-3 sm:col-span-1 flex items-end">
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-9 w-9 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="col-span-12 text-right text-sm font-semibold text-primary">
                Amount: AED {(item.qty * item.rate).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Details */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3">Additional Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">LPO No</Label>
            <Input value={invoice.lpoNo} onChange={e => updateField('lpoNo', e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">LPO Date</Label>
            <Input value={invoice.lpoDate} onChange={e => updateField('lpoDate', e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Payment Terms</Label>
            <Input value={invoice.paymentTerms} onChange={e => updateField('paymentTerms', e.target.value)} className="h-9 text-sm" />
          </div>
          <div className="sm:col-span-3">
            <Label className="text-xs">Notes</Label>
            <Textarea value={invoice.notes} onChange={e => updateField('notes', e.target.value)} rows={2} className="text-sm" />
          </div>
        </div>
      </section>

      {/* Bank Details */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3">Bank Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Account Name</Label>
            <Input value={invoice.bankDetails.accountName} onChange={e => updateBankDetails('accountName', e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Bank Name</Label>
            <Input value={invoice.bankDetails.bankName} onChange={e => updateBankDetails('bankName', e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Beneficiary No</Label>
            <Input value={invoice.bankDetails.beneficiaryNo} onChange={e => updateBankDetails('beneficiaryNo', e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">IBAN Number</Label>
            <Input value={invoice.bankDetails.ibanNumber} onChange={e => updateBankDetails('ibanNumber', e.target.value)} className="h-9 text-sm" />
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3">Terms & Conditions</h3>
        <Textarea
          value={invoice.termsAndConditions.join('\n')}
          onChange={e => updateField('termsAndConditions', e.target.value.split('\n'))}
          rows={5} className="text-sm" placeholder="One term per line..."
        />
      </section>
    </div>
  );
}
