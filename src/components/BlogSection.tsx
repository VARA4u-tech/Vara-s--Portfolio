import { useState, useEffect, useCallback } from 'react';
import { BookOpen, ArrowUpRight, Calendar, RefreshCw } from 'lucide-react';
import SectionBlock from './SectionBlock';
import { playHover, playClick } from '@/hooks/useSoundEffects';

interface BlogPost {
  title: string;
  brief: string;
  url: string;
  coverImage: {
    url: string;
  };
  publishedAt: string;
}

interface BlogPostEdge {
  node: BlogPost;
}

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const query = `
          query Publication {
            publication(host: "durgavaraprasad.hashnode.dev") {
              posts(first: 3) {
                edges {
                  node {
                    title
                    brief
                    url
                    coverImage {
                      url
                    }
                    publishedAt
                  }
                }
              }
            }
          }
        `;

      const response = await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      const postEdges = result.data.publication.posts.edges as BlogPostEdge[];
      setPosts(postEdges.map((edge) => edge.node));
    } catch (err) {
      console.error('Error fetching Hashnode posts:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <SectionBlock id="blog" title="Latest Writing">
      <div className="flex flex-col gap-8">
        <p className="body-text max-w-2xl">
          I regularly share my findings, tutorials, and thoughts on the evolving
          landscape of web development, blockchain, and AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Skeleton Loader
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="border-2 border-black p-4 h-[400px] flex flex-col gap-4 animate-pulse bg-white rounded-none"
              >
                <div className="w-full h-48 bg-gray-200 border-b-2 border-black/10 rounded-none" />
                <div className="h-6 bg-gray-200 w-3/4" />
                <div className="h-4 bg-gray-200 w-full" />
                <div className="h-4 bg-gray-200 w-5/6" />
                <div className="mt-auto h-10 bg-gray-200 w-full" />
              </div>
            ))
          ) : error ? (
            // Error state with retry
            <div className="col-span-full py-12 text-center border-2 border-black border-dashed">
              <p className="font-mono text-sm uppercase tracking-widest mb-4 text-foreground/60">
                Failed to load blog posts.
              </p>
              <button
                onClick={() => {
                  playClick();
                  fetchPosts();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black bg-white text-black text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white rounded-none"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <article
                key={post.url}
                className="group relative border-[3px] border-black bg-white p-6 flex flex-col transition-all duration-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-2 hover:-translate-y-2 rounded-none min-h-[520px]"
                onMouseEnter={playHover}
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    // ARTICLE
                  </span>
                  <div className="w-4 h-4 opacity-40">
                    <BookOpen className="w-full h-full" />
                  </div>
                </div>

                <div className="relative h-48 mb-6 overflow-hidden border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-200">
                  <img
                    src={post.coverImage.url}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale brightness-110 contrast-125 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="font-black italic text-foreground leading-tight text-xl uppercase mb-4 tracking-tighter line-clamp-2">
                  {post.title}
                  <span className="inline-block w-3 h-[3px] bg-black ml-1 align-middle"></span>
                </h3>

                <p className="body-text mb-8 font-medium leading-relaxed text-foreground/70 text-xs line-clamp-3">
                  {post.brief}
                </p>

                <div className="mt-auto">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClick}
                    className="w-full flex items-center justify-between px-6 py-4 border-2 border-black bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] hover:-translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  >
                    READ FULL ARTICLE
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-12 text-center border-2 border-black border-dashed opacity-50">
              <p className="font-mono text-sm uppercase tracking-widest">
                No blog posts found. Check back soon!
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center md:justify-start">
          <a
            href="https://durgavaraprasad.hashnode.dev/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:gap-4 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            View All Posts
          </a>
        </div>
      </div>
    </SectionBlock>
  );
};

export default BlogSection;
