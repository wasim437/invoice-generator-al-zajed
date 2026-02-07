import { useState, useCallback } from 'react';
import { InvoiceData, InvoiceItem } from '@/types/invoice';
import { defaultInvoice } from '@/utils/invoiceDefaults';

export function useInvoiceData() {
  const [invoice, setInvoice] = useState<InvoiceData>({ ...defaultInvoice });

  const updateField = useCallback(<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setInvoice(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateCompany = useCallback((field: string, value: string) => {
    setInvoice(prev => ({ ...prev, company: { ...prev.company, [field]: value } }));
  }, []);

  const updateBillTo = useCallback((field: string, value: any) => {
    setInvoice(prev => ({ ...prev, billTo: { ...prev.billTo, [field]: value } }));
  }, []);

  const updateShipTo = useCallback((field: string, value: any) => {
    setInvoice(prev => ({ ...prev, shipTo: { ...prev.shipTo, [field]: value } }));
  }, []);

  const updateBankDetails = useCallback((field: string, value: string) => {
    setInvoice(prev => ({ ...prev, bankDetails: { ...prev.bankDetails, [field]: value } }));
  }, []);

  const addItem = useCallback(() => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      qty: 1,
      rate: 0,
      taxPercent: invoice.vatPercent,
      amount: 0,
    };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
  }, [invoice.vatPercent]);

  const updateItem = useCallback((id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.amount = updated.qty * updated.rate;
        return updated;
      }),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setInvoice(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  }, []);

  const subtotal = invoice.items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const taxAmount = invoice.items.reduce((sum, item) => sum + (item.qty * item.rate * item.taxPercent) / 100, 0);
  const total = subtotal + taxAmount;

  return {
    invoice, setInvoice, updateField, updateCompany, updateBillTo, updateShipTo,
    updateBankDetails, addItem, updateItem, removeItem, subtotal, taxAmount, total,
  };
}
