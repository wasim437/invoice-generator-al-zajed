import { useState, useEffect } from 'react';
import { WEBHOOKS } from '@/config/webhooks';
import { SavedInvoice } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Loader2, RefreshCw, Mail, Filter, CheckCircle2, XCircle, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SendEmailDialog from './SendEmailDialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Search, FileText, Calendar, DollarSign, User } from 'lucide-react';


interface Props {
  onBack: () => void;
}

export default function SavedInvoicesPage({ onBack }: Props) {
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sent' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [emailInvoice, setEmailInvoice] = useState<SavedInvoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<SavedInvoice | null>(null);

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
      setInvoices(arr.map((r: any) => ({
        invoiceNumber: r.invoiceNumber || '',
        clientName: r.clientName || '',
        total: r.total || 0,
        date: r.invoiceDate || '',
        status: '',
        pdfUrl: typeof r.imageUrl === 'string' && r.imageUrl.startsWith('http') ? r.imageUrl : undefined,
        clientEmail: r.clientEmail || '',
        emailStatus: r.gmailStatus || 'no',
        clientAddress: r.clientAddress || '',
        clientVAT: r.clientVAT || '',
        shipToAddress: r.shipToAddress || '',
        dueDate: r.dueDate || '',
        lpoNo: r.lpoNo || '',
        lpoDate: r.lpoDate || '',
        paymentTerms: r.paymentTerms || '',
        subtotal: r.subtotal || 0,
        taxAmount: r.taxAmount || 0,
        notes: r.notes || '',
        items: r.items || '[]',
        bankDetails: r.bankDetails || '{}',
      })));
    } catch { setInvoices([]); }
    setLoading(false);
  };

  useEffect(() => { fetchInvoices(); }, []);

  const isEmailSent = (inv: SavedInvoice) => {
    const status = (inv.emailStatus || '').toLowerCase().trim();
    return status === 'yes' || status === 'sent' || status === 'true';
  };

  const filteredInvoices = invoices.filter(inv => {
    // Status Filter
    if (filter !== 'all') {
      const sent = isEmailSent(inv);
      if (filter === 'sent' && !sent) return false;
      if (filter === 'pending' && sent) return false;
    }

    // Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesNumber = (inv.invoiceNumber || '').toLowerCase().includes(query);
      const matchesName = (inv.clientName || '').toLowerCase().includes(query);
      const matchesDate = (inv.date || '').toLowerCase().includes(query);
      const matchesNotes = (inv.notes || '').toLowerCase().includes(query);

      if (!matchesNumber && !matchesName && !matchesDate && !matchesNotes) return false;
    }

    return true;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-display font-bold text-foreground">Saved Invoices</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search invoice #, client..."
                className="pl-9 h-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
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
              <Button variant="outline" size="sm" onClick={fetchInvoices} className="gap-1.5 h-9">
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Data from Google Sheets — saved invoices with PDF links on Google Drive.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No saved invoices found matching filter.</p>
        ) : (
          <div className="space-y-3">
            {paginatedInvoices.map((inv, i) => {
              const sent = isEmailSent(inv);

              return (
                <div key={i} className="glass-panel rounded-lg p-4 space-y-3 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedInvoice(inv)}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-primary group-hover:underline">{inv.invoiceNumber}</p>
                        {sent ? (
                          <Badge variant="secondary" className="bg-green-50 text-green-700 text-[10px] h-5 gap-1 hover:bg-green-100 px-1.5 font-normal border-green-200">
                            <CheckCircle2 className="w-3 h-3" /> Sent
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

                      <Button variant="ghost" size="sm" className="h-8 px-2" onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); }}>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </Button>

                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setEmailInvoice(inv); }} className="gap-1 text-xs h-8">
                        <Send className="w-3 h-3" /> Send
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-4">
                <p className="text-xs text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs font-medium">Page {currentPage} of {totalPages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invoice Details Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center justify-between">
              <span>Invoice Details</span>
              {selectedInvoice && (
                <Badge variant="outline" className="text-muted-foreground">
                  {selectedInvoice.invoiceNumber}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6 pt-2">
            {selectedInvoice && (
              <div className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <User className="w-3 h-3" /> Client
                    </Label>
                    <p className="font-medium text-sm">{selectedInvoice.clientName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3" /> Date
                    </Label>
                    <p className="font-medium text-sm">{selectedInvoice.date}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <DollarSign className="w-3 h-3" /> Total
                    </Label>
                    <p className="font-bold text-sm text-primary">AED {Number(selectedInvoice.total).toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <Mail className="w-3 h-3" /> Status
                    </Label>
                    <div className="flex items-center gap-1.5">
                      {isEmailSent(selectedInvoice) ? (
                        <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Sent</span>
                      ) : (
                        <span className="text-xs text-amber-600 flex items-center gap-1"><XCircle className="w-3 h-3" /> Pending</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* PDF/Image Preview Link */}
                {selectedInvoice.pdfUrl && (
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Invoice PDF Document</span>
                    </div>
                    <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs" asChild>
                      <a href={selectedInvoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                        Open Document <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Items Table */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Line Items</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                        <tr>
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-right w-16">Qty</th>
                          <th className="px-4 py-2 text-right w-24">Rate</th>
                          <th className="px-4 py-2 text-right w-24">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {(() => {
                          try {
                            const items = JSON.parse(selectedInvoice.items || '[]');
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            return items.map((item: any, i: number) => (
                              <tr key={i} className="hover:bg-muted/20">
                                <td className="px-4 py-2">{item.description}</td>
                                <td className="px-4 py-2 text-right">{item.qty}</td>
                                <td className="px-4 py-2 text-right">{Number(item.rate).toFixed(2)}</td>
                                <td className="px-4 py-2 text-right font-medium">{Number(item.amount).toFixed(2)}</td>
                              </tr>
                            ));
                          } catch { return <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">No items data</td></tr>; }
                        })()}
                      </tbody>
                      <tfoot className="bg-muted/20 font-medium">
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-right">Subtotal</td>
                          <td className="px-4 py-2 text-right">AED {Number(selectedInvoice.subtotal || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-right">VAT</td>
                          <td className="px-4 py-2 text-right">AED {Number(selectedInvoice.taxAmount || 0).toFixed(2)}</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td colSpan={3} className="px-4 py-3 text-right font-bold text-base">Grand Total</td>
                          <td className="px-4 py-3 text-right font-bold text-base text-primary">AED {Number(selectedInvoice.total || 0).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Additional Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bank Details */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Bank Details</h4>
                    {(() => {
                      try {
                        const bank = JSON.parse(selectedInvoice.bankDetails || '{}');
                        return bank.bankName ? (
                          <div className="bg-muted/40 p-3 rounded text-sm space-y-1">
                            <p><span className="text-muted-foreground">Bank:</span> {bank.bankName}</p>
                            <p><span className="text-muted-foreground">Account:</span> {bank.accountName}</p>
                            <p><span className="text-muted-foreground">IBAN:</span> {bank.ibanNumber}</p>
                            <p><span className="text-muted-foreground">Beneficiary:</span> {bank.beneficiaryNo}</p>
                          </div>
                        ) : <p className="text-xs text-muted-foreground italic">No bank details</p>;
                      } catch { return null; }
                    })()}
                  </div>

                  {/* Other Info */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Other Information</h4>
                    <div className="text-sm space-y-1">
                      {selectedInvoice.dueDate && <p><span className="text-muted-foreground">Due Date:</span> {selectedInvoice.dueDate}</p>}
                      {selectedInvoice.lpoNo && <p><span className="text-muted-foreground">LPO No:</span> {selectedInvoice.lpoNo}</p>}
                      {selectedInvoice.paymentTerms && <p><span className="text-muted-foreground">Terms:</span> {selectedInvoice.paymentTerms}</p>}
                      {selectedInvoice.clientVAT && <p><span className="text-muted-foreground">Client VAT:</span> {selectedInvoice.clientVAT}</p>}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Notes</h4>
                    <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded">{selectedInvoice.notes}</p>
                  </div>
                )}

              </div>
            )}
          </ScrollArea>
          <div className="p-4 border-t bg-muted/10 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedInvoice(null)}>Close</Button>
            {selectedInvoice && (
              <Button onClick={() => { setSelectedInvoice(null); setEmailInvoice(selectedInvoice); }} className="gap-2">
                <Send className="w-4 h-4" /> Send Email
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>



      {
        emailInvoice && (
          <SendEmailDialog
            invoice={emailInvoice}
            open={!!emailInvoice}
            onOpenChange={(open) => { if (!open) setEmailInvoice(null); }}
            onSent={() => { setEmailInvoice(null); fetchInvoices(); }}
          />
        )
      }
    </div >
  );
}
