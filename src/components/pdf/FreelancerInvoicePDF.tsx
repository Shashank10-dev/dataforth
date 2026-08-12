import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  invoiceNo: {
    fontSize: 12,
    color: '#666666',
    fontWeight: 500,
  },
  fromSection: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 2,
  },
  contactText: {
    fontSize: 10,
    color: '#444444',
    marginBottom: 2,
  },
  billToRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 20,
    marginBottom: 40,
  },
  sectionLabel: {
    fontSize: 9,
    color: '#888888',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 2,
  },
  dateRow: {
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 8,
    marginBottom: 8,
  },
  thDesc: { flex: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' },
  thQty: { flex: 1, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' },
  thPrice: { flex: 2, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' },
  thTotal: { flex: 2, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingVertical: 12,
  },
  tdDesc: { flex: 4, fontSize: 10 },
  tdQty: { flex: 1, fontSize: 10, textAlign: 'right' },
  tdPrice: { flex: 2, fontSize: 10, textAlign: 'right' },
  tdTotal: { flex: 2, fontSize: 10, textAlign: 'right', fontWeight: 500 },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 40,
  },
  totalBox: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#000000',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 700,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 700,
  },
  notesSection: {
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 20,
  },
  notesText: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.5,
  }
});

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface FreelancerInvoiceProps {
  data: {
    invoiceNo: string;
    date: string;
    dueDate: string;
    fromName: string;
    fromEmail: string;
    fromAddress: string;
    toName: string;
    toEmail: string;
    toAddress: string;
    items: InvoiceItem[];
    currency: string;
    notes: string;
    subtotal: number;
  };
}

const getCurrencySymbol = (code: string) => {
  switch (code) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'INR': return '₹';
    case 'AUD': return 'A$';
    case 'CAD': return 'C$';
    default: return '$';
  }
};

const formatCurrency = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const FreelancerInvoicePDF: React.FC<FreelancerInvoiceProps> = ({ data }) => {
  const sym = getCurrencySymbol(data.currency);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.invoiceNo}>#{data.invoiceNo || 'INV-001'}</Text>
          </View>
          <View style={styles.fromSection}>
            <Text style={styles.companyName}>{data.fromName || 'Your Name / Company'}</Text>
            {data.fromEmail && <Text style={styles.contactText}>{data.fromEmail}</Text>}
            {data.fromAddress && <Text style={styles.contactText}>{data.fromAddress}</Text>}
          </View>
        </View>

        {/* Bill To & Dates */}
        <View style={styles.billToRow}>
          <View>
            <Text style={styles.sectionLabel}>Bill To</Text>
            <Text style={styles.clientName}>{data.toName || 'Client Name'}</Text>
            {data.toEmail && <Text style={styles.contactText}>{data.toEmail}</Text>}
            {data.toAddress && <Text style={styles.contactText}>{data.toAddress}</Text>}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.dateRow}>
              <Text style={styles.sectionLabel}>Date</Text>
              <Text style={styles.contactText}>{data.date || '-'}</Text>
            </View>
            {data.dueDate && (
              <View style={styles.dateRow}>
                <Text style={styles.sectionLabel}>Due Date</Text>
                <Text style={styles.contactText}>{data.dueDate}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Table */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.thDesc}>Description</Text>
            <Text style={styles.thQty}>Qty</Text>
            <Text style={styles.thPrice}>Price</Text>
            <Text style={styles.thTotal}>Total</Text>
          </View>
          
          {data.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tdDesc}>{item.description || 'Item Description'}</Text>
              <Text style={styles.tdQty}>{item.quantity}</Text>
              <Text style={styles.tdPrice}>{sym}{formatCurrency(item.price)}</Text>
              <Text style={styles.tdTotal}>{sym}{formatCurrency(item.quantity * item.price)}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{sym}{formatCurrency(data.subtotal)}</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        )}

      </Page>
    </Document>
  );
};

export default FreelancerInvoicePDF;
