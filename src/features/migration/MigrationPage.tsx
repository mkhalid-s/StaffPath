interface Props { title: string; legacyHash: string }

export function MigrationPage({ title, legacyHash }: Props) {
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">VALIDATED PROTOTYPE</p><h1>{title}</h1><p>This feature remains fully usable while it is migrated into the new typed application.</p></div></div><section className="migration-panel"><div><span>NO CAPABILITY LOST</span><h2>Continue in the working tracker</h2><p>The same browser storage is shared with the new dashboard, so existing sessions, practice attempts, reflections, and artifacts remain visible.</p><a className="button primary" href={`/legacy/index.html#${legacyHash}`}>Open {title} →</a></div><ol><li>Prototype behavior preserved</li><li>Data format remains compatible</li><li>Native migration is tracked as the next build phase</li></ol></section></div>;
}
