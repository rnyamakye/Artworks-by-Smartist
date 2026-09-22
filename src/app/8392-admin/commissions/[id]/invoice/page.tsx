"use client";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Send, Mail, MessageSquare } from "lucide-react";
import Loading from "@/ui/Loading";
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from '@/ui/InvoicePDF';
import Link from "next/link";

export default function InvoiceGeneratorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [commission, setCommission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [invoicePrice, setInvoicePrice] = useState("");
  const [momoDetails, setMomoDetails] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [deliveryDetails, setDeliveryDetails] = useState("Estimated delivery time is 3-5 business days after artwork completion.");
  const [invoiceNotes, setInvoiceNotes] = useState("Payment can be made via MTN Mobile Money or Vodafone Cash to the merchant ID above.");
  const [savedMomo, setSavedMomo] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("savedMomoDetails");
    if (saved) {
      setSavedMomo(saved);
    }
    fetchCommission();
  }, [resolvedParams.id]);

  async function fetchCommission() {
    const { data, error } = await supabase.from("commissions").select("*").eq("id", resolvedParams.id).single();
    if (error) {
      toast.error("Failed to load commission details");
      router.push("/8392-admin/commissions");
    } else {
      setCommission(data);
      // Auto-generate reference ID based on the UUID
      setReferenceId(data.id.substring(0, 8).toUpperCase());
    }
    setLoading(false);
  }

  const generatePDFBlob = async () => {
    if (!commission) return null;
    
    if (momoDetails) {
      localStorage.setItem("savedMomoDetails", momoDetails);
      setSavedMomo(momoDetails);
    }

    const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = new Date().toLocaleDateString();
    
    return await pdf(
      <InvoicePDF 
        commission={commission}
        price={invoicePrice}
        notes={invoiceNotes}
        deliveryDetails={deliveryDetails}
        momoDetails={momoDetails}
        invoiceNumber={invoiceNumber}
        referenceId={referenceId}
        date={date}
      />
    ).toBlob();
  };

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await generatePDFBlob();
      if (!blob) throw new Error("Failed to generate PDF");
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${commission.name.replace(/\s+/g, '_')}_${referenceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Invoice PDF downloaded successfully!");
    } catch (err: any) {
      toast.error(err.message);
    }
    setIsGenerating(false);
  };

  const uploadPDFAndGetLink = async () => {
    const blob = await generatePDFBlob();
    if (!blob) return null;

    const fileName = `invoice_${commission.name.replace(/\s+/g, '_')}_${referenceId}.pdf`;
    const { error } = await supabase.storage.from("invoices").upload(fileName, blob, {
      contentType: 'application/pdf',
      upsert: true
    });

    if (error) {
      toast.error("Failed to upload invoice to cloud: " + error.message);
      return null;
    }

    const { data } = supabase.storage.from("invoices").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const generateInvoiceMessage = (pdfLink: string) => {
    return `Hi ${commission.name},\n\nThank you for your commission request for a ${commission.size} ${commission.subject} artwork.\n\nBased on your description, the total price is ${invoicePrice}.\n\nYour official invoice and terms are attached below:\n${pdfLink}\n\n${invoiceNotes}\n\nBest regards,\nSmart Masterpiece`;
  };

  const handleShareEmail = async () => {
    setIsGenerating(true);
    const pdfLink = await uploadPDFAndGetLink();
    setIsGenerating(false);
    if (!pdfLink) return;

    const subject = encodeURIComponent(`Artwork Commission Invoice [${referenceId}]`);
    const body = encodeURIComponent(generateInvoiceMessage(pdfLink));
    window.location.href = `mailto:${commission.email}?subject=${subject}&body=${body}`;
  };

  const handleShareWhatsApp = async () => {
    if (!commission.phone) {
      toast.error("No phone number provided for this commission.");
      return;
    }
    setIsGenerating(true);
    const pdfLink = await uploadPDFAndGetLink();
    setIsGenerating(false);
    if (!pdfLink) return;

    const formattedPhone = commission.phone.replace(/\D/g, '');
    const text = encodeURIComponent(generateInvoiceMessage(pdfLink));
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  if (loading) return <Loading />;
  if (!commission) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/8392-admin/commissions" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Commissions
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Generate Invoice for {commission.name}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Payment Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price / Quote</label>
              <input
                type="text"
                value={invoicePrice}
                onChange={(e) => setInvoicePrice(e.target.value)}
                placeholder="GH₵ 1,500.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MoMo Number / Merchant ID</label>
              <input
                type="text"
                value={momoDetails}
                onChange={(e) => setMomoDetails(e.target.value)}
                placeholder="MTN: 0547348350 (John Doe)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
              {savedMomo && savedMomo !== momoDetails && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <span>Saved:</span>
                  <button 
                    onClick={() => setMomoDetails(savedMomo)}
                    className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700 transition"
                  >
                    {savedMomo}
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
              <input
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Details</label>
              <input
                type="text"
                value={deliveryDetails}
                onChange={(e) => setDeliveryDetails(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Notes</label>
              <textarea
                value={invoiceNotes}
                onChange={(e) => setInvoiceNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={handleExportPDF}
            disabled={isGenerating}
            className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition flex justify-center items-center gap-2 disabled:bg-gray-400"
          >
            <Download className="w-4 h-4" /> 
            {isGenerating ? "Processing..." : "Export PDF"}
          </button>
          
          <div className="w-full sm:w-px h-px sm:h-8 bg-gray-200 mx-2"></div>

          <button 
            onClick={handleShareEmail}
            disabled={isGenerating}
            className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex justify-center items-center gap-2 disabled:bg-indigo-400"
          >
            <Mail className="w-4 h-4" /> 
            Share via Email
          </button>
          
          {commission.phone && (
            <button 
              onClick={handleShareWhatsApp}
              disabled={isGenerating}
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition flex justify-center items-center gap-2 disabled:bg-green-400"
            >
              <MessageSquare className="w-4 h-4" /> 
              Share via WhatsApp
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
