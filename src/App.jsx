import React, { useState } from 'react';
import { Search, TrendingUp, Building2, Users, Briefcase, Network, AlertTriangle, Download, Play, Loader, CheckCircle, AlertCircle, Target, Zap, RefreshCw, Mail, Linkedin, Copy, ExternalLink, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function GurgaonLeadIntelligenceDashboard() {
  const [isResearching, setIsResearching] = useState(false);
  const [researchProgress, setResearchProgress] = useState([]);
  const [leads, setLeads] = useState([]);
  const [lastRunDate, setLastRunDate] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [customSearch, setCustomSearch] = useState('');
  const [activeResearch, setActiveResearch] = useState({});
  const [showEmailPreview, setShowEmailPreview] = useState(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Major anchor tenants
  const anchorTenants = [
    {
      name: 'Google',
      location: 'Atrium Place (617,000 sq ft)',
      leaseDate: 'Q4 2025',
      category: 'Technology',
      ecosystemSize: 'Large'
    },
    {
      name: 'IBM',
      location: 'Golf Course Extension Road (230,000 sq ft)',
      leaseDate: 'January 2026',
      category: 'Technology/Consulting',
      ecosystemSize: 'Large'
    },
    {
      name: 'Nagarro',
      location: 'Udyog Vihar (700,000 sq ft)',
      leaseDate: 'January 2025',
      category: 'IT Services',
      ecosystemSize: 'Medium'
    }
  ];

  // Competitors to EXCLUDE
  const competitorList = [
    'Table Space', 'WeWork', 'Awfis', '91springboard', 'Smartworks', 'Innov8',
    'AltF Coworking', 'Workzone', 'Incuspaze', 'Beyond Just Work',
    'Vatika Business Centre', 'Supreme Work', 'Just Office', 'CorporatEdge',
    'myHQ', 'Regus', 'Spaces', 'The Office Pass'
  ];

  const researchSignals = [
    {
      id: 'facility-hiring',
      name: 'Facility Manager Hiring',
      description: 'Companies hiring facility/office managers in Gurgaon',
      query: '"facility manager" OR "office manager" OR "real estate manager" hiring Gurgaon site:linkedin.com 2026',
      weight: 0.95,
      category: 'hiring',
      icon: '👔',
      color: 'bg-blue-500'
    },
    {
      id: 'funding',
      name: 'Recent Funding',
      description: 'Gurgaon startups that raised Series B+ funding',
      query: 'Gurgaon startup funding "Series B" OR "Series C" OR "Series D" 2026 office',
      weight: 0.85,
      category: 'funding',
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      id: 'bulk-hiring',
      name: 'Bulk Hiring',
      description: 'Companies hiring 10+ people (expansion signal)',
      query: 'Gurgaon company hiring 10 OR 20 OR 50 positions 2026 -"coworking" -"workspace provider"',
      weight: 0.80,
      category: 'hiring',
      icon: '👥',
      color: 'bg-purple-500'
    },
    {
      id: 'expansion',
      name: 'Expansion Announcements',
      description: 'Companies announcing Gurgaon expansion',
      query: '"expanding to Gurgaon" OR "new Gurgaon office" OR "Gurgaon operations" 2026',
      weight: 0.95,
      category: 'expansion',
      icon: '📈',
      color: 'bg-red-500'
    },
    {
      id: 'gcc',
      name: 'GCC Setup',
      description: 'Global companies setting up GCCs in Gurgaon',
      query: 'GCC "Global Capability Center" Gurgaon India 2026 setup office',
      weight: 0.90,
      category: 'gcc',
      icon: '🌍',
      color: 'bg-indigo-500'
    },
    {
      id: 'google-ecosystem',
      name: 'Google Ecosystem',
      description: 'Google vendors, partners, service providers',
      query: 'Google India vendor OR partner OR supplier Gurgaon office cloud',
      weight: 0.85,
      category: 'ecosystem',
      anchor: 'Google',
      icon: '🔗',
      color: 'bg-yellow-500'
    },
    {
      id: 'ibm-ecosystem',
      name: 'IBM Ecosystem',
      description: 'IBM partners, system integrators, vendors',
      query: 'IBM India partner OR "business partner" OR integrator Gurgaon office',
      weight: 0.85,
      category: 'ecosystem',
      anchor: 'IBM',
      icon: '🔗',
      color: 'bg-cyan-500'
    }
  ];

  const addProgress = (message, status = 'info') => {
    setResearchProgress(prev => [...prev, {
      message,
      status,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const isCompetitor = (companyName) => {
    const lowerName = companyName.toLowerCase();
    return competitorList.some(competitor =>
      lowerName.includes(competitor.toLowerCase())
    );
  };

  const analyzeLeadQuality = (signals) => {
    const totalWeight = signals.reduce((sum, s) => sum + s.weight, 0);
    const maxWeight = 0.95 * signals.length;
    const score = Math.round((totalWeight / maxWeight) * 100);

    if (score >= 85) return { priority: 'HOT', color: 'bg-red-500', action: 'Contact Today', timeline: 'Immediate' };
    if (score >= 70) return { priority: 'WARM', color: 'bg-orange-500', action: 'Contact This Week', timeline: '1-2 weeks' };
    if (score >= 55) return { priority: 'QUALIFIED', color: 'bg-yellow-500', action: 'Add to Pipeline', timeline: '2-4 weeks' };
    return { priority: 'MONITOR', color: 'bg-blue-500', action: 'Track for Future', timeline: '1-2 months' };
  };

  // Generate personalized email content
  const generateEmailContent = (lead) => {
    let subject = '';
    let body = '';

    if (lead.anchor) {
      // Ecosystem lead email
      const anchorInfo = anchorTenants.find(a => a.name === lead.anchor);
      subject = `Office Space Near ${lead.anchor}'s ${lead.estimatedSpace || '617K sq ft'} Gurgaon Campus`;

      body = `Hi Team,

I noticed ${lead.name} is ${lead.relationship === 'Vendor' ? 'a vendor to' : lead.relationship === 'Partner' ? 'a partner with' : 'in the ecosystem of'} ${lead.anchor} - congratulations on the partnership!

As you may know, ${lead.anchor} recently leased ${anchorInfo?.location || 'significant space in Gurgaon'}. Many of their ${lead.relationship?.toLowerCase() || 'partners'} are now establishing proximity for strategic reasons.

${lead.proximityReason ? `Based on your business model, we understand that:\n${lead.proximityReason}\n` : ''}
AIHP has premium office space available near ${lead.anchor}'s new campus:

✓ Move in within 60 days (vs 6-12 months traditional)
✓ Zero CapEx (preserve capital for growth)
✓ Fully managed (focus on your ${lead.anchor} partnership)
✓ ${lead.estimatedSpace || '20,000-50,000 sq ft'} available

We've helped several ${lead.anchor} ecosystem companies establish their Gurgaon presence, including [similar company].

Would you be open to a site tour this week? I can show you spaces that are literally minutes from ${lead.anchor}'s location.

Best regards,
[Your Name]
AIHP - India's First Corporate Landlord
Phone: [Your Phone]
Email: [Your Email]
Website: www.aihp.in`;

    } else if (lead.category === 'funding') {
      // Funding lead email
      subject = `Congrats on the Series ${lead.signal?.includes('Series C') ? 'C' : 'B'}! Office Space for Growth 🎉`;

      body = `Hi Team,

Congratulations on ${lead.name}'s recent funding round! 🎉

As you scale the team, you'll need office space that grows with you without the traditional 6-12 month setup hassle and massive upfront costs.

AIHP specializes in zero-CapEx offices for fast-growing startups:

✓ Ready in 60 days (not 6 months)
✓ Zero capital expenditure (preserve your funding for growth)
✓ Fully managed (your team focuses on product, not facilities)
✓ Flexible and scalable (grow from 20 to 100 people easily)
✓ ${lead.estimatedSpace || '10,000-30,000 sq ft'} available in ${lead.industry === 'Technology' ? 'Cyber City/Udyog Vihar' : 'prime Gurgaon locations'}

Startups like [similar company] went from 20 to 100 people in our space last year without any office headaches.

Quick coffee to discuss your space needs?

Best regards,
[Your Name]
AIHP
Phone: [Your Phone]
Email: [Your Email]`;

    } else if (lead.category === 'hiring' || lead.signal?.toLowerCase().includes('facility manager')) {
      // Hiring/Facility Manager lead email
      subject = `Office Space Solution for ${lead.name}'s Gurgaon Expansion`;

      body = `Hi Team,

I noticed ${lead.name} is hiring ${lead.signal?.includes('facility') ? 'a Facility Manager' : 'multiple positions'} in Gurgaon - congratulations on the expansion!

As you plan your ${lead.signal?.includes('facility') ? 'new or expanded' : 'growing'} office, AIHP can eliminate the typical 6-12 month setup hassle:

✓ Move in within 60 days (fully furnished)
✓ Zero capital expenditure
✓ Managed services included (housekeeping, security, maintenance)
✓ ${lead.estimatedSpace || '15,000-40,000 sq ft'} available
✓ Locations: Udyog Vihar, Cyber City, Golf Course Extension Road

Your Facility Manager can focus on strategy and culture, not building operations - we handle all that.

${lead.industry === 'Manufacturing' ? 'We have experience with manufacturing companies requiring both office and light industrial space.' : ''}
${lead.industry === 'Technology' ? 'We host 500+ tech companies including Fortune 500 firms.' : ''}

Would you be open to a quick call this week?

Best regards,
[Your Name]
AIHP
Phone: [Your Phone]
Email: [Your Email]`;

    } else {
      // Generic expansion lead email
      subject = `Premium Office Space in Gurgaon for ${lead.name}`;

      body = `Hi Team,

I came across ${lead.name}'s ${lead.signal || 'expansion plans in Gurgaon'} and wanted to reach out.

AIHP offers India's first corporate landlord model - fully managed offices with zero CapEx:

✓ Move in: 60 days (vs 6-12 months traditional)
✓ CapEx: Zero (we handle everything)
✓ ${lead.estimatedSpace || '20,000-50,000 sq ft'} available
✓ Locations: Cyber City, Udyog Vihar, Golf Course Extension
✓ 4+ million sq ft portfolio, 500+ clients

${lead.timeline === 'Immediate' ? 'Since your timeline appears urgent, we have ready-to-move spaces available now.' : ''}

Would a site tour this week work for you?

Best regards,
[Your Name]
AIHP - India's First Corporate Landlord
Phone: [Your Phone]
Email: [Your Email]
Website: www.aihp.in`;
    }

    return { subject, body };
  };

  const handleSendEmail = (lead) => {
    setShowEmailPreview(lead);
    setEmailCopied(false);
  };

  const copyEmailToClipboard = (lead) => {
    const { subject, body } = generateEmailContent(lead);
    const fullEmail = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullEmail).then(() => {
      setEmailCopied(true);
      addProgress(`📋 Email template copied for ${lead.name}`, 'success');
      setTimeout(() => setEmailCopied(false), 3000);
    });
  };

  const openInEmailClient = (lead) => {
    const { subject, body } = generateEmailContent(lead);
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleLinkedInSearch = (lead) => {
    // Go directly to company's LinkedIn page
    const companyName = lead.name.replace(/\s+/g, '-').toLowerCase();
    const linkedInUrl = `https://www.linkedin.com/company/${companyName}`;
    window.open(linkedInUrl, '_blank');
  };

  const copyEmailTemplate = (lead) => {
    const { subject, body } = generateEmailContent(lead);
    const fullEmail = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullEmail).then(() => {
      addProgress(`📋 Email template copied for ${lead.name}`, 'success');
    });
  };

  const runSingleResearch = async (signal) => {
    setActiveResearch(prev => ({ ...prev, [signal.id]: true }));
    addProgress(`🔍 Starting research: ${signal.name}...`, 'info');

    try {
      let searchPrompt = '';

      if (signal.category === 'ecosystem') {
        searchPrompt = `You are a B2B lead researcher specializing in commercial real estate. Find companies in the ${signal.anchor} ecosystem in Gurgaon, India that need office space.

**Context:**
- ${signal.anchor} is located at: ${anchorTenants.find(a => a.name === signal.anchor)?.location}
- Target: Companies that benefit from proximity to ${signal.anchor}

**Find 4-6 REAL companies that are:**
1. Direct vendors/suppliers to ${signal.anchor}
2. Technology partners or system integrators
3. Service providers in ${signal.anchor}'s value chain
4. Consulting firms working with ${signal.anchor}

**For EACH company, provide:**
- Exact company name (verify it's a real company)
- Industry/sector
- Specific business relationship with ${signal.anchor}
- Why proximity matters (concrete business reason)
- Realistic office space estimate (based on company size)
- Timeline (based on recent news/hiring/funding)

**CRITICAL EXCLUSIONS:**
- Coworking spaces: ${competitorList.slice(0, 10).join(', ')}
- Real estate companies
- Property management firms

**Output ONLY valid JSON (no markdown, no explanation):**
{
  "companies": [
    {
      "name": "Accenture India",
      "industry": "IT Consulting",
      "signals": "Google Cloud partner, expanding Gurgaon team by 200+",
      "timeline": "Q2 2026",
      "spaceNeeds": "80,000 sq ft",
      "employees": "400+"
    }
  ]
}`;
      } else {
        searchPrompt = `You are a B2B lead researcher for commercial real estate in Gurgaon, India.

**Research Signal:** ${signal.name}
**Description:** ${signal.description}
**Search Context:** ${signal.query}

**Task:** Find 4-6 REAL companies in Gurgaon showing this specific signal.

**Requirements:**
1. Only REAL companies (verify they exist)
2. Must be in Gurgaon or planning Gurgaon expansion
3. Must show concrete evidence of the signal
4. Provide specific, verifiable details
5. Realistic space estimates based on company size

**For EACH company:**
- Exact company name
- Industry/sector
- Specific signal evidence (hiring post, funding round, news article)
- Timeline (based on actual events)
- Space needs (realistic estimate)
- Employee count estimate

**CRITICAL EXCLUSIONS:**
- Coworking/workspace providers: ${competitorList.slice(0, 10).join(', ')}
- Real estate companies
- Property developers

**Output ONLY valid JSON (no markdown, no explanation):**
{
  "companies": [
    {
      "name": "Zomato",
      "industry": "Food Tech",
      "signals": "Hiring Facility Manager for new 50,000 sq ft Gurgaon office, posted Jan 2026",
      "timeline": "Q2 2026",
      "spaceNeeds": "50,000 sq ft",
      "employees": "200+"
    }
  ]
}`;
      }

      // Call backend API (works on Render and locally)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: searchPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        addProgress(`❌ Error searching ${signal.name}`, 'error');
        setActiveResearch(prev => ({ ...prev, [signal.id]: false }));
        return;
      }

      const data = await response.json();

      const fullText = data.choices?.[0]?.message?.content || '';

      let companiesData = { companies: [] };
      try {
        const jsonMatch = fullText.match(/\{[\s\S]*"companies"[\s\S]*\]/);
        if (jsonMatch) {
          companiesData = JSON.parse(jsonMatch[0] + '}');
        }
      } catch (e) {
        console.log('Could not parse JSON');
      }

      if (companiesData.companies && companiesData.companies.length > 0) {
        let validCompanies = 0;

        companiesData.companies.forEach(company => {
          if (isCompetitor(company.name)) {
            addProgress(`🛡️ Filtered out competitor: ${company.name}`, 'info');
            return;
          }

          setLeads(prev => {
            const existing = prev.find(l => l.name === company.name);
            if (existing) {
              return prev.map(l =>
                l.name === company.name
                  ? { ...l, signals: [...l.signals, { ...signal, ...company }] }
                  : l
              );
            } else {
              validCompanies++;
              return [...prev, {
                ...company,
                signals: [{ ...signal, ...company }],
                category: signal.category,
                anchor: signal.anchor || null,
                foundAt: new Date().toISOString()
              }];
            }
          });
        });

        if (validCompanies > 0) {
          addProgress(`✅ Found ${validCompanies} valid leads from ${signal.name}`, 'success');
        } else {
          addProgress(`ℹ️ No valid leads (all were competitors or invalid)`, 'info');
        }
      } else {
        addProgress(`ℹ️ No leads found for ${signal.name}`, 'info');
      }

      setTimeout(() => {
        setLeads(prev => prev.map(lead => ({
          ...lead,
          quality: analyzeLeadQuality(lead.signals)
        })));
      }, 500);

    } catch (error) {
      addProgress(`❌ Error: ${error.message}`, 'error');
      console.error('Research error:', error);
    } finally {
      setActiveResearch(prev => ({ ...prev, [signal.id]: false }));
    }
  };

  const runCustomResearch = async () => {
    if (!customSearch.trim()) {
      addProgress('⚠️ Please enter a search query', 'error');
      return;
    }

    setIsResearching(true);
    addProgress(`🔍 Custom research: "${customSearch}"...`, 'info');

    try {
      const searchPrompt = `You are a B2B lead researcher for commercial real estate in Gurgaon, India.

**Custom Search Query:** "${customSearch}"

**Task:** Find 4-6 REAL companies in Gurgaon that match this search query and need office space.

**Requirements:**
1. Only REAL companies (verify they exist)
2. Must be located in or expanding to Gurgaon
3. Must show concrete office space needs
4. Provide specific, verifiable details
5. Match the search query intent

**For EACH company:**
- Exact company name (real, verifiable)
- Industry/sector
- Specific signal showing office space need
- Timeline (based on actual events/hiring/funding)
- Realistic space estimate (based on company size)
- Employee count estimate

**CRITICAL EXCLUSIONS:**
- Coworking/workspace providers: ${competitorList.slice(0, 10).join(', ')}
- Real estate companies
- Property developers
- Office space leasing companies

**Output ONLY valid JSON (no markdown, no code blocks, no explanation):**
{
  "companies": [
    {
      "name": "PhonePe",
      "industry": "Fintech",
      "signals": "Series C $350M funding, hiring 100+ in Gurgaon",
      "timeline": "Q2 2026",
      "spaceNeeds": "70,000 sq ft",
      "employees": "350+"
    }
  ]
}`;


      // Call backend API (works on Render and locally)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: searchPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        addProgress(`❌ Error with custom search`, 'error');
        setIsResearching(false);
        return;
      }

      const data = await response.json();

      const fullText = data.choices?.[0]?.message?.content || '';

      let companiesData = { companies: [] };
      try {
        const jsonMatch = fullText.match(/\{[\s\S]*"companies"[\s\S]*\]/);
        if (jsonMatch) {
          companiesData = JSON.parse(jsonMatch[0] + '}');
        }
      } catch (e) {
        console.log('Could not parse JSON');
      }

      if (companiesData.companies && companiesData.companies.length > 0) {
        let validCompanies = 0;

        companiesData.companies.forEach(company => {
          if (isCompetitor(company.name)) {
            addProgress(`🛡️ Filtered out competitor: ${company.name}`, 'info');
            return;
          }

          setLeads(prev => {
            const existing = prev.find(l => l.name === company.name);
            if (!existing) {
              validCompanies++;
              return [...prev, {
                ...company,
                signals: [{ name: 'Custom Search', weight: 0.7, ...company }],
                category: 'custom',
                foundAt: new Date().toISOString()
              }];
            }
            return prev;
          });
        });

        addProgress(`✅ Found ${validCompanies} leads from custom search`, 'success');

        setTimeout(() => {
          setLeads(prev => prev.map(lead => ({
            ...lead,
            quality: analyzeLeadQuality(lead.signals)
          })));
        }, 500);
      } else {
        addProgress(`ℹ️ No leads found for custom search`, 'info');
      }

    } catch (error) {
      addProgress(`❌ Error: ${error.message}`, 'error');
      console.error('Research error:', error);
    } finally {
      setIsResearching(false);
    }
  };

  const runFullResearch = async () => {
    setIsResearching(true);
    addProgress('🚀 Starting full AI research scan...', 'info');
    addProgress('🛡️ Filtering out competitors (Table Space, WeWork, etc.)', 'info');

    for (const signal of researchSignals) {
      await runSingleResearch(signal);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setLastRunDate(new Date());
    addProgress('✅ Full research complete!', 'success');
    setIsResearching(false);
  };

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      totalLeads: leads.length,
      hotLeads: leads.filter(l => l.quality?.priority === 'HOT').length,
      ecosystemLeads: leads.filter(l => l.category === 'ecosystem').length,
      leads: leads.map(lead => ({
        company: lead.name,
        industry: lead.industry,
        priority: lead.quality?.priority,
        category: lead.category,
        anchorTenant: lead.anchor || 'N/A',
        signals: lead.signals.map(s => s.name),
        proximityReason: lead.proximityReason || 'N/A',
        timeline: lead.timeline,
        estimatedSpace: lead.estimatedSpace,
        contactStrategy: lead.contactStrategy || lead.signals[0]?.contactStrategy
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gurgaon-leads-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Export to PDF with clickable links
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138); // Blue
    doc.text('AIHP Lead Intelligence Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Leads: ${filteredLeads.length}`, 14, 34);

    // Table data
    const tableData = filteredLeads.map(lead => [
      lead.name,
      lead.industry || 'N/A',
      lead.signals?.[0]?.signals || lead.signals?.[0]?.signal || 'N/A',
      lead.spaceNeeds || lead.estimatedSpace || 'N/A',
      lead.timeline || 'N/A',
      lead.quality?.priority || 'N/A',
      `https://www.linkedin.com/company/${lead.name.replace(/\s+/g, '-').toLowerCase()}`
    ]);

    doc.autoTable({
      startY: 40,
      head: [['Company', 'Industry', 'Signal', 'Space Needs', 'Timeline', 'Priority', 'LinkedIn']],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      columnStyles: {
        6: { textColor: [37, 99, 235] } // Blue for LinkedIn links
      },
      didDrawCell: (data) => {
        // Make LinkedIn column clickable
        if (data.column.index === 6 && data.cell.section === 'body') {
          const link = data.cell.text[0];
          doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: link });
        }
      }
    });

    doc.save(`aihp-leads-${new Date().toISOString().split('T')[0]}.pdf`);
    addProgress('📄 Exported to PDF with clickable links', 'success');
    setShowExportMenu(false);
  };

  // Export to Excel with clickable links
  const exportToExcel = () => {
    const excelData = filteredLeads.map(lead => ({
      'Company Name': lead.name,
      'Industry': lead.industry || 'N/A',
      'Signal': lead.signals?.[0]?.signals || lead.signals?.[0]?.signal || 'N/A',
      'Space Needs': lead.spaceNeeds || lead.estimatedSpace || 'N/A',
      'Employees': lead.employees || 'N/A',
      'Timeline': lead.timeline || 'N/A',
      'Priority': lead.quality?.priority || 'N/A',
      'LinkedIn': `https://www.linkedin.com/company/${lead.name.replace(/\s+/g, '-').toLowerCase()}`,
      'Company Website': `https://www.google.com/search?q=${encodeURIComponent(lead.name + ' official website')}`
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);

    // Make LinkedIn and Website columns clickable
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const linkedinCell = XLSX.utils.encode_cell({ r: R, c: 7 }); // LinkedIn column
      const websiteCell = XLSX.utils.encode_cell({ r: R, c: 8 }); // Website column

      if (ws[linkedinCell]) {
        ws[linkedinCell].l = { Target: ws[linkedinCell].v };
      }
      if (ws[websiteCell]) {
        ws[websiteCell].l = { Target: ws[websiteCell].v };
      }
    }

    // Set column widths
    ws['!cols'] = [
      { wch: 25 }, // Company Name
      { wch: 20 }, // Industry
      { wch: 40 }, // Signal
      { wch: 15 }, // Space Needs
      { wch: 12 }, // Employees
      { wch: 12 }, // Timeline
      { wch: 10 }, // Priority
      { wch: 50 }, // LinkedIn
      { wch: 50 }  // Website
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, `aihp-leads-${new Date().toISOString().split('T')[0]}.xlsx`);

    addProgress('📊 Exported to Excel with clickable links', 'success');
    setShowExportMenu(false);
  };

  const filteredLeads = leads.filter(lead => {
    if (activeTab === 'all') return true;
    if (activeTab === 'ecosystem') return lead.category === 'ecosystem';
    if (activeTab === 'hot') return lead.quality?.priority === 'HOT';
    if (activeTab === 'hiring') return lead.category === 'hiring';
    if (activeTab === 'funding') return lead.category === 'funding';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">AI Lead Intelligence Dashboard</h1>
                <p className="text-slate-600">Automated research with one-click email & LinkedIn outreach</p>
              </div>
            </div>
            {lastRunDate && (
              <div className="text-right">
                <div className="text-sm text-slate-500">Last Full Scan</div>
                <div className="text-lg font-semibold text-slate-800">
                  {lastRunDate.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Competitor Filter Notice */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-orange-900 mb-1">Competitor Filtering Active</div>
                <div className="text-sm text-orange-800">
                  Auto-filtering {competitorList.length} competitors: Table Space, WeWork, Awfis, and other workspace providers.
                </div>
              </div>
            </div>
          </div>

          {/* Manual Research Controls */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Manual Research Controls</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {researchSignals.map((signal) => (
                <button
                  key={signal.id}
                  onClick={() => runSingleResearch(signal)}
                  disabled={activeResearch[signal.id]}
                  className={`${signal.color} text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-between gap-2`}
                >
                  <div className="flex items-center gap-2">
                    <span>{signal.icon}</span>
                    <span className="text-sm">{signal.name}</span>
                  </div>
                  {activeResearch[signal.id] && (
                    <Loader className="w-4 h-4 animate-spin flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Search */}
            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🔍 Custom Search Query
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSearch}
                  onChange={(e) => setCustomSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && runCustomResearch()}
                  placeholder="e.g., 'fintech companies Gurgaon Series B' or 'healthcare GCC India'"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={runCustomResearch}
                  disabled={isResearching}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-slate-400 flex items-center gap-2"
                >
                  {isResearching ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={runFullResearch}
              disabled={isResearching}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:from-slate-400 disabled:to-slate-400 flex items-center justify-center gap-2"
            >
              {isResearching ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  AI Researching All Signals...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run Full AI Research (All 7 Signals)
                </>
              )}
            </button>
            {leads.length > 0 && (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showExportMenu && (
                    <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-2xl border-2 border-slate-200 py-2 min-w-[200px] z-50">
                      <button
                        onClick={exportToPDF}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 text-slate-700"
                      >
                        <FileText className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="font-semibold">Export to PDF</div>
                          <div className="text-xs text-slate-500">With clickable links</div>
                        </div>
                      </button>
                      <button
                        onClick={exportToExcel}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center gap-3 text-slate-700"
                      >
                        <FileSpreadsheet className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-semibold">Export to Excel</div>
                          <div className="text-xs text-slate-500">With clickable links</div>
                        </div>
                      </button>
                      <button
                        onClick={exportReport}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                      >
                        <Download className="w-5 h-5 text-slate-600" />
                        <div>
                          <div className="font-semibold">Export to JSON</div>
                          <div className="text-xs text-slate-500">Raw data format</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setLeads([])}
                  className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Research Progress */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Live Research Feed
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {researchProgress.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="mb-2">Ready to research</p>
                    <p className="text-xs">Click any button above to start</p>
                  </div>
                ) : (
                  researchProgress.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm p-2 bg-slate-50 rounded">
                      {item.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />}
                      {item.status === 'error' && <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />}
                      {item.status === 'info' && <div className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <div className="text-slate-700">{item.message}</div>
                        <div className="text-xs text-slate-400">{item.timestamp}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Stats */}
            {leads.length > 0 && (
              <div className="bg-white rounded-lg shadow-xl p-6 mt-6">
                <h3 className="font-semibold text-slate-800 mb-4">Research Results</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Leads</span>
                    <span className="text-2xl font-bold text-slate-800">{leads.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">🔴 Hot Leads</span>
                    <span className="text-xl font-bold text-red-600">
                      {leads.filter(l => l.quality?.priority === 'HOT').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">🟡 Warm Leads</span>
                    <span className="text-xl font-bold text-orange-600">
                      {leads.filter(l => l.quality?.priority === 'WARM').length}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Network className="w-4 h-4" />
                        Ecosystem Leads
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {leads.filter(l => l.category === 'ecosystem').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Leads Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Discovered Leads ({filteredLeads.length})
                </h2>
              </div>

              {/* Filter Tabs */}
              {leads.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    All ({leads.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('hot')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'hot'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    🔥 Hot ({leads.filter(l => l.quality?.priority === 'HOT').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('ecosystem')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ecosystem'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    🔗 Ecosystem ({leads.filter(l => l.category === 'ecosystem').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('hiring')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'hiring'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    👥 Hiring ({leads.filter(l => l.category === 'hiring').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('funding')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'funding'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    💰 Funded ({leads.filter(l => l.category === 'funding').length})
                  </button>
                </div>
              )}

              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No leads discovered yet</p>
                  <p className="text-sm mt-2">Click any research button above to start</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredLeads.map((lead, idx) => (
                    <div key={idx} className="border-2 border-slate-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-800">{lead.name}</h3>
                            {lead.quality && (
                              <span className={`${lead.quality.color} text-white text-xs px-3 py-1 rounded-full font-bold`}>
                                {lead.quality.priority}
                              </span>
                            )}
                            {lead.anchor && (
                              <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-semibold border border-purple-300">
                                {lead.anchor} Ecosystem
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 mb-1">{lead.industry}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-blue-600">{lead.timeline}</div>
                          <div className="text-xs text-slate-500">{lead.estimatedSpace}</div>
                        </div>
                      </div>

                      {lead.proximityReason && (
                        <div className="bg-purple-50 border-l-4 border-purple-500 rounded p-3 mb-3">
                          <div className="text-xs font-semibold text-purple-900 mb-1 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            WHY THEY NEED SPACE NEAR {lead.anchor}:
                          </div>
                          <div className="text-sm text-purple-800">{lead.proximityReason}</div>
                        </div>
                      )}

                      {lead.signal && (
                        <div className="bg-slate-50 rounded p-3 mb-3">
                          <div className="text-sm font-medium text-slate-700 mb-1">Expansion Signal:</div>
                          <div className="text-sm text-slate-600">{lead.signal}</div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        {lead.signals.map((signal, sidx) => (
                          <span key={sidx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-300">
                            {signal.name}
                          </span>
                        ))}
                      </div>

                      <div className="border-t border-slate-200 pt-3 mt-3">
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleSendEmail(lead)}
                            className="col-span-1 text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <Mail className="w-4 h-4" />
                            Send Email
                          </button>
                          <button
                            onClick={() => handleLinkedInSearch(lead)}
                            className="col-span-1 text-sm bg-[#0077B5] text-white px-4 py-2 rounded hover:bg-[#006399] transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </button>
                          <button
                            onClick={() => copyEmailTemplate(lead)}
                            className="col-span-1 text-sm bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Email
                          </button>
                        </div>
                        <div className="text-xs text-slate-500 mt-2 text-center">
                          Email opens in your mail client • LinkedIn searches for decision makers • Copy for CRM
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="bg-white rounded-lg shadow-xl p-6 mt-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            How Email & LinkedIn Buttons Work
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-blue-600 font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Send Email Button
              </div>
              <p className="text-sm text-slate-600">
                Opens your email client (Gmail, Outlook, etc.) with personalized subject and body pre-filled.
                Email is customized based on lead type (ecosystem, funding, hiring). Just click and send!
              </p>
            </div>
            <div>
              <div className="text-[#0077B5] font-semibold mb-2 flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn Button
              </div>
              <p className="text-sm text-slate-600">
                Opens LinkedIn search for decision makers at the company (HR, Facility Manager, CEO, COO).
                Connect with them and send InMail using the personalized message strategy.
              </p>
            </div>
            <div>
              <div className="text-slate-600 font-semibold mb-2 flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Email Button
              </div>
              <p className="text-sm text-slate-600">
                Copies the full personalized email template to clipboard. Paste it into your CRM, sales tool,
                or send via any platform. Perfect for bulk operations.
              </p>
            </div>
          </div>
        </div>

        {/* Email Preview Modal */}
        {showEmailPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Email Template Ready</h3>
                    <p className="text-blue-100 text-sm">for {showEmailPreview.name}</p>
                  </div>
                  <button
                    onClick={() => setShowEmailPreview(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {(() => {
                  const { subject, body } = generateEmailContent(showEmailPreview);
                  return (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Subject:</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800">
                          {subject}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Body:</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-800 whitespace-pre-wrap font-mono text-sm">
                          {body}
                        </div>
                      </div>

                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              <strong>Note:</strong> Replace [Your Name], [Your Phone], and [Your Email] with your actual contact information before sending.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="bg-slate-50 p-6 border-t border-slate-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      copyEmailToClipboard(showEmailPreview);
                    }}
                    className={`flex-1 ${emailCopied ? 'bg-green-600' : 'bg-slate-600'} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                  >
                    {emailCopied ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Email
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      openInEmailClient(showEmailPreview);
                      setShowEmailPreview(null);
                    }}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    Open in Email App
                  </button>
                  <button
                    onClick={() => setShowEmailPreview(null)}
                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                  >
                    Close
                  </button>
                </div>
                <p className="text-xs text-slate-500 text-center mt-3">
                  Copy to paste in Gmail/Outlook web, or open in your default email app
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
