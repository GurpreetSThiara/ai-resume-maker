import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, ArrowRight, Bot, User, FileText } from "lucide-react";

export default function Detail() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center bg-slate-900 border-b overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900/90 z-10" />

        <div className="container relative z-20 px-4 md:px-6 text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 border-indigo-500/30 px-4 py-1.5 text-sm backdrop-blur-sm">
            Resume Guide 2026
          </Badge>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            How to Use AI to Build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Job-Winning Resume</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop letting ChatGPT write generic resumes. Learn the "Hybrid Method" to combine AI speed with human strategy for a CV that actually gets interviews in 2026.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="font-medium text-slate-200">CreateFreeCV Team</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>February 12, 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>8 min read</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container px-4 md:px-6 py-12 md:py-20 mx-auto max-w-4xl">
        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-500 transition-colors">

          <p className="lead text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-12">
            In 2026, using AI to write your resume isn't "cheating"—it's expected. But there’s a right way and a very wrong way to do it. The wrong way gets you rejected by ATS bots and ignored by recruiters. The right way? It lands you the interview.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12 not-prose">
            <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <h3 className="text-lg font-bold text-red-700 dark:text-red-400">The "Lazy AI" Approach</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    Copy-pasting "Write me a resume" outputs
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    Using generic buzzwords like "spearheaded" repeatedly
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    Listing job duties instead of achievements
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    Fabricating skills you don't actually have
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">The "Hybrid" Strategy</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-emerald-500">•</span>
                    Using AI to structure your messy thoughts
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500">•</span>
                    Optimizing bullet points with metrics
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500">•</span>
                    Tailoring your resume for specific job descriptions
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500">•</span>
                    Adding your unique human voice and "flavor"
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h2>Why "Pure AI" Resumes Fail in 2026</h2>
          <p>
            Recruiters have developed a "sixth sense" for ChatGPT-generated content. A resume that sounds too polished, too vague, or uses words like "tapestry," "delve," or "landscape" excessively often goes straight to the "No" pile.
          </p>
          <p>
            More importantly, AI doesn't know <strong>you</strong>. It doesn't know about that time you stayed late to fix a critical bug, or how you navigated a difficult client negotiation. It only knows patterns. If you let AI write your resume from scratch, your resume will look like everyone else's pattern.
          </p>

          <hr className="my-12 border-slate-200 dark:border-slate-800" />

          <h2>Step 1: The "Brain Dump" (Human First)</h2>
          <p>
            Before you open ChatGPT, Claude, or Gemini, open a blank document or grab a notebook. Write down everything you've done in your last few roles. Don't worry about grammar, spelling, or formatting. Just get the raw facts down.
          </p>
          <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-lg my-6 not-prose">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-2">Example "Brain Dump"</h4>
            <p className="text-slate-600 dark:text-slate-400 italic">
              "I worked at a coffee shop. I made latte art. I also trained the new guy, Mike. I handled the cash register sometimes and we never had money missing. I helped design the new menu board."
            </p>
          </div>

          <h2>Step 2: The "Refining" Prompt (Enter AI)</h2>
          <p>
            Now, use AI to turn your raw "brain dump" into professional bullet points. The key is to ask for <strong>refinement</strong>, not creation.
          </p>

          <div className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-900/10 p-6 rounded-lg my-6 not-prose">
            <div className="flex gap-3 mb-2">
              <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-bold text-indigo-900 dark:text-indigo-300">Try this Prompt:</h4>
            </div>
            <p className="font-mono text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">
              "Here is a raw list of my responsibilities at my last job as a Barista. Please rewrite them into professional resume bullet points. Focus on action verbs and tangible results where possible. Keep the tone professional but accessible. <br /><br />[Insert Brain Dump]"
            </p>
          </div>

          <h2>Step 3: Quantifying Achievements</h2>
          <p>
            This is where AI shines. If your bullet points feel weak, ask AI to help you identify potential metrics. It can't invent numbers for you (please don't let it!), but it can prompt you to find them.
          </p>
          <p>
            <strong>Prompt:</strong> <em>"Review these bullet points. Ask me 3 questions that would help me add specific numbers, percentages, or metrics to make them stronger."</em>
          </p>
          <p>
            It might ask: <em>"How many new employees did you train?"</em> You answer: "5." <br />
            <strong>Result:</strong> "trained the new guy" → "Mentored and trained 5 new staff members, ensuring full proficiency in brewing techniques within 2 weeks."
          </p>

          <h2>Step 4: The "ATS Check"</h2>
          <p>
            Applicant Tracking Systems (ATS) scan for specific keywords found in the job description. AI is excellent at matching patterns.
          </p>
          <ol>
            <li>Paste the <strong>Job Description</strong> into the AI chat.</li>
            <li>Paste your <strong>Draft Resume</strong>.</li>
            <li>Ask: <em>"Compare my resume against this job description. What top 5 hard skills or keywords am I missing? Be specific."</em></li>
          </ol>
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 my-6 not-prose text-sm text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Warning:</strong> Only add keywords you actually possess. "Keyword stuffing" (adding words in white text or listing skills you lack) effectively blacklists you with human recruiters.
            </p>
          </div>

          <h2>Step 5: The Human Polish (Crucial)</h2>
          <p>
            This is the step 90% of people skip. You <strong>cannot</strong> submit the raw AI output. You must read every single line.
          </p>
          <ul>
            <li><strong>Check for Hallucinations:</strong> Did AI add a skill you didn't mention? Delete it.</li>
            <li><strong>Tone Check:</strong> Does it sound like you? If it uses words like "utilize" instead of "use," or "facilitate" instead of "help," simplify it.</li>
            <li><strong>Consistency:</strong> Ensure formatting (dates, periods) is consistent.</li>
          </ul>

          <h2>Conclusion: Use the Tool, Don't Be the Tool</h2>
          <p>
            AI is the most powerful career assistant you've ever had. It can save you hours of formatting and brainstorming time. But a resume is ultimately a personal document. It's the story of <strong>your</strong> career.
          </p>
          <p>
            Use AI to sharpen your story, not to invent it. The candidates who will win in 2026 are those who combine the efficiency of AI with the irreplaceable authenticity of their own human experience.
          </p>

          <div className="mt-12 p-8 bg-slate-100 dark:bg-slate-900 rounded-xl not-prose">
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Ready to Format Your AI-Polished Content?</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Once you've used AI to refine your bullet points, don't struggle with Word formatting. Paste your content into our professional, ATS-optimized templates.
            </p>
            <Link href="/editor">
              <span className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-lg hover:shadow-xl cursor-pointer">
                Create My Resume Now <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            </Link>
          </div>

        </article>
      </section>
    </div>
  );
}
