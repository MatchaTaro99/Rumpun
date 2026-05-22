const sidebarItems = ['Beranda', 'Anggota', 'Pohon', 'Cari', 'Bantuan'];

function FrameChrome({ title, subtitle }) {
  return (
    <div className="wireframe__chrome" aria-hidden="true">
      <div className="wireframe__traffic">
        <span />
        <span />
        <span />
      </div>
      <div className="wireframe__chrome-text">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

function Panel({ title, children, tone }) {
  return (
    <section className={`wireframe__panel wireframe__panel--${tone}`}>
      <p className="wireframe__panel-title">{title}</p>
      {children}
    </section>
  );
}

function FieldRow({ label, width = 'medium', hint = '' }) {
  return (
    <div className="wireframe__field">
      <span className="wireframe__field-label">{label}</span>
      <div className={`wireframe__input wireframe__input--${width}`} />
      {hint ? <span className="wireframe__hint">{hint}</span> : null}
    </div>
  );
}

function TreeNode({ label, variant = 'center' }) {
  return <div className={`wireframe__node wireframe__node--${variant}`}>{label}</div>;
}

function ResultRow({ title, meta }) {
  return (
    <div className="wireframe__result">
      <div>
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
      <div className="wireframe__result-pill" />
    </div>
  );
}

function ToggleRow({ label, value }) {
  return (
    <div className="wireframe__toggle-row">
      <div>
        <strong>{label}</strong>
        <span>{value}</span>
      </div>
      <div className="wireframe__toggle" />
    </div>
  );
}

function HelperCard({ title, body }) {
  return (
    <div className="wireframe__helper-card">
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}

function renderVariant(screen) {
  switch (screen.variant) {
    case 'split':
      return (
        <div className="wireframe__grid wireframe__grid--split">
          <Panel title="Sambutan" tone="warm">
            <div className="wireframe__hero-block" />
            <div className="wireframe__stack">
              <div className="wireframe__line wireframe__line--lg" />
              <div className="wireframe__line" />
              <div className="wireframe__line wireframe__line--sm" />
            </div>
          </Panel>
          <Panel title="Form Masuk" tone="soft">
            <FieldRow label="Email atau nomor" hint="Gunakan format yang mudah diingat keluarga." />
            <FieldRow label="Kata sandi" width="small" />
            <div className="wireframe__button-row">
              <div className="wireframe__button wireframe__button--primary" />
              <div className="wireframe__button wireframe__button--ghost" />
            </div>
          </Panel>
        </div>
      );
    case 'dashboard':
      return (
        <div className="wireframe__grid wireframe__grid--dashboard">
          <Panel title="Ringkasan" tone="soft">
            <div className="wireframe__stats">
              <div className="wireframe__stat"><strong>128</strong><span>anggota</span></div>
              <div className="wireframe__stat"><strong>9</strong><span>relasi baru</span></div>
              <div className="wireframe__stat"><strong>3</strong><span>notifikasi</span></div>
            </div>
          </Panel>
          <Panel title="Aktivitas terbaru" tone="warm">
            <HelperCard title="Update profil" body="Data anggota terakhir diperbarui 2 jam lalu." />
            <HelperCard title="Undangan keluarga" body="Terdapat 1 undangan relasi yang menunggu." />
          </Panel>
          <Panel title="Pintasan" tone="accent">
            <div className="wireframe__button-row">
              <div className="wireframe__button wireframe__button--primary" />
              <div className="wireframe__button wireframe__button--ghost" />
            </div>
          </Panel>
        </div>
      );
    case 'tree':
      return (
        <div className="wireframe__grid wireframe__grid--tree">
          <Panel title="Pusat silsilah" tone="warm">
            <div className="wireframe__tree">
              <div className="wireframe__tree-line wireframe__tree-line--vertical" />
              <TreeNode label="Keluarga inti" variant="center" />
              <div className="wireframe__tree-branches">
                <TreeNode label="Orang tua" variant="branch" />
                <TreeNode label="Saudara" variant="branch" />
                <TreeNode label="Anak" variant="branch" />
              </div>
            </div>
          </Panel>
          <Panel title="Legenda" tone="soft">
            <div className="wireframe__legend">
              <div><span className="wireframe__legend-swatch" /> Garis utama</div>
              <div><span className="wireframe__legend-swatch wireframe__legend-swatch--alt" /> Cabang relasi</div>
            </div>
          </Panel>
        </div>
      );
    case 'profile':
      return (
        <div className="wireframe__grid wireframe__grid--profile">
          <Panel title="Identitas" tone="soft">
            <div className="wireframe__avatar" />
            <div className="wireframe__stack">
              <div className="wireframe__line wireframe__line--lg" />
              <div className="wireframe__line wireframe__line--sm" />
            </div>
          </Panel>
          <Panel title="Tab profil" tone="warm">
            <div className="wireframe__tabs">
              <span className="wireframe__tab wireframe__tab--active" />
              <span className="wireframe__tab" />
              <span className="wireframe__tab" />
            </div>
            <div className="wireframe__stack">
              <div className="wireframe__line" />
              <div className="wireframe__line" />
              <div className="wireframe__line wireframe__line--sm" />
            </div>
          </Panel>
        </div>
      );
    case 'form':
      return (
        <div className="wireframe__grid wireframe__grid--form">
          <Panel title="Form anggota" tone="soft">
            <FieldRow label="Nama lengkap" />
            <FieldRow label="Tanggal lahir" width="small" />
            <FieldRow label="Hubungan keluarga" />
            <FieldRow label="Catatan tambahan" hint="Contoh: panggilan keluarga, alamat, atau keterangan lain." />
            <div className="wireframe__button-row">
              <div className="wireframe__button wireframe__button--primary" />
              <div className="wireframe__button wireframe__button--ghost" />
            </div>
          </Panel>
        </div>
      );
    case 'search':
      return (
        <div className="wireframe__grid wireframe__grid--search">
          <Panel title="Bar pencarian" tone="warm">
            <div className="wireframe__searchbar" />
            <div className="wireframe__chip-row">
              <span className="wireframe__chip" />
              <span className="wireframe__chip" />
              <span className="wireframe__chip" />
            </div>
          </Panel>
          <Panel title="Hasil" tone="soft">
            <ResultRow title="Nenek Ani" meta="Hubungan: generasi pertama" />
            <ResultRow title="Budi" meta="Hubungan: paman" />
            <ResultRow title="Sari" meta="Hubungan: sepupu" />
          </Panel>
        </div>
      );
    case 'settings':
      return (
        <div className="wireframe__grid wireframe__grid--settings">
          <Panel title="Preferensi tampilan" tone="soft">
            <ToggleRow label="Mode teks besar" value="Lebih mudah dibaca" />
            <ToggleRow label="Kontras tinggi" value="WCAG 2.1 AA" />
            <ToggleRow label="Animasi halus" value="Mengikuti sistem" />
          </Panel>
          <Panel title="Keamanan" tone="warm">
            <ToggleRow label="Kunci sesi" value="Otomatis saat idle" />
            <ToggleRow label="Konfirmasi hapus" value="Selalu tampil" />
          </Panel>
        </div>
      );
    case 'help':
    default:
      return (
        <div className="wireframe__grid wireframe__grid--help">
          <Panel title="FAQ" tone="warm">
            <HelperCard title="Bagaimana menambah anggota?" body="Gunakan form anggota lalu isi data dasar secara bertahap." />
            <HelperCard title="Bagaimana menemukan keluarga?" body="Pakai pencarian cepat dan filter hubungan." />
          </Panel>
          <Panel title="Kontak bantuan" tone="soft">
            <div className="wireframe__contact">
              <div className="wireframe__contact-line" />
              <div className="wireframe__contact-line" />
              <div className="wireframe__contact-line wireframe__contact-line--short" />
            </div>
          </Panel>
        </div>
      );
  }
}

export function WireframePreview({ screen }) {
  return (
    <article className={`wireframe wireframe--${screen.accent}`}>
      <FrameChrome title="Rumpun" subtitle="Wireframe awal" />
      <div className="wireframe__body">
        <aside className="wireframe__sidebar" aria-hidden="true">
          <div className="wireframe__sidebar-brand">
            <div className="wireframe__sidebar-mark" />
            <div>
              <strong>Rumpun</strong>
              <span>Family app</span>
            </div>
          </div>
          <div className="wireframe__sidebar-list">
            {sidebarItems.map((item) => (
              <span key={item} className="wireframe__sidebar-item">
                {item}
              </span>
            ))}
          </div>
        </aside>

        <section className="wireframe__content">
          <header className="wireframe__header">
            <div>
              <p className="wireframe__eyebrow">Halaman utama</p>
              <h3>{screen.title}</h3>
              <p>{screen.subtitle}</p>
            </div>
            <div className="wireframe__header-actions">
              <span className="wireframe__badge">Aksesibel</span>
              <span className="wireframe__badge wireframe__badge--soft">2 level</span>
            </div>
          </header>

          {renderVariant(screen)}
        </section>
      </div>
    </article>
  );
}

