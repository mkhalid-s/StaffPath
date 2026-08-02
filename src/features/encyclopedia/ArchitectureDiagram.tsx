import { useEffect, useId, useState } from 'react';

export function ArchitectureDiagram({ source, title }: { source: string; title: string }) {
  const reactId = useId();
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    if (navigator.userAgent.includes('jsdom')) return;
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral', fontFamily: 'Segoe UI, system-ui, sans-serif' });
      return mermaid.render(`diagram-${reactId.replace(/[^a-z0-9]/gi, '')}`, source);
    }).then(({ svg: rendered }) => { if (active) setSvg(rendered); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [source, reactId]);

  const download = () => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-architecture.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (error || navigator.userAgent.includes('jsdom')) return <pre>{source}</pre>;
  if (!svg) return <div className="diagram-loading">Rendering architecture…</div>;
  return <div className="diagram-render"><div dangerouslySetInnerHTML={{ __html: svg }} /><button onClick={download}>Download SVG</button></div>;
}
