import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottom: '2 solid #f0f0f0',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },
  businessInfo: {
    textAlign: 'right',
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111',
    borderBottom: '1 solid #eee',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    flex: 1,
  },
  priceBlock: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  policyBlock: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1 solid #eee',
    fontSize: 10,
    color: '#666',
  },
  policyTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 11,
    color: '#333',
  }
});

export const InvoicePDF = ({ 
  commission, 
  price, 
  notes, 
  deliveryDetails,
  momoDetails,
  invoiceNumber,
  referenceId,
  date 
}: { 
  commission: any; 
  price: string; 
  notes: string;
  deliveryDetails: string;
  momoDetails: string;
  invoiceNumber: string;
  referenceId: string;
  date: string;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={{ marginTop: 10, color: '#666' }}>Invoice #: {invoiceNumber}</Text>
          <Text style={{ color: '#666', marginTop: 2 }}>Ref ID: {referenceId}</Text>
          <Text style={{ color: '#666', marginTop: 2 }}>Date: {date}</Text>
        </View>
        <View style={styles.businessInfo}>
          <Text style={{ fontWeight: 'bold', color: '#111' }}>Smart Masterpiece</Text>
          <Text>Kumasi, Ghana</Text>
          <Text>smartmasterpiece7@gmail.com</Text>
          <Text>+233 54 734 8350</Text>
        </View>
      </View>

      {/* Bill To */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billed To</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{commission.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{commission.email}</Text>
        </View>
        {commission.phone && (
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{commission.phone}</Text>
          </View>
        )}
      </View>

      {/* Commission Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Artwork Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Subject:</Text>
          <Text style={styles.value}>{commission.subject}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Size:</Text>
          <Text style={styles.value}>{commission.size}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{commission.description}</Text>
        </View>
      </View>

      {/* Delivery & Payment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery & Payment</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Method:</Text>
          <Text style={styles.value}>{commission.delivery_method || 'Standard Shipping'}</Text>
        </View>
        {deliveryDetails && (
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Details:</Text>
            <Text style={styles.value}>{deliveryDetails}</Text>
          </View>
        )}
        {momoDetails && (
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={styles.label}>MoMo / Merchant:</Text>
            <Text style={[styles.value, { fontWeight: 'bold' }]}>{momoDetails}</Text>
          </View>
        )}
        <View style={[styles.row, { marginTop: 10 }]}>
          <Text style={styles.label}>Payment Notes:</Text>
          <Text style={styles.value}>{notes}</Text>
        </View>
      </View>

      {/* Total Price */}
      <View style={styles.priceBlock}>
        <Text style={styles.priceLabel}>Total Amount Due</Text>
        <Text style={styles.priceValue}>{price}</Text>
      </View>

      {/* Policies */}
      <View style={styles.policyBlock}>
        <Text style={styles.policyTitle}>Refund & Return Policy</Text>
        <Text>
          Custom commission artworks are non-refundable once work has commenced. If the artwork arrives damaged during shipping, please contact us within 7 days of delivery with photos of the damage and packaging. We will assess the situation and offer a repair, replacement, or partial refund depending on the severity of the damage. By proceeding with payment, you agree to these terms.
        </Text>
      </View>

    </Page>
  </Document>
);
