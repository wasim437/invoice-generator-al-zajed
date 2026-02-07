import { InvoiceStyle, TemplateName } from '@/types/invoice';
import { templatePresets } from '@/utils/invoiceDefaults';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Palette, Type, Layout, Eye, Upload, Image } from 'lucide-react';

interface Props {
  style: InvoiceStyle;
  setStyle: React.Dispatch<React.SetStateAction<InvoiceStyle>>;
  authorizedSig?: string;
  customerSig?: string;
  companyStamp?: string;
  onAuthorizedSigChange: (url: string | undefined) => void;
  onCustomerSigChange: (url: string | undefined) => void;
  onCompanyStampChange: (url: string | undefined) => void;
}

const templates: { value: TemplateName; label: string; desc: string; color: string }[] = [
  { value: 'classic', label: 'Classic', desc: 'Clean traditional', color: '#0a5e9c' },
  { value: 'modern', label: 'Modern', desc: 'Gradient top bar', color: '#2563eb' },
  { value: 'minimal', label: 'Minimal', desc: 'Ultra simple', color: '#374151' },
  { value: 'bold', label: 'Bold', desc: 'Left accent bar', color: '#dc2626' },
  { value: 'executive', label: 'Executive', desc: 'Navy & gold', color: '#1e3a5f' },
  { value: 'elegant', label: 'Elegant', desc: 'Dark & luxe', color: '#2d2d2d' },
  { value: 'corporate', label: 'Corporate', desc: 'Teal professional', color: '#0d9488' },
  { value: 'stripe', label: 'Stripe', desc: 'Purple modern', color: '#635bff' },
];

const fonts = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Georgia', label: 'Georgia (Serif)' },
  { value: 'Courier New', label: 'Courier New (Mono)' },
];

function handleImageUpload(onSet: (url: string | undefined) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => onSet(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

export default function StyleCustomizer({
  style, setStyle, authorizedSig, customerSig, companyStamp,
  onAuthorizedSigChange, onCustomerSigChange, onCompanyStampChange,
}: Props) {
  const update = <K extends keyof InvoiceStyle>(key: K, value: InvoiceStyle[K]) => {
    setStyle(prev => ({ ...prev, [key]: value }));
  };

  const applyTemplate = (name: TemplateName) => {
    const preset = templatePresets[name];
    setStyle(prev => ({ ...prev, template: name, ...preset }));
  };

  return (
    <div className="space-y-5">
      {/* Templates */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3 flex items-center gap-2">
          <Layout className="w-4 h-4" /> Templates
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {templates.map(t => (
            <button
              key={t.value}
              onClick={() => applyTemplate(t.value)}
              className={`p-3 rounded-lg border text-left transition-all ${
                style.template === t.value
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                <p className="font-semibold text-sm">{t.label}</p>
              </div>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Colors
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Primary Color</Label>
            <div className="flex gap-2 items-center">
              <input type="color" value={style.primaryColor} onChange={e => update('primaryColor', e.target.value)}
                className="w-10 h-9 rounded cursor-pointer border-0" />
              <Input value={style.primaryColor} onChange={e => update('primaryColor', e.target.value)} className="h-9 text-sm flex-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Accent Color</Label>
            <div className="flex gap-2 items-center">
              <input type="color" value={style.accentColor} onChange={e => update('accentColor', e.target.value)}
                className="w-10 h-9 rounded cursor-pointer border-0" />
              <Input value={style.accentColor} onChange={e => update('accentColor', e.target.value)} className="h-9 text-sm flex-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3 flex items-center gap-2">
          <Type className="w-4 h-4" /> Typography
        </h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Font Family</Label>
            <Select value={style.fontFamily} onValueChange={v => update('fontFamily', v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {fonts.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Body Font Size: {style.fontSize}px</Label>
            <Slider value={[style.fontSize]} onValueChange={v => update('fontSize', v[0])} min={10} max={18} step={1} />
          </div>
          <div>
            <Label className="text-xs">Header Size: {style.headerSize}px</Label>
            <Slider value={[style.headerSize]} onValueChange={v => update('headerSize', v[0])} min={16} max={32} step={1} />
          </div>
        </div>
      </section>

      {/* Signatures & Stamp */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3 flex items-center gap-2">
          <Image className="w-4 h-4" /> Signatures & Stamp
        </h3>
        <div className="space-y-3">
          {/* Authorized Signature */}
          <div>
            <Label className="text-xs mb-1 block">Authorized Signature</Label>
            <div className="flex gap-2 items-center">
              {authorizedSig ? (
                <div className="relative w-24 h-16 border border-border rounded overflow-hidden bg-white">
                  <img src={authorizedSig} alt="Auth sig" className="w-full h-full object-contain" />
                  <button onClick={() => onAuthorizedSigChange(undefined)}
                    className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs px-1 rounded-bl">✕</button>
                </div>
              ) : (
                <button onClick={() => handleImageUpload(onAuthorizedSigChange)}
                  className="w-24 h-16 border-2 border-dashed border-border rounded flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors">
                  <Upload className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">Upload</span>
                </button>
              )}
            </div>
          </div>

          {/* Customer Signature */}
          <div>
            <Label className="text-xs mb-1 block">Customer Signature</Label>
            <div className="flex gap-2 items-center">
              {customerSig ? (
                <div className="relative w-24 h-16 border border-border rounded overflow-hidden bg-white">
                  <img src={customerSig} alt="Customer sig" className="w-full h-full object-contain" />
                  <button onClick={() => onCustomerSigChange(undefined)}
                    className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs px-1 rounded-bl">✕</button>
                </div>
              ) : (
                <button onClick={() => handleImageUpload(onCustomerSigChange)}
                  className="w-24 h-16 border-2 border-dashed border-border rounded flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors">
                  <Upload className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">Upload</span>
                </button>
              )}
            </div>
          </div>

          {/* Company Stamp */}
          <div>
            <Label className="text-xs mb-1 block">Company Stamp</Label>
            <div className="flex gap-2 items-center">
              {companyStamp ? (
                <div className="relative w-24 h-24 border border-border rounded overflow-hidden bg-white">
                  <img src={companyStamp} alt="Stamp" className="w-full h-full object-contain" />
                  <button onClick={() => onCompanyStampChange(undefined)}
                    className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs px-1 rounded-bl">✕</button>
                </div>
              ) : (
                <button onClick={() => handleImageUpload(onCompanyStampChange)}
                  className="w-24 h-24 border-2 border-dashed border-border rounded flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors">
                  <Upload className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">Upload</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Display Options */}
      <section className="glass-panel rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-primary mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4" /> Display Options
        </h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Paper Size</Label>
            <Select value={style.paperSize} onValueChange={v => update('paperSize', v as 'a4' | 'letter')}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Header Layout</Label>
            <Select value={style.headerLayout} onValueChange={v => update('headerLayout', v as any)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left Aligned</SelectItem>
                <SelectItem value="center">Centered</SelectItem>
                <SelectItem value="split">Split</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {[
            { key: 'showLogo' as const, label: 'Show Logo' },
            { key: 'showBankDetails' as const, label: 'Show Bank Details' },
            { key: 'showTerms' as const, label: 'Show Terms & Conditions' },
            { key: 'showAmountInWords' as const, label: 'Amount in Words' },
            { key: 'showSignature' as const, label: 'Signature Fields' },
            { key: 'tableBordered' as const, label: 'Table Borders' },
          ].map(opt => (
            <div key={opt.key} className="flex items-center justify-between">
              <Label className="text-xs">{opt.label}</Label>
              <Switch checked={style[opt.key]} onCheckedChange={v => update(opt.key, v)} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
