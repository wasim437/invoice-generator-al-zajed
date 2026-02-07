import { useState, useEffect } from 'react';
import { WEBHOOKS } from '@/config/webhooks';
import { SentEmail } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, RefreshCw, CheckCircle2, Mail } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function EmailStatusPage({ onBack }: Props) {
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch(WEBHOOKS.FETCH_EMAILS);
      const data = await res.json();
      setEmails(Array.isArray(data) ? data : []);
    } catch { setEmails([]); }
    setLoading(false);
  };

  useEffect(() => { fetchEmails(); }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-display font-bold text-foreground">Email Status</h1>
          </div>
          <Button variant="outline" size="sm" onClick={fetchEmails} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Email log from Google Sheets — track which invoices have been sent.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : emails.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No sent emails yet.</p>
        ) : (
          <div className="space-y-3">
            {emails.map((em, i) => (
              <div key={i} className="glass-panel rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{em.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        <Mail className="w-3 h-3 inline mr-1" />
                        {em.invoiceNumber} → {em.clientEmail}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{em.sentAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
