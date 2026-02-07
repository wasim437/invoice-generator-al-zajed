import { useState, useEffect } from 'react';
import { WEBHOOKS } from '@/config/webhooks';
import { SavedInvoice, SentEmail } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Mail, Loader2, ExternalLink, RefreshCw, Filter, CheckCircle2, XCircle, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SendEmailDialog from './SendEmailDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Props {
  onBack: () => void;
}

export default function HistoryPage({ onBack }: Props) {
  const [tab, setTab] = useState<'invoices' | 'emails'>('invoices');
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sent' | 'pending'>('all');
  const [emailInvoice, setEmailInvoice] = useState<SavedInvoice | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch(WEBHOOKS.FETCH_INVOICES);
      const text = await res.text();
      let raw;
      try {
        raw = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse invoices JSON:', text.slice(0, 100));
        raw = [];
      }
      const arr = Array.isArray(raw) ? raw : [];
      setInvoices(arr.filter(Boolean).map((r: any) => ({
        invoiceNumber: r?.invoiceNumber || '',
        clientName: r?.clientName || '',
        total: r?.total || 0,
        date: r?.invoiceDate || '',
        status: '',
        pdfUrl: typeof r?.imageUrl === 'string' && r.imageUrl.startsWith('http') ? r.imageUrl : undefined,
        clientEmail: r?.clientEmail || r?.clientemail || '',
        emailStatus: r?.gmailStatus || r?.gmailstatus || 'no',
        clientAddress: r?.clientAddress || '',
        clientVAT: r?.clientVAT || '',
        shipToAddress: r?.shipToAddress || '',
        dueDate: r?.dueDate || '',
        lpoNo: r?.lpoNo || '',
        lpoDate: r?.lpoDate || '',
        paymentTerms: r?.paymentTerms || '',
        subtotal: r?.subtotal || 0,
        taxAmount: r?.taxAmount || 0,
        notes: r?.notes || '',
        items: r?.items || '[]',
        bankDetails: r?.bankDetails || '{}',
      })));
    } catch { setInvoices([]); }
    setLoading(false);
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch(WEBHOOKS.FETCH_EMAILS);
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse emails JSON:', text.slice(0, 100));
        data = [];
      }
      setEmails(Array.isArray(data) ? data : []);
    } catch { setEmails([]); }
    setLoading(false);
  };

  useEffect(() => {
    if (tab === 'invoices') fetchInvoices();
    else fetchEmails();
  }, [tab]);

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'all') return true;
    if (filter === 'sent') return inv.emailStatus === 'yes';
    if (filter === 'pending') return inv.emailStatus !== 'yes';
    return true;
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-display font-bold text-foreground">History</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => tab === 'invoices' ? fetchInvoices() : fetchEmails()} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
          <div className="flex gap-2">
            <Button variant={tab === 'invoices' ? 'default' : 'outline'} onClick={() => setTab('invoices')} className="gap-2">
              <FileText className="w-4 h-4" /> Saved Invoices
            </Button>
            <Button variant={tab === 'emails' ? 'default' : 'outline'} onClick={() => setTab('emails')} className="gap-2">
              <Mail className="w-4 h-4" /> Sent Emails
            </Button>
          </div>

          {tab === 'invoices' && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="sent">Email Sent</SelectItem>
                  <SelectItem value="pending">Not Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          {tab === 'invoices' ? 'Data from Google Sheets — saved invoices with PDF links on Google Drive.' : 'Email log from Google Sheets.'}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : tab === 'invoices' ? (
          <div className="space-y-3">
            {filteredInvoices.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No saved invoices found matching filter.</p>
            ) : (
              filteredInvoices.map((inv, i) => {
                const items = (() => {
                  try {
                    if (typeof inv.items === 'string') return JSON.parse(inv.items || '[]');
                    if (Array.isArray(inv.items)) return inv.items;
                    return [];
                  } catch { return []; }
                })();
                const bank = (() => {
                  try {
                    if (typeof inv.bankDetails === 'string') return JSON.parse(inv.bankDetails || '{}');
                    if (typeof inv.bankDetails === 'object' && inv.bankDetails !== null) return inv.bankDetails;
                    return {};
                  } catch { return {}; }
                })();
                const isSent = String(inv.emailStatus || '').toLowerCase() === 'yes';

                return (
                  <div key={i} className="glass-panel rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{inv.invoiceNumber}</p>
                          {isSent ? (
                            <Badge variant="secondary" className="bg-green-50 text-green-700 text-[10px] h-5 gap-1 hover:bg-green-100 px-1.5 font-normal border-green-200">
                              <CheckCircle2 className="w-3 h-3" /> Email Sent
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 text-[10px] h-5 gap-1 hover:bg-amber-100 px-1.5 font-normal border-amber-200">
                              <XCircle className="w-3 h-3" /> Not Sent
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{inv.clientName} • {inv.date}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-bold text-primary text-sm">AED {Number(inv.total || 0).toFixed(2)}</span>
                        {inv.pdfUrl && (
                          <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" title="View Image">
                            <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </a>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setEmailInvoice(inv)} className="gap-1 text-xs">
                          <Send className="w-3 h-3" /> Send
                        </Button>
                      </div>
                    </div>

                    {inv.clientEmail && (
                      <div className="text-xs flex items-center gap-1.5 text-muted-foreground bg-muted/30 p-1.5 rounded w-fit">
                        <Mail className="w-3 h-3" />
                        <span>{inv.clientEmail}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {inv.dueDate && <div><span className="text-muted-foreground">Due:</span> {inv.dueDate}</div>}
                      {inv.clientAddress && inv.clientAddress.replace(/,\s*/g, '') && <div><span className="text-muted-foreground">Address:</span> {inv.clientAddress}</div>}
                      {inv.clientVAT && <div><span className="text-muted-foreground">VAT:</span> {inv.clientVAT}</div>}
                      {inv.lpoNo && <div><span className="text-muted-foreground">LPO:</span> {inv.lpoNo}</div>}
                      {inv.lpoDate && <div><span className="text-muted-foreground">LPO Date:</span> {inv.lpoDate}</div>}
                      {inv.paymentTerms && <div><span className="text-muted-foreground">Terms:</span> {inv.paymentTerms}</div>}
                      {inv.shipToAddress && inv.shipToAddress.replace(/,\s*/g, '') && <div><span className="text-muted-foreground">Ship To:</span> {inv.shipToAddress}</div>}
                    </div>
                    {items.length > 0 && items.some((it: any) => it.description) && (
                      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-1.5 font-medium">Item</th>
                              <th className="text-right p-1.5 font-medium">Qty</th>
                              <th className="text-right p-1.5 font-medium">Rate</th>
                              <th className="text-right p-1.5 font-medium">Tax%</th>
                              <th className="text-right p-1.5 font-medium">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((it: any, j: number) => (
                              <tr key={j} className="border-t">
                                <td className="p-1.5">{it.description || '-'}</td>
                                <td className="p-1.5 text-right">{it.qty}</td>
                                <td className="p-1.5 text-right">{Number(it.rate || 0).toFixed(2)}</td>
                                <td className="p-1.5 text-right">{it.taxPercent}%</td>
                                <td className="p-1.5 text-right">{Number(it.amount || 0).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="flex justify-end gap-4 text-xs">
                      <span className="text-muted-foreground">Subtotal: AED {Number(inv.subtotal || 0).toFixed(2)}</span>
                      <span className="text-muted-foreground">Tax: AED {Number(inv.taxAmount || 0).toFixed(2)}</span>
                      <span className="font-semibold">Total: AED {Number(inv.total || 0).toFixed(2)}</span>
                    </div>
                    {inv.notes && <p className="text-xs text-muted-foreground"><span className="font-medium">Notes:</span> {inv.notes}</p>}
                    {bank.bankName && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Bank:</span> {bank.bankName} • {bank.accountName} • IBAN: {bank.ibanNumber}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {emails.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No sent emails yet.</p>
            ) : (
              emails.map((em, i) => (
                <div key={i} className="glass-panel rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{em.subject}</p>
                      <p className="text-xs text-muted-foreground">{em.invoiceNumber} → {em.clientEmail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{em.sentAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {emailInvoice && (
        <SendEmailDialog
          invoice={emailInvoice}
          open={!!emailInvoice}
          onOpenChange={(open) => { if (!open) setEmailInvoice(null); }}
          onSent={() => { setEmailInvoice(null); fetchInvoices(); }}
        />
      )}
    </div>
  );
}
