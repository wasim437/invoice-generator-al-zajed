import { useState } from 'react';
import { InvoiceStyle } from '@/types/invoice';
import { defaultStyle } from '@/utils/invoiceDefaults';
import { useInvoiceData } from '@/hooks/useInvoiceData';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import InvoicePreview from '@/components/invoice/InvoicePreview';
import StyleCustomizer from '@/components/invoice/StyleCustomizer';
import InvoiceActions from '@/components/invoice/InvoiceActions';
import SavedInvoicesPage from '@/components/invoice/SavedInvoicesPage';
import DashboardPage from '@/components/invoice/DashboardPage';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Palette, History, Eye, Mail, LayoutDashboard } from 'lucide-react';
import alZajedLogo from '@/assets/al-zajed-logo.png';

const Index = () => {
  const invoiceData = useInvoiceData();

  const [style, setStyle] = useState<InvoiceStyle>({ ...defaultStyle });
  const [page, setPage] = useState<'editor' | 'invoices' | 'dashboard'>('editor');
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');

  if (page === 'invoices') {
    return <SavedInvoicesPage onBack={() => setPage('editor')} />;
  }
  if (page === 'dashboard') {
    return <DashboardPage onBack={() => setPage('editor')} />;
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={alZajedLogo} alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-display font-bold text-lg text-foreground leading-tight">Invoice Generator</h1>
              <p className="text-xs text-muted-foreground">Al Zajed Technologies</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <InvoiceActions
              invoice={invoiceData.invoice}
              style={style}
              subtotal={invoiceData.subtotal}
              taxAmount={invoiceData.taxAmount}
              total={invoiceData.total}
            />
            <button
              onClick={() => setPage('invoices')}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Saved Invoices"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage('dashboard')}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Analytics Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>

          </div>
        </div>
      </header>

      {/* Mobile tab switcher */}
      <div className="md:hidden flex border-b border-border bg-card">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${mobileTab === 'edit' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
        >
          <FileText className="w-4 h-4 inline mr-1" /> Editor
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${mobileTab === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
        >
          <Eye className="w-4 h-4 inline mr-1" /> Preview
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto flex">
        {/* Left Panel - Editor */}
        <div className={`w-full md:w-[420px] lg:w-[480px] flex-shrink-0 border-r border-border ${mobileTab !== 'edit' ? 'hidden md:block' : ''}`}>
          <ScrollArea className="h-[calc(100vh-57px)]">
            <div className="p-4">
              <Tabs defaultValue="details">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="details" className="flex-1 gap-1 text-xs">
                    <FileText className="w-3 h-3" /> Details
                  </TabsTrigger>
                  <TabsTrigger value="style" className="flex-1 gap-1 text-xs">
                    <Palette className="w-3 h-3" /> Style
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <InvoiceForm
                    invoice={invoiceData.invoice}
                    updateField={invoiceData.updateField}
                    updateCompany={invoiceData.updateCompany}
                    updateBillTo={invoiceData.updateBillTo}
                    updateShipTo={invoiceData.updateShipTo}
                    updateBankDetails={invoiceData.updateBankDetails}
                    addItem={invoiceData.addItem}
                    updateItem={invoiceData.updateItem}
                    removeItem={invoiceData.removeItem}
                  />
                </TabsContent>
                <TabsContent value="style">
                  <StyleCustomizer
                    style={style}
                    setStyle={setStyle}
                    authorizedSig={invoiceData.invoice.authorizedSignature}
                    customerSig={invoiceData.invoice.customerSignature}
                    companyStamp={invoiceData.invoice.companyStamp}
                    onAuthorizedSigChange={(url) => invoiceData.updateField('authorizedSignature', url)}
                    onCustomerSigChange={(url) => invoiceData.updateField('customerSignature', url)}
                    onCompanyStampChange={(url) => invoiceData.updateField('companyStamp', url)}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Preview */}
        <div className={`flex-1 bg-muted/30 ${mobileTab !== 'preview' ? 'hidden md:block' : ''}`}>
          <ScrollArea className="h-[calc(100vh-57px)]">
            <div className="p-6 flex justify-center">
              <div className="invoice-shadow rounded-lg overflow-hidden">
                <InvoicePreview
                  invoice={invoiceData.invoice}
                  style={style}
                  subtotal={invoiceData.subtotal}
                  taxAmount={invoiceData.taxAmount}
                  total={invoiceData.total}
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Index;
