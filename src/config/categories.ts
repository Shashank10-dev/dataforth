import { FileUp, Image as ImageIcon, Briefcase, Code, FileText, LayoutTemplate, Wrench, Activity } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ToolItem {
  name: string;
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
      { name: 'Merge PDF', href: '/pdf-tools/merge-pdf' },
      { name: 'Compress PDF', href: '/pdf-tools/compress-pdf' },
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
      { name: 'Markdown Converter', href: '/document-tools/markdown-converter' },
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
      { name: 'Compress Image', href: '/image-tools/compress-image' },
      { name: 'HEIC to JPG', href: '/image-tools/convert-heic-to-jpg' },
      { name: 'Remove Background', href: '/image-tools/remove-background' },
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
      { name: 'EMI Calculator', href: '/finance-tools/emi-calculator' },
      { name: 'Salary Calculator', href: '/finance-tools/salary-calculator' },
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
      { name: 'GST Invoice', href: '/business-tools/gst-invoice-generator' },
      { name: 'Freelancer Invoice', href: '/business-tools/freelancer-invoice-generator' },
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
      { name: 'JSON Formatter', href: '/developer-tools/json-formatter' },
      { name: 'Regex Tester', href: '/developer-tools/regex-tester' },
      { name: 'Bulk UUID Generator', href: '/developer-tools/uuid-generator' },
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
      { name: 'Resume Builder', href: '/career-tools/resume-builder' },
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
      { name: 'Selector Analyzer', href: '/walkme-tools/selector-analyzer' },
    ]
  }
];
