import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff', color: '#111827' },
  header: { borderBottomWidth: 2, borderBottomColor: '#111827', paddingBottom: 16, marginBottom: 16 },
  name: { fontSize: 28, fontWeight: 700, marginBottom: 4, color: '#000000', letterSpacing: -0.5 },
  title: { fontSize: 14, color: '#4B5563', fontWeight: 500, marginBottom: 12 },
  
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  contactItem: { fontSize: 9, color: '#4B5563', marginRight: 12 },
  
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#6B7280', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 4, marginBottom: 8 },
  
  summaryText: { fontSize: 10, lineHeight: 1.5, color: '#1F2937' },
  
  itemBlock: { marginBottom: 12 },
  itemHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  itemTitle: { fontSize: 11, fontWeight: 700, color: '#000000' },
  itemDate: { fontSize: 9, fontWeight: 500, color: '#6B7280' },
  itemSubtitle: { fontSize: 10, fontWeight: 500, color: '#374151', marginBottom: 4 },
  
  bulletList: { paddingLeft: 10 },
  bulletPoint: { flexDirection: 'row', marginBottom: 3 },
  bulletDot: { width: 10, fontSize: 10, color: '#1F2937' },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.4, color: '#1F2937' },
  
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillItem: { fontSize: 10, fontWeight: 500, color: '#1F2937', marginRight: 6, marginBottom: 4 }
});

interface ResumeProps {
  data: {
    personalInfo: { name: string; title: string; email: string; phone: string; location: string; website: string; summary: string; };
    experience: Array<{ id: string; company: string; role: string; startDate: string; endDate: string; description: string; }>;
    education: Array<{ id: string; school: string; degree: string; year: string; }>;
    skills: string;
  }
}

const ResumePDF: React.FC<ResumeProps> = ({ data }) => {
  const { personalInfo, experience, education, skills } = data;

  const validExperiences = experience.filter(exp => exp.role || exp.company);
  const validEducations = education.filter(edu => edu.degree || edu.school);
  const skillsList = skills.split(',').map(s => s.trim()).filter(s => s);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name || 'Your Name'}</Text>
          <Text style={styles.title}>{personalInfo.title || 'Professional Title'}</Text>
          
          <View style={styles.contactRow}>
            {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
            {personalInfo.website && <Text style={styles.contactItem}>{personalInfo.website}</Text>}
          </View>
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {validExperiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {validExperiences.map((exp, i) => (
              <View key={i} style={styles.itemBlock}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{exp.role || 'Job Title'}</Text>
                  <Text style={styles.itemDate}>{exp.startDate}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company || 'Company Name'}</Text>
                
                {exp.description && (
                  <View style={styles.bulletList}>
                    {exp.description.split('\n').filter(line => line.trim() !== '').map((line, j) => (
                      <View key={j} style={styles.bulletPoint}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{line}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {validEducations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {validEducations.map((edu, i) => (
              <View key={i} style={styles.itemBlock}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{edu.degree || 'Degree'}</Text>
                  <Text style={styles.itemDate}>{edu.year}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.school || 'School / University'}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skillsList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {skillsList.map((skill, i) => (
                <Text key={i} style={styles.skillItem}>
                  {skill}{i < skillsList.length - 1 ? ' •' : ''}
                </Text>
              ))}
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
};

export default ResumePDF;
