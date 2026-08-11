'use client';

import React, { useState } from 'react';
import { Briefcase, Printer, Plus, Trash2, Mail, Phone, MapPin, Globe, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import AdZone from '@/components/AdZone';

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export default function ResumeBuilderPage() {
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Jane Doe',
    title: 'Senior Software Engineer',
    email: 'jane.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    website: 'github.com/janedoe',
    summary: 'Experienced software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.'
  });

  const [experience, setExperience] = useState<Experience[]>([
    {
      id: '1',
      company: 'Tech Innovators Inc.',
      role: 'Senior Frontend Engineer',
      startDate: '2020 - Present',
      endDate: '',
      description: 'Led the frontend team in migrating a legacy monolithic application to a modern React-based architecture, resulting in a 40% improvement in load times.\nMentored 3 junior developers and established code review guidelines.'
    },
    {
      id: '2',
      company: 'StartupX',
      role: 'Software Engineer',
      startDate: '2018 - 2020',
      endDate: '',
      description: 'Developed and maintained the core user dashboard using Vue.js and Node.js.\nIntegrated third-party payment gateways, processing over $1M in transactions.'
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: '1',
      school: 'University of Technology',
      degree: 'B.S. in Computer Science',
      year: '2014 - 2018'
    }
  ]);

  const [skills, setSkills] = useState('JavaScript, TypeScript, React, Next.js, Node.js, HTML/CSS, Tailwind, Git, AWS');
  const [isExporting, setIsExporting] = useState(false);

  const handleInfoChange = (field: keyof typeof personalInfo, value: string) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperience(experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };
  
  const addExperience = () => {
    setExperience([...experience, { id: Math.random().toString(), company: '', role: '', startDate: '', endDate: '', description: '' }]);
  };
  
  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };
  
  const addEducation = () => {
    setEducation([...education, { id: Math.random().toString(), school: '', degree: '', year: '' }]);
  };
  
  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('document-preview');
    if (!element) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow print:p-0 print:m-0 print:max-w-none">
      
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Resume / CV Builder",
            "operatingSystem": "Any",
            "applicationCategory": "Application",
            "description": "Build a clean, ATS-friendly resume directly in your browser.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          })
        }}
      />
      {/* UI Header (Hidden on Print) */}
      <div className="text-center mb-8 relative print:hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-lavender/40 dark:bg-lavender/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-4xl font-medium mb-4">Resume / CV Builder</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Build a clean, ATS-friendly resume directly in your browser.
        </p>
      </div>
      
      <div className="mb-8 print:hidden">
        <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none max-w-4xl" type="banner" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start font-sans print:block">
        
        {/* Editor Section (Hidden on Print) */}
        <div className="xl:col-span-5 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-6 shadow-sm print:hidden overflow-y-auto max-h-[80vh] custom-scrollbar">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/90 dark:bg-dark-card/90 backdrop-blur pb-4 z-10 border-b border-ink/5 dark:border-white/5">
            <h2 className="text-xl font-medium flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-lavender" /> Edit Details
            </h2>
            <button 
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="bg-ink dark:bg-white text-white dark:text-ink px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isExporting ? (
                <>Generating...</>
              ) : (
                <><Download className="w-4 h-4" /> Download PDF</>
              )}
            </button>
          </div>
          
          <div className="space-y-8">
            
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider opacity-50">Personal Information</h3>
              <input type="text" placeholder="Full Name" value={personalInfo.name} onChange={(e) => handleInfoChange('name', e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 font-bold" />
              <input type="text" placeholder="Professional Title" value={personalInfo.title} onChange={(e) => handleInfoChange('title', e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50" />
              
              <div className="grid grid-cols-2 gap-3">
                <input type="email" placeholder="Email" value={personalInfo.email} onChange={(e) => handleInfoChange('email', e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50" />
                <input type="tel" placeholder="Phone" value={personalInfo.phone} onChange={(e) => handleInfoChange('phone', e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50" />
                <input type="text" placeholder="Location" value={personalInfo.location} onChange={(e) => handleInfoChange('location', e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50" />
                <input type="text" placeholder="Website / LinkedIn" value={personalInfo.website} onChange={(e) => handleInfoChange('website', e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50" />
              </div>
              
              <textarea placeholder="Professional Summary" value={personalInfo.summary} onChange={(e) => handleInfoChange('summary', e.target.value)} rows={3} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 resize-y" />
            </div>
            
            <hr className="border-ink/10 dark:border-white/10" />
            
            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider opacity-50 mb-2">Work Experience</h3>
              {experience.map((exp, index) => (
                <div key={exp.id} className="p-4 bg-cream dark:bg-dark-cream rounded-xl border border-ink/5 dark:border-white/5 space-y-3 relative">
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-red-500 hover:opacity-70 p-1" title="Remove Experience">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <input type="text" placeholder="Job Title" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="w-full bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 font-medium" />
                    <input type="text" placeholder="Company Name" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50" />
                    <input type="text" placeholder="Duration (e.g. 2020 - Present)" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 col-span-2" />
                  </div>
                  
                  <textarea placeholder="Job Description (use new lines for bullet points)" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} rows={4} className="w-full bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 resize-y leading-relaxed" />
                </div>
              ))}
              <button onClick={addExperience} className="flex items-center gap-1 text-sm font-medium text-lavender hover:opacity-80">
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>
            
            <hr className="border-ink/10 dark:border-white/10" />
            
            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider opacity-50 mb-2">Education</h3>
              {education.map((edu, index) => (
                <div key={edu.id} className="p-4 bg-cream dark:bg-dark-cream rounded-xl border border-ink/5 dark:border-white/5 space-y-3 relative">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-red-500 hover:opacity-70 p-1" title="Remove Education">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <input type="text" placeholder="Degree / Certificate" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="w-[calc(100%-2rem)] bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 font-medium" />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="School / University" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className="w-full bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50" />
                    <input type="text" placeholder="Year (e.g. 2014 - 2018)" value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} className="w-full bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50" />
                  </div>
                </div>
              ))}
              <button onClick={addEducation} className="flex items-center gap-1 text-sm font-medium text-lavender hover:opacity-80">
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>
            
            <hr className="border-ink/10 dark:border-white/10" />
            
            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider opacity-50 mb-2">Skills</h3>
              <textarea placeholder="Comma separated list of skills (e.g. JavaScript, React, Node.js)" value={skills} onChange={(e) => setSkills(e.target.value)} rows={3} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 resize-none" />
            </div>

          </div>
        </div>

        {/* Preview / Print Section - 7 columns */}
        {/* We enforce white background and black text specifically for the print preview pane */}
        <div id="document-preview" className="xl:col-span-7 bg-white print:bg-white border border-ink/10 print:border-none shadow-lg print:shadow-none rounded-none p-4 sm:p-12 print:p-0 min-h-[1056px] text-gray-900 font-sans overflow-x-auto">
          
          {/* Header */}
          <header className="border-b-2 border-gray-900 pb-6 mb-6 min-w-[500px]">
            <h1 className="text-4xl font-bold tracking-tight text-black mb-1">{personalInfo.name || 'Your Name'}</h1>
            <h2 className="text-xl text-gray-600 font-medium mb-4">{personalInfo.title || 'Professional Title'}</h2>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              {personalInfo.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" /> {personalInfo.email}
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" /> {personalInfo.phone}
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {personalInfo.location}
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> {personalInfo.website}
                </div>
              )}
            </div>
          </header>
          
          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Professional Summary</h3>
              <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                {personalInfo.summary}
              </p>
            </section>
          )}
          
          {/* Experience */}
          {experience.length > 0 && experience.some(exp => exp.role || exp.company) && (
            <section className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-1">Experience</h3>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-black text-base">{exp.role || 'Job Title'}</h4>
                      <span className="text-xs font-medium text-gray-500 shrink-0 ml-4">{exp.startDate}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-2">{exp.company || 'Company Name'}</div>
                    
                    {exp.description && (
                      <ul className="list-disc pl-4 space-y-1 mt-2">
                        {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                          <li key={i} className="text-sm text-gray-800 leading-relaxed pl-1">{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Education */}
          {education.length > 0 && education.some(edu => edu.degree || edu.school) && (
            <section className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-1">Education</h3>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-black text-sm">{edu.degree || 'Degree'}</h4>
                      <span className="text-xs font-medium text-gray-500 shrink-0 ml-4">{edu.year}</span>
                    </div>
                    <div className="text-sm text-gray-700">{edu.school || 'School / University'}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Skills */}
          {skills && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-1">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.split(',').map((skill, index) => skill.trim() ? (
                  <span key={index} className="text-sm text-gray-800 font-medium">
                    {skill.trim()}{index < skills.split(',').filter(s => s.trim()).length - 1 ? ' • ' : ''}
                  </span>
                ) : null)}
              </div>
            </section>
          )}
          
        </div>
      </div>
  
      {/* FAQ Section */}
      <section className="mb-16 max-w-3xl mx-auto mt-16 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4 font-sans">
          
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Is the generated resume ATS-friendly?</h3>
            <p className="opacity-70 leading-relaxed">Yes, the template is designed with a clean, single-column structure and standard fonts, making it highly readable for Applicant Tracking Systems (ATS).</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">How do I download my resume?</h3>
            <p className="opacity-70 leading-relaxed">Click the "Download PDF" button. The tool will automatically capture a pixel-perfect image of your resume and generate a downloadable PDF file.</p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-3xl mx-auto pb-12 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
          
          <a href="/business-tools/freelancer-invoice-generator" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">Freelancer Invoice</h3>
            <p className="text-sm opacity-60">Create quick freelancer invoices.</p>
          </a>
          <a href="/finance-tools/salary-calculator" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">Salary Calculator</h3>
            <p className="text-sm opacity-60">Calculate your exact in-hand salary.</p>
          </a>
        </div>
      </section>

    </div>
  );
}
