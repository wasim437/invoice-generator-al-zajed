import { useState } from 'react';
import { WEBHOOKS } from '@/config/webhooks';
import { SavedInvoice } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  invoice: SavedInvoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSent: () => void;
}

export default function SendEmailDialog({ invoice, open, onOpenChange, onSent }: Props) {
  const [emailTo, setEmailTo] = useState(invoice.clientEmail || '');
  const [emailSubject, setEmailSubject] = useState(`Invoice ${invoice.invoiceNumber}`);
  const [emailMessage, setEmailMessage] = useState(
    `Dear ${invoice.clientName || 'Customer'},\n\nPlease find attached invoice ${invoice.invoiceNumber} for AED ${Number(invoice.total || 0).toFixed(2)}.\n\nBest regards,\nAl Zajed Technologies`
  );
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!emailTo) {
      toast({ title: 'Error', description: 'Please enter recipient email.', variant: 'destructive' });
      return;
    }
    setSending(true);

    const payload = {
      invoiceNumber: invoice.invoiceNumber,
      to: emailTo,
      subject: emailSubject,
      message: emailMessage,
      pdfUrl: invoice.pdfUrl,
    };

    console.log('Sending Email Payload:', payload);

    try {
      const res = await fetch(WEBHOOKS.SEND_EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Send Email Response Status:', res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error('Email send failed details:', errorData);
        throw new Error(`Email send failed: ${res.status} ${errorData}`);
      }

      try {
        await fetch(WEBHOOKS.LOG_EMAIL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceNumber: invoice.invoiceNumber,
            clientEmail: emailTo,
            subject: emailSubject,
            sentAt: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.error('Failed to log email:', e);
      }

      toast({ title: 'Sent!', description: `Invoice emailed to ${emailTo}.` });
      onSent();
    } catch (error: any) {
      console.error('Send email error:', error);
      toast({
        title: 'Error',
        description: `Failed to send email. ${error.message || ''}`,
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Send Invoice via Email</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Sending: <span className="font-semibold">{invoice.invoiceNumber}</span>
        </p>
        <div className="space-y-3 mt-2">
          <div>
            <Label className="text-xs">Recipient Email</Label>
            <Input value={emailTo} onChange={e => setEmailTo(e.target.value)} placeholder="client@example.com" />
          </div>
          <div>
            <Label className="text-xs">Subject</Label>
            <Input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Message</Label>
            <Textarea value={emailMessage} onChange={e => setEmailMessage(e.target.value)} rows={4} />
          </div>
          <Button onClick={handleSend} disabled={sending} className="w-full gap-2">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
