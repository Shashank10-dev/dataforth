import { FileUp, Image as ImageIcon, Briefcase, Code, FileText, LayoutTemplate, Wrench, Activity } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ToolItem {
  name: string;
  description: string;
  keywords: string[];
  href: string;
}

export interface CategoryItem {
  name: string;
  title: string;
  description: string;
  href: string;
  color: string;
  icon: LucideIcon;
  tools: ToolItem[];
}

export const categories: CategoryItem[] = [
  {
    name: 'PDF',
    title: 'PDF Tools',
    description: 'Merge, compress, and convert PDF documents securely.',
    href: '/pdf-tools',
    color: 'bg-lavender text-ink',
    icon: FileUp,
    tools: [
      { 
        name: 'Compress PDF', 
        description: 'Reduce PDF file size securely in your browser.', 
        keywords: ['shrink pdf', 'reduce pdf size', 'make pdf smaller', 'compressor', 'optimize pdf', 'squash pdf'], 
        href: '/pdf-tools/compress-pdf' 
      },
      { 
        name: 'Merge PDF', 
        description: 'Combine multiple PDFs into a single file completely locally.', 
        keywords: ['combine pdf', 'join pdf', 'append pdf', 'bind pdf', 'pdf merger', 'mix pdf'], 
        href: '/pdf-tools/merge-pdf' 
      },
      { 
        name: 'Split PDF', 
        description: 'Extract specific pages or split a PDF into separate files.', 
        keywords: ['extract pdf pages', 'separate pdf pages', 'split pdf into multiple files', 'cut pdf pages'], 
        href: '/pdf-tools/split-pdf'
      },
    ]
  },
  {
    name: 'Image',
    title: 'Image Tools',
    description: 'Remove backgrounds, convert formats, and compress photos.',
    href: '/image-tools',
    color: 'bg-peach text-ink',
    icon: ImageIcon,
    tools: [
      { 
        name: 'Compress Image', 
        description: 'Reduce image file size without losing quality.', 
        keywords: ['shrink photo', 'reduce image', 'make picture smaller', 'jpeg compress', 'png compress'], 
        href: '/image-tools/compress-image' 
      },
      { 
        name: 'HEIC to JPG', 
        description: 'Convert iPhone HEIC photos to JPG format.', 
        keywords: ['iphone photo to jpg', 'apple image converter', 'heif to jpeg', 'heic converter'], 
        href: '/image-tools/convert-heic-to-jpg' 
      },
      { 
        name: 'Remove Background', 
        description: 'Erase backgrounds from images automatically using AI.', 
        keywords: ['transparent background', 'erase background', 'bg remover', 'cutout image', 'magic wand', 'png transparent'], 
        href: '/image-tools/remove-background' 
      },
    ]
  },
  {
    name: 'Document',
    title: 'Document Tools',
    description: 'Convert between different document formats locally.',
    href: '/document-tools',
    color: 'bg-[#FCD34D] text-ink',
    icon: FileText,
    tools: [
      { 
        name: 'Markdown Converter', 
        description: 'Convert Word, PowerPoint, Excel, and PDF files into Markdown.', 
        keywords: ['docx to md', 'pdf to markdown', 'excel to md', 'ppt to markdown', 'convert document'], 
        href: '/document-tools/markdown-converter' 
      },
      { 
        name: 'Markdown Viewer', 
        description: 'View, format, and render Markdown files entirely in your browser.', 
        keywords: ['read md file', 'markdown preview', 'render markdown', 'open md', 'md editor'], 
        href: '/document-tools/markdown-viewer' 
      },
    ]
  },
  {
    name: 'Career',
    title: 'Career Tools',
    description: 'Build your resume and prepare for your next job.',
    href: '/career-tools',
    color: 'bg-[#E0D4FF] text-ink',
    icon: LayoutTemplate,
    tools: [
      { 
        name: 'Resume Builder', 
        description: 'Create a professional resume in minutes.', 
        keywords: ['cv maker', 'build resume', 'job application', 'resume generator', 'resume creator'], 
        href: '/career-tools/resume-builder' 
      },
    ]
  },
  {
    name: 'Finance',
    title: 'Finance Calculators',
    description: 'Calculate loans, ROI, and plan your budget easily.',
    href: '/finance-tools',
    color: 'bg-sage text-ink',
    icon: FileText,
    tools: [
      { 
        name: 'EMI Calculator', 
        description: 'Calculate Equated Monthly Installments for loans.', 
        keywords: ['loan calculator', 'mortgage calculator', 'car loan', 'home loan', 'monthly payment'], 
        href: '/finance-tools/emi-calculator' 
      },
      { 
        name: 'Salary Calculator', 
        description: 'Convert CTC to take-home salary and breakdown deductions.', 
        keywords: ['take home salary', 'ctc calculator', 'net pay', 'in hand salary'], 
        href: '/finance-tools/salary-calculator' 
      },
      { 
        name: 'Salary Structure', 
        description: 'Generate formatted salary breakups for offer letters.', 
        keywords: ['salary breakup', 'ctc structure', 'salary structuring template', 'offer letter salary breakdown'], 
        href: '/finance-tools/salary-structure-generator' 
      },
    ]
  },
  {
    name: 'Business',
    title: 'Business Generators',
    description: 'Generate invoices, signatures, and essential business docs.',
    href: '/business-tools',
    color: 'bg-powder text-ink',
    icon: Briefcase,
    tools: [
      { 
        name: 'GST Invoice', 
        description: 'Generate compliant GST invoices for Indian businesses.', 
        keywords: ['tax invoice', 'gst bill maker', 'b2b invoice', 'generate bill', 'india gst'], 
        href: '/business-tools/gst-invoice-generator' 
      },
      { 
        name: 'Freelancer Invoice', 
        description: 'Create clean, professional invoices for freelance work.', 
        keywords: ['simple invoice', 'contractor bill', 'freelance bill', 'invoice maker', 'receipt generator'], 
        href: '/business-tools/freelancer-invoice-generator' 
      },
    ]
  },
  {
    name: 'Developer',
    title: 'Developer Utilities',
    description: 'Format JSON, encode Base64, and quickly hash strings.',
    href: '/developer-tools',
    color: 'bg-[#F3E8E0] text-ink',
    icon: Code,
    tools: [
      { 
        name: 'JSON Formatter', 
        description: 'Format, validate, and prettify JSON strings.', 
        keywords: ['beautify json', 'json validator', 'parse json', 'pretty print json', 'format json'], 
        href: '/developer-tools/json-formatter' 
      },
      { 
        name: 'Regex Tester', 
        description: 'Test and debug regular expressions in the browser.', 
        keywords: ['regex matcher', 'regular expression', 'regex evaluator', 'test regex', 'match string'], 
        href: '/developer-tools/regex-tester' 
      },
      { 
        name: 'Bulk UUID Generator', 
        description: 'Generate thousands of random UUIDs/GUIDs instantly.', 
        keywords: ['guid generator', 'v4 uuid', 'random id maker', 'bulk guid', 'unique identifier'], 
        href: '/developer-tools/uuid-generator' 
      },
    ]
  },
  {
    name: 'WalkMe',
    title: 'WalkMe Tools',
    description: 'Technical tools for WalkMe consultants and builders.',
    href: '/walkme-tools',
    color: 'bg-[#A7F3D0] text-ink',
    icon: Wrench,
    tools: [
      { 
        name: 'Selector Analyzer', 
        description: 'Analyze WalkMe jQuery selectors for robustness and fragility.', 
        keywords: ['css selector', 'walkme builder', 'element selector', 'jquery analyzer', 'selector robustness'], 
        href: '/walkme-tools/selector-analyzer' 
      },
    ]
  }
];
