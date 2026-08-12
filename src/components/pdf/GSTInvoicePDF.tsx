import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff', color: '#000000' },
  titleHeader: { textAlign: 'center', borderBottomWidth: 2, borderBottomColor: '#000000', paddingBottom: 10, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 700, letterSpacing: 2 },
  gstinTop: { fontSize: 9, color: '#666666', marginTop: 4 },
  
  detailsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  detailsCol: { width: '48%' },
  
  sectionLabel: { fontSize: 8, color: '#666666', textTransform: 'uppercase', marginBottom: 4, borderBottomWidth: 1, borderBottomColor: '#eeeeee', paddingBottom: 2 },
  boldText: { fontSize: 11, fontWeight: 700, marginBottom: 2 },
  normalText: { fontSize: 10, color: '#444444', marginBottom: 1 },
  
  tableHeader: { flexDirection: 'row', backgroundColor: '#f9f9f9', borderBottomWidth: 1, borderBottomColor: '#dddddd', paddingVertical: 6, paddingHorizontal: 4, marginTop: 10 },
  thDesc: { flex: 4, fontSize: 9, fontWeight: 700 },
  thHsn: { flex: 1.5, fontSize: 9, fontWeight: 700, textAlign: 'center' },
  thQty: { flex: 1, fontSize: 9, fontWeight: 700, textAlign: 'right' },
  thPrice: { flex: 1.5, fontSize: 9, fontWeight: 700, textAlign: 'right' },
  thGst: { flex: 1, fontSize: 9, fontWeight: 700, textAlign: 'right' },
  thTotal: { flex: 2, fontSize: 9, fontWeight: 700, textAlign: 'right' },
  
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eeeeee', paddingVertical: 8, paddingHorizontal: 4 },
  tdDesc: { flex: 4, fontSize: 9 },
  tdHsn: { flex: 1.5, fontSize: 9, textAlign: 'center' },
  tdQty: { flex: 1, fontSize: 9, textAlign: 'right' },
  tdPrice: { flex: 1.5, fontSize: 9, textAlign: 'right' },
  tdGst: { flex: 1, fontSize: 9, textAlign: 'right', color: '#666666' },
  tdTotal: { flex: 2, fontSize: 9, textAlign: 'right', fontWeight: 500 },
  
  totalsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  totalsLeft: { width: '55%' },
  totalsRight: { width: '40%' },
  
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalLabel: { fontSize: 10, color: '#666666' },
  totalVal: { fontSize: 10, fontWeight: 500 },
  
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 2, borderTopColor: '#000000', paddingTop: 6, marginTop: 4 },
  grandTotalLabel: { fontSize: 12, fontWeight: 700 },
  grandTotalVal: { fontSize: 12, fontWeight: 700 },
  
  footer: { marginTop: 30, borderTopWidth: 1, borderTopColor: '#eeeeee', paddingTop: 10 },
  footerTitle: { fontSize: 9, fontWeight: 700, marginBottom: 2 },
  footerText: { fontSize: 9, color: '#666666', lineHeight: 1.4 }
});

interface GSTInvoiceProps {
  data: {
    invoiceNo: string; date: string; dueDate: string;
    fromName: string; fromEmail: string; fromAddress: string; fromGST: string;
    toName: string; toEmail: string; toAddress: string; toGST: string;
    items: Array<{ description: string; hsn: string; quantity: number; price: number; gstRate: number }>;
    currency: string; notes: string; bankDetails: string;
    subtotal: number; totalGstAmount: number; grandTotal: number;
  }
}

const getCurrencySymbol = (code: string) => {
  switch (code) {
    case 'USD': return '$'; case 'EUR': return '€'; case 'GBP': return '£'; case 'INR': return '₹'; case 'AUD': return 'A$'; case 'CAD': return 'C$'; default: return '$';
  }
};
const formatCurrency = (val: number) => val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const GSTInvoicePDF: React.FC<GSTInvoiceProps> = ({ data }) => {
  const sym = getCurrencySymbol(data.currency);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.titleHeader}>
          <Text style={styles.title}>TAX INVOICE</Text>
          {data.fromGST && <Text style={styles.gstinTop}>GSTIN: {data.fromGST}</Text>}
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailsCol}>
            <Text style={styles.sectionLabel}>Billed By</Text>
            <Text style={styles.boldText}>{data.fromName || 'Your Company Name'}</Text>
            {data.fromAddress && <Text style={styles.normalText}>{data.fromAddress}</Text>}
            {data.fromEmail && <Text style={styles.normalText}>{data.fromEmail}</Text>}
            {data.fromGST && <Text style={styles.normalText}>GSTIN: {data.fromGST}</Text>}
          </View>
          
          <View style={styles.detailsCol}>
            <Text style={styles.sectionLabel}>Billed To</Text>
            <Text style={styles.boldText}>{data.toName || 'Client Company Name'}</Text>
            {data.toAddress && <Text style={styles.normalText}>{data.toAddress}</Text>}
            {data.toEmail && <Text style={styles.normalText}>{data.toEmail}</Text>}
            {data.toGST && <Text style={styles.normalText}>GSTIN: {data.toGST}</Text>}
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailsCol}>
            <Text style={styles.sectionLabel}>Invoice Details</Text>
            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
              <Text style={{ ...styles.normalText, width: 80 }}>Invoice No:</Text>
              <Text style={styles.boldText}>{data.invoiceNo || 'GST-001'}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
              <Text style={{ ...styles.normalText, width: 80 }}>Invoice Date:</Text>
              <Text style={styles.boldText}>{data.date || '-'}</Text>
            </View>
            {data.dueDate && (
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ ...styles.normalText, width: 80 }}>Due Date:</Text>
                <Text style={styles.boldText}>{data.dueDate}</Text>
              </View>
            )}
          </View>
        </View>

        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.thDesc}>Description</Text>
            <Text style={styles.thHsn}>HSN/SAC</Text>
            <Text style={styles.thQty}>Qty</Text>
            <Text style={styles.thPrice}>Rate</Text>
            <Text style={styles.thGst}>GST %</Text>
            <Text style={styles.thTotal}>Amount</Text>
          </View>
          
          {data.items.map((item, i) => {
            const amount = item.quantity * item.price;
            return (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tdDesc}>{item.description || 'Item Description'}</Text>
                <Text style={styles.tdHsn}>{item.hsn || '-'}</Text>
                <Text style={styles.tdQty}>{item.quantity}</Text>
                <Text style={styles.tdPrice}>{sym}{formatCurrency(item.price)}</Text>
                <Text style={styles.tdGst}>{item.gstRate}%</Text>
                <Text style={styles.tdTotal}>{sym}{formatCurrency(amount)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalsContainer}>
          <View style={styles.totalsLeft}>
            {data.bankDetails && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.footerTitle}>Bank Details</Text>
                <Text style={styles.footerText}>{data.bankDetails}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.totalsRight}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalVal}>{sym}{formatCurrency(data.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total GST</Text>
              <Text style={styles.totalVal}>{sym}{formatCurrency(data.totalGstAmount)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Amount</Text>
              <Text style={styles.grandTotalVal}>{sym}{formatCurrency(data.grandTotal)}</Text>
            </View>
          </View>
        </View>

        {data.notes && (
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Terms & Conditions / Notes</Text>
            <Text style={styles.footerText}>{data.notes}</Text>
          </View>
        )}

      </Page>
    </Document>
  );
};

export default GSTInvoicePDF;
