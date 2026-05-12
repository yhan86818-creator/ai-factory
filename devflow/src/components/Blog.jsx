import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, ChevronRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

export const BlogList = () => {
  return (
    <div className="space-y-8 animate-fade-in max-w-5xl pb-20">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-4xl font-black uppercase tracking-tight">DevFlow <span className="text-primary">Insights</span></h2>
        <p className="text-muted-foreground italic">AI開発を加速させるヒントと、最新の開発トレンドをお届けします。</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.id}`}
            className="glass group overflow-hidden rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col"
          >
            <div className="p-8 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                  {post.category}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} /> {post.date}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                {post.excerpt}
              </p>
              <div className="flex items-center text-primary font-bold text-xs uppercase tracking-widest gap-2 mt-auto">
                Read Article <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | DevFlow Insights`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = post.excerpt;
        document.head.appendChild(meta);
      }
    }

    // JSON-LD for Article Schema
    if (post) {
      const scriptId = 'json-ld-article';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.date,
        "author": {
          "@type": "Organization",
          "name": "DevFlow Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "DevFlow",
          "logo": {
            "@type": "ImageObject",
            "url": "https://devflow-app.pages.dev/favicon.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://devflow-app.pages.dev/blog/${post.id}`
        }
      });
      
      return () => {
        const scriptToRemove = document.getElementById(scriptId);
        if (scriptToRemove) scriptToRemove.remove();
      };
    }
  }, [post]);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <Link href="/app" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-fade-in">
      <Link 
        href="/app" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Insights
      </Link>

      <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
              {post.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar size={14} /> {post.date}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border-l border-white/10 pl-4">
              <User size={14} /> {post.author}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div 
            className="prose prose-invert max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg
              prose-strong:text-white prose-strong:font-bold
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-ul:text-muted-foreground prose-li:mb-2
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Tag size={14} className="text-primary" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">DevFlow / Blog</span>
            </div>
            <div className="flex gap-4">
               {/* Social placeholders if needed */}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 p-8 glass rounded-[2rem] border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-bold text-xl mb-1">Try DevFlow Today</h4>
          <p className="text-sm text-muted-foreground">Local-first, privacy-focused AI development dashboard.</p>
        </div>
        <Link href="/app" className="btn-primary whitespace-nowrap">Open Dashboard</Link>
      </div>
    </div>
  );
};
