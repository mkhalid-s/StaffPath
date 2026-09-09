import { useEffect, useId, useState } from 'react';
import { THEME_CHANGE_EVENT } from '../../lib/theme';

export function ArchitectureDiagram({ source, title }: { source: string; title: string }) {
  const reactId = useId();
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);
  const [palette, setPalette] = useState<'dark' | 'neutral'>(() => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'neutral');

  useEffect(() => {
    const sync = () => {
      setPalette(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'neutral');
    };
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, sync);
  }, []);

  useEffect(() => {
    let active = true;
    if (navigator.userAgent.includes('jsdom')) return;
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: palette,
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        themeVariables: palette === 'dark' ? {
          background: '#1b221e',
          primaryColor: '#1c3a2c',
          primaryTextColor: '#eef1ec',
          primaryBorderColor: '#3d4841',
          lineColor: '#8fd4a6',
          secondaryColor: '#151a17',
          tertiaryColor: '#101412',
        } : undefined,
      });
      return mermaid.render(`diagram-${reactId.replace(/[^a-z0-9]/gi, '')}-${palette}`, source);
    }).then(({ svg: rendered }) => { if (active) { setError(false); setSvg(rendered); } })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [source, reactId, palette]);

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
