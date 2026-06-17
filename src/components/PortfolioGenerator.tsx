import React, { useState } from 'react';
import { Presentation, Clipboard, CheckCircle2, ChevronRight, Sparkles, BookOpen, UserCheck, Linkedin } from 'lucide-react';
import { CleanShopper, PresentationSlide } from '../types';
import { presentationSlides } from '../data';

interface PortfolioGeneratorProps {
  cleanData: CleanShopper[];
}

export default function PortfolioGenerator({ cleanData }: PortfolioGeneratorProps) {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const activeSlide = presentationSlides[activeSlideIdx];

  const resumeMetrics = {
    recordsCount: cleanData.length,
    loyaltyConversion: 24.2,
    nullImputations: 13,
    querySpans: 3
  };

  const resumeStatement = `Data Science Portfolio Project: Retail Customer Behavior Intelligence Workspace (2026)
• Developed an end-to-end full-stack ETL data pipeline processing ${resumeMetrics.recordsCount} multi-layered shopper records, completing automated median imputations for ${resumeMetrics.nullImputations} missing category order prices using Pandas.
• Designed and initialized a structured, indexes-optimized PostgreSQL cohort database schema using lower snake_case relational representations.
• Authored and executed high-performance SQL window analytics queries with dual-layered CTE partitions and ROW_NUMBER() rankings, identifying top-performing seasonal products.
• Built interactive client-side Power BI slicer dashboard widgets using React & Recharts, mapping customer LTV cohorts that showed loyalty members purchase ${resumeMetrics.loyaltyConversion}% more frequently.`;

  const linkedinPost = `🚀 Excited to share my latest full-stack Data Science portfolio project: The Retail Customer Conversion & Behavior Intelligence Sandbox!

I built an interactive workspace focusing on understanding e-commerce shopper value loops:
✅ Phase 1: Built a Pandas ETL Pipeline handling dirty, un-imputed values with category-level median fill.
✅ Phase 2: Mounted a PostgreSQL Schema running optimized SQL CTE joins and ROW_NUMBER() partition queries.
✅ Phase 3: Created an interactive KPI dashboard with slicers tracking Customer LTV segments (Gen Z, Millennials, Gen X, Boomers).

Key Insight: Shoppers enrolled in loyalty programs purchase 24% more frequently, reducing repeat customer cycles to 12.8 days compared to 45.2 days for non-members!

Built with React, Express, Recharts, and Google Gemini API. Advised by an adaptive AI Senior DS Mentor.

#datascience #analytics #sql #pandas #businessintelligence #portfolio`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div id="portfolio-deck-section" className="space-y-6">
      {/* Upper Grid Layout: Slide Presenter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Slide selectors list on the left */}
        <div className="lg:col-span-4 space-y-3 font-sans">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800 pb-2 flex items-center space-x-2">
            <Presentation className="w-4 h-4 text-indigo-400" />
            <span>Project Slide Deck</span>
          </div>

          <div className="space-y-2">
            {presentationSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlideIdx(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${activeSlideIdx === idx ? 'bg-indigo-600/10 border-indigo-500/40 text-slate-100 shadow-sm' : 'bg-slate-900/40 border-slate-850 hover:bg-slate-850 text-slate-400'}`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs text-indigo-400 font-bold">0{idx + 1}</span>
                  <span className="text-xs font-semibold">{slide.title}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Slide viewer on the right */}
        <div className="lg:col-span-8">
          <div className="glass-panel p-6 rounded-2xl min-h-[280px] flex flex-col justify-between bg-slate-950 border border-slate-850">
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-4 border-b border-slate-900 pb-2">
                <span>RETAIL INTELLIGENCE OVERVIEW</span>
                <span>SLIDE 0{activeSlideIdx + 1} OF 04</span>
              </div>

              <h3 className="text-lg font-bold font-sans text-slate-100">{activeSlide.title}</h3>
              {activeSlide.subtitle && (
                <p className="text-xs text-indigo-400 font-mono mt-1 font-semibold uppercase">{activeSlide.subtitle}</p>
              )}

              <ul className="mt-5 space-y-3.5 text-xs text-slate-300 font-sans leading-relaxed">
                {activeSlide.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block shrink-0 mt-2"></span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-900 mt-6 pt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>PRESENTATION DECK PORTFOLIO</span>
              <span>CONFIDENTIAL CLIENT MATRIX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 2 Grid Layout: Copyable Recruiter Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Resume Bullet points */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-slate-850 bg-slate-900/30">
          <div>
            <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-2.5 mb-4">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-bold font-sans text-slate-200">
                Recruiter-Optimized Resume Card
              </h4>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
              Copy this high-density bulleted project statement directly into your Resume template to demonstrate full-stack quantitative data competence:
            </p>

            <pre className="p-4 bg-slate-950 border border-slate-900 font-sans text-[11px] leading-relaxed text-slate-300 rounded-xl whitespace-pre-wrap max-h-[220px] overflow-y-auto">
              {resumeStatement}
            </pre>
          </div>

          <button
            onClick={() => handleCopy(resumeStatement, 'resume')}
            className={`mt-4 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer ${copiedText === 'resume' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-550 border border-indigo-500 text-white shadow-md shadow-indigo-600/10'}`}
          >
            {copiedText === 'resume' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" />
                <span>Copy Resume Statements</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: LinkedIn Narrative post */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-slate-850 bg-slate-900/30">
          <div>
            <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-2.5 mb-4">
              <Linkedin className="w-5 h-5 text-blue-400" />
              <h4 className="text-sm font-bold font-sans text-slate-200">
                LinkedIn Story Synthesis
              </h4>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
              Share your analytical learnings with your developer network. This post is structured to generate engagement and recruiters visibility:
            </p>

            <pre className="p-4 bg-slate-950 border border-slate-900 font-sans text-[11px] leading-relaxed text-slate-300 rounded-xl whitespace-pre-wrap max-h-[220px] overflow-y-auto">
              {linkedinPost}
            </pre>
          </div>

          <button
            onClick={() => handleCopy(linkedinPost, 'linkedin')}
            className={`mt-4 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer ${copiedText === 'linkedin' ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-550 border border-blue-500 text-white shadow-md shadow-blue-600/10'}`}
          >
            {copiedText === 'linkedin' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" />
                <span>Copy LinkedIn Announcement</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
