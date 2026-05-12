import React from 'react';
import { blogPosts } from '../../../lib/blogData';
import { ChevronRight, Zap, ArrowRight, Globe } from 'lucide-react';
import Link from 'next/link';

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.id,
  }));
}

export default function BlogPostPage({ params }) {
  const { slug } = params;
  const post = blogPosts.find((p) => p.id === slug);

  if (!post) {
    return <div className="min-h-screen bg-background text-white flex items-center justify-center">Post not found.</div>;
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 text-white">
      {/* Simple Navigation */}
      <nav className="w-full z-50 px-6 py-6 flex justify-between items-center bg-background border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
            <Globe size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">ZenNomad</span>
        </Link>
        <Link 
          href="/?step=simulator"
          className="btn-primary py-2 px-6 text-sm"
        >
          Check Savings
        </Link>
      </nav>

      <div className="pt-20 pb-40 px-6 max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/#blog"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 text-xs font-black uppercase tracking-widest group w-fit"
        >
          <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </Link>

        {/* Article Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
              {post.category}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">{post.date}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{post.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-8">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 pt-6 border-t border-border/50">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-sm">
              {post.author.charAt(0)}
            </div>
            <span className="text-sm font-bold text-muted-foreground">{post.author}</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="space-y-8">
          {post.content.map((block, i) => {
            if (block.type === 'intro') return (
              <p key={i} className="text-xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-6 italic">
                {block.text}
              </p>
            );
            if (block.type === 'h2') return (
              <h2 key={i} className="text-2xl md:text-3xl font-black uppercase tracking-tight pt-8">
                {block.text}
              </h2>
            );
            if (block.type === 'p') return (
              <p key={i} className="text-muted-foreground leading-relaxed text-lg">
                {block.text}
              </p>
            );
            if (block.type === 'callout') return (
              <div key={i} className="glass p-6 rounded-2xl border-primary/20 bg-primary/5 flex gap-4">
                <Zap size={20} className="text-primary shrink-0 mt-1" />
                <p className="text-sm leading-relaxed font-medium">{block.text}</p>
              </div>
            );
            return null;
          })}
        </div>

        {/* CTA at end of article */}
        <div className="mt-20 p-10 rounded-[2rem] bg-primary/5 border border-primary/20 text-center">
          <h3 className="text-2xl font-black uppercase italic tracking-tight mb-4">Ready to Find Your Optimal Strategy?</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Run a personalized simulation with your actual income and current tax rate.</p>
          <Link
            href="/?step=simulator"
            className="btn-primary px-10 py-4 text-lg inline-flex items-center gap-2"
          >
            Start Simulation <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
