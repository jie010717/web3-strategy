/**
 * Web3 交易策略 - 静态站点生成器
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { marked } from 'marked';
import hljs from 'highlight.js';

marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value;
    return code;
  }
});

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const PUBLIC = join(ROOT, 'public');

const SITE = {
  title: 'Web3 交易策略',
  description: '专业的 Web3 加密货币交易策略、技术分析、DeFi 套利和链上数据分析',
  url: 'https://web3-strategy.com',
  lang: 'zh-CN',
  author: 'Web3 策略研究'
};

function parseFrontmatter(md) {
  // Normalize line endings
  md = md.replace(/\r\n/g, '\n');
  const match = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: md };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const [k, ...v] = line.split(':');
    if (k && v.length) meta[k.trim()] = v.join(':').trim().replace(/^['"]|['"]$/g, '');
  });
  return { meta, content: match[2] };
}

function getPosts() {
  const dir = join(SRC, 'content', 'posts');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
    const raw = readFileSync(join(dir, f), 'utf-8');
    const { meta, content } = parseFrontmatter(raw);
    return { meta, content: raw, html: marked.parse(content), slug: f.replace(/\.md$/, '') };
  }).sort((a, b) => new Date(b.meta.date || 0) - new Date(a.meta.date || 0));
}

function layout(title, desc, content, extra = '') {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title} | ${SITE.title}</title>
<meta name="description" content="${desc}">
<meta name="keywords" content="Web3,加密货币,交易策略,DeFi,区块链,套利">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${SITE.url}">
<link rel="icon" href="/favicon.ico">
${extra}
<style>
:root{--bg:#0f1117;--card:#1a1d2e;--accent:#6c5ce7;--text:#e2e8f0;--muted:#8892b0;--border:#2d3050;}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans SC',sans-serif;background:var(--bg);color:var(--text);line-height:1.8;}
.container{max-width:900px;margin:0 auto;padding:0 20px;}
header{border-bottom:1px solid var(--border);padding:20px 0;}
header .container{display:flex;justify-content:space-between;align-items:center;}
header h1{font-size:1.3rem;}
header h1 a{color:var(--accent);text-decoration:none;}
nav a{color:var(--muted);text-decoration:none;margin-left:20px;font-size:.9rem;transition:color .2s;}
nav a:hover{color:var(--text);}
main{padding:40px 0;min-height:60vh;}
footer{border-top:1px solid var(--border);padding:30px 0;text-align:center;color:var(--muted);font-size:.85rem;}
h1{font-size:2rem;margin-bottom:20px;}
h2{font-size:1.5rem;margin:30px 0 15px;color:var(--accent);}
h3{font-size:1.2rem;margin:25px 0 10px;}
p{margin-bottom:16px;color:#c8d0e0;}
a{color:#8b7cf7;}
.post-card{background:var(--card);border-radius:12px;padding:25px;margin-bottom:20px;border:1px solid var(--border);transition:transform .2s,border-color .2s;}
.post-card:hover{transform:translateY(-2px);border-color:var(--accent);}
.post-card h2{margin:0 0 10px;font-size:1.25rem;}
.post-card h2 a{color:var(--text);text-decoration:none;}
.post-card h2 a:hover{color:var(--accent);}
.post-card .meta{color:var(--muted);font-size:.85rem;margin-bottom:10px;}
.post-card .excerpt{color:#a0a8c0;font-size:.95rem;}
.post-card .tags{margin-top:12px;}
.tag{display:inline-block;background:rgba(108,92,231,.15);color:#a99af0;padding:2px 10px;border-radius:4px;font-size:.8rem;margin-right:6px;}
.post-content h2{border-bottom:1px solid var(--border);padding-bottom:8px;}
.post-content ul,.post-content ol{padding-left:24px;margin-bottom:16px;}
.post-content li{margin-bottom:8px;color:#c8d0e0;}
.post-content code{background:rgba(255,255,255,.08);padding:2px 6px;border-radius:4px;font-size:.9em;}
.post-content pre{background:#0a0c16;border-radius:8px;padding:16px;overflow-x:auto;margin-bottom:20px;border:1px solid var(--border);}
.post-content pre code{background:0;padding:0;}
.post-content blockquote{border-left:3px solid var(--accent);padding-left:16px;margin:20px 0;color:var(--muted);}
.post-meta{color:var(--muted);font-size:.9rem;margin-bottom:30px;}
.post-nav{display:flex;justify-content:space-between;margin-top:50px;padding-top:30px;border-top:1px solid var(--border);}
.post-nav a{color:var(--accent);text-decoration:none;}
.hero{text-align:center;padding:50px 0;}
.hero h1{font-size:2.5rem;margin-bottom:15px;background:linear-gradient(135deg,#6c5ce7,#a29bfe);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.hero p{font-size:1.1rem;color:var(--muted);max-width:600px;margin:0 auto;}
.count{color:var(--muted);font-size:.9rem;margin-bottom:20px;}
@media(max-width:600px){header .container{flex-direction:column;gap:10px;}nav a{margin:0 8px;}.hero h1{font-size:1.8rem;}}
</style></head>
<body>
<header><div class="container">
<h1><a href="/"><img src="/images/logo.png" alt="${SITE.title}" style="height:28px;vertical-align:middle;margin-right:8px">${SITE.title}</a></h1>
<nav><a href="/">首页</a><a href="/posts/">全部文章</a></nav>
</div></header>
<main><div class="container">${content}</div></main>
<footer><div class="container"><p>${SITE.title} &copy; ${new Date().getFullYear()} — 专业 Web3 交易策略分析</p></div></footer>
</body></html>`;
}

function renderHomePage(posts) {
  const hero = `<div class="hero"><h1>Web3 交易策略</h1><p>专业的加密货币交易策略研究、DeFi 套利方法、链上数据分析与趋势解读</p></div>`;
  const list = posts.slice(0, 5).map(p => {
    const excerpt = p.meta.excerpt || p.content.replace(/^---[\s\S]*?---\n/,'').slice(0,150).replace(/[#*`\[\]]/g,'') + '...';
    return `<article class="post-card"><h2><a href="/posts/${p.slug}/">${p.meta.title}</a></h2>
<div class="meta">${p.meta.date||''} ${p.meta.tags ? '· ' + p.meta.tags.split(',').map(t=>`<span class="tag">${t.trim()}</span>`).join(' ') : ''}</div>
<div class="excerpt">${excerpt}</div></article>`;
  }).join('');
  writeFileSync(join(DIST,'index.html'), layout('首页',SITE.description,`${hero}<div class="count">共 ${posts.length} 篇文章</div>${list}`),'utf-8');
}

function renderPostsPage(posts) {
  const list = posts.map(p => {
    const excerpt = p.meta.excerpt || p.content.replace(/^---[\s\S]*?---\n/,'').slice(0,120).replace(/[#*`\[\]]/g,'') + '...';
    return `<article class="post-card"><h2><a href="/posts/${p.slug}/">${p.meta.title}</a></h2>
<div class="meta">${p.meta.date||''} ${p.meta.tags ? '· ' + p.meta.tags.split(',').map(t=>`<span class="tag">${t.trim()}</span>`).join(' ') : ''}</div>
<div class="excerpt">${excerpt}</div></article>`;
  }).join('');
  writeFileSync(join(DIST,'posts','index.html'), layout('全部文章','Web3 交易策略全部文章',`<h1>全部文章</h1><div class="count">共 ${posts.length} 篇</div>${list}`),'utf-8');
}

function renderPostPage(post, prev, next) {
  const dir = join(DIST,'posts',post.slug);
  mkdirSync(dir,{recursive:true});
  const tags = post.meta.tags ? post.meta.tags.split(',').map(t=>`<span class="tag">${t.trim()}</span>`).join(' ') : '';
  const nav = `<div class="post-nav">${prev?`<a href="/posts/${prev.slug}/">← ${prev.meta.title}</a>`:'<span></span>'}${next?`<a href="/posts/${next.slug}/">${next.meta.title} →</a>`:'<span></span>'}</div>`;
  writeFileSync(join(dir,'index.html'), layout(post.meta.title,post.meta.description||SITE.description,`<article><h1>${post.meta.title}</h1><div class="post-meta">${post.meta.date||''} ${tags}</div><div class="post-content">${post.html}</div>${nav}</article>`),'utf-8');
}

function genSitemap(posts) {
  const urls = posts.map(p=>`  <url><loc>${SITE.url}/posts/${p.slug}/</loc><lastmod>${p.meta.updated||p.meta.date||new Date().toISOString().split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n');
  writeFileSync(join(DIST,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE.url}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n${urls}\n</urlset>`,'utf-8');
}

function genRSS(posts) {
  const items = posts.slice(0,10).map(p=>`  <item><title>${p.meta.title}</title><link>${SITE.url}/posts/${p.slug}/</link><description>${p.meta.description||''}</description><pubDate>${new Date(p.meta.date||Date()).toUTCString()}</pubDate><guid>${SITE.url}/posts/${p.slug}/</guid></item>`).join('\n');
  writeFileSync(join(DIST,'feed.xml'),`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${SITE.title}</title><link>${SITE.url}</link><description>${SITE.description}</description><language>zh-cn</language><atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>\n${items}\n</channel></rss>`,'utf-8');
}

function build() {
  console.log('🚀 Building Web3 Strategy Site...\n');
  const posts = getPosts();
  console.log(`📝 ${posts.length} posts loaded\n`);
  mkdirSync(DIST,{recursive:true});
  mkdirSync(join(DIST,'posts'),{recursive:true});
  
  renderHomePage(posts); console.log('✓ 首页');
  renderPostsPage(posts); console.log('✓ 文章列表');
  posts.forEach((p,i) => renderPostPage(p, posts[i+1]||null, posts[i-1]||null));
  console.log(`✓ ${posts.length} 篇文章详情`);
  
  genSitemap(posts); console.log('✓ sitemap.xml');
  genRSS(posts); console.log('✓ feed.xml');
  
  if (existsSync(PUBLIC)) {
    execSync(`xcopy "${PUBLIC}" "${DIST}" /E /I /Y > NUL 2>&1`, { shell: 'cmd.exe' });
    console.log('✓ 静态资源');
  }
  
  console.log(`\n✅ Build complete! 输出: ${DIST}`);
}

build();
