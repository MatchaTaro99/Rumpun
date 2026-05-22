import { useEffect, useMemo, useState } from 'react';
import { WireframePreview } from './components/WireframePreview.jsx';
import {
  accessibilityChecklist,
  confirmationPattern,
  designTokens,
  docsSummary,
  primaryNavigation,
  screens,
} from './data/uiBlueprint.js';

const largeTextStorageKey = 'rumpun-large-text-mode';

const initialHealthState = {
  status: 'checking',
  message: 'Mengecek koneksi ke backend...',
};

function StatusPill({ status, label }) {
  return (
    <span className={`status-pill status-pill--${status}`}>
      <span className="status-pill__dot" aria-hidden="true" />
      {label}
    </span>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <section className="card">
      <header className="card__header">
        <div>
          <p className="card__eyebrow">Rumpun</p>
          <h2>{title}</h2>
        </div>
        {description ? <p className="card__description">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

function TokenGroup({ group, items }) {
  return (
    <article className="token-group">
      <h3>{group}</h3>
      <div className="token-group__items">
        {items.map((item) => (
          <div key={item.name} className="token-chip">
            <strong>{item.name}</strong>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function DetailList({ items }) {
  return (
    <ul className="detail-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function App() {
  const [health, setHealth] = useState(initialHealthState);
  const [activeSection, setActiveSection] = useState('overview');
  const [activeScreenId, setActiveScreenId] = useState(screens[0].id);
  const [largeTextMode, setLargeTextMode] = useState(false);

  useEffect(() => {
    const savedLargeTextMode = window.localStorage.getItem(largeTextStorageKey) === 'true';
    setLargeTextMode(savedLargeTextMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', largeTextMode);
    window.localStorage.setItem(largeTextStorageKey, String(largeTextMode));
  }, [largeTextMode]);

  useEffect(() => {
    let active = true;

    const loadHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();

        if (!active) {
          return;
        }

        setHealth({
          status: 'online',
          message: `${data.message} • ${data.environment}`,
        });
      } catch {
        if (!active) {
          return;
        }

        setHealth({
          status: 'offline',
          message: 'Backend belum aktif. Jalankan API untuk melihat status hijau di sini.',
        });
      }
    };

    loadHealth();

    return () => {
      active = false;
    };
  }, []);

  const activeScreen = useMemo(
    () => screens.find((screen) => screen.id === activeScreenId) ?? screens[0],
    [activeScreenId],
  );

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>

      <header className="topbar">
        <div className="brand">
          <div className="brand__mark" aria-hidden="true">
            R
          </div>
          <div>
            <p className="brand__eyebrow">Rumpun</p>
            <strong>Silsilah keluarga digital</strong>
          </div>
        </div>

        <nav className="topbar__nav" aria-label="Navigasi utama">
          {primaryNavigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-pill ${activeSection === item.id ? 'is-active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span>{item.label}</span>
              <small>{item.description}</small>
            </button>
          ))}
        </nav>

        <div className="topbar__actions">
          <StatusPill status={health.status} label={health.message} />
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setLargeTextMode((current) => !current)}
            aria-pressed={largeTextMode}
          >
            {largeTextMode ? 'Teks normal' : 'Teks besar'}
          </button>
        </div>
      </header>

      <main id="main-content" className="main-layout">
        <aside className="sidebar">
          <SectionCard
            title={
              activeSection === 'overview'
                ? 'Panduan visual'
                : activeSection === 'screens'
                  ? 'Daftar wireframe'
                  : activeSection === 'accessibility'
                    ? 'Aksesibilitas'
                    : 'Dokumentasi'
            }
            description={
              activeSection === 'overview'
                ? 'Rancangan awal ini menata arah UI sebelum layar interaktif dibangun.'
                : activeSection === 'screens'
                  ? 'Pilih layar yang ingin dilihat. Pola navigasi tetap satu tingkat dari daftar ini.'
                  : activeSection === 'accessibility'
                    ? 'Teks besar, target sentuh, dan konfirmasi aksi berisiko dijelaskan di sini.'
                    : 'Catatan komponen dan keputusan desain ditulis singkat agar mudah dirujuk.'
            }
          >
            {activeSection === 'screens' ? (
              <div className="screen-list" role="list" aria-label="Daftar wireframe">
                {screens.map((screen) => (
                  <button
                    key={screen.id}
                    type="button"
                    className={`screen-list__item ${activeScreenId === screen.id ? 'is-active' : ''}`}
                    onClick={() => setActiveScreenId(screen.id)}
                  >
                    <strong>{screen.title}</strong>
                    <span>{screen.subtitle}</span>
                  </button>
                ))}
              </div>
            ) : activeSection === 'accessibility' ? (
              <div className="stack">
                <div className="notice notice--accent">
                  Mode teks besar dapat diaktifkan dari tombol di kanan atas dan disimpan di browser.
                </div>
                <div className="notice">
                  Target sentuh, label form, dan konfirmasi permanen dijaga dalam satu lapisan yang
                  mudah dipahami.
                </div>
              </div>
            ) : activeSection === 'docs' ? (
              <div className="stack">
                {docsSummary.map((group) => (
                  <div key={group.title} className="mini-panel">
                    <strong>{group.title}</strong>
                    <DetailList items={group.items} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="stack">
                <div className="mini-panel">
                  <strong>Tujuan utama</strong>
                  <p>
                    Menyusun aplikasi keluarga yang hangat, sederhana, dan aman untuk lintas usia.
                  </p>
                </div>
                <div className="mini-panel">
                  <strong>Aturan navigasi</strong>
                  <p>Gunakan maksimal dua level: pilihan area utama dan daftar layar/fitur di bawahnya.</p>
                </div>
              </div>
            )}
          </SectionCard>
        </aside>

        <section className="content">
          <SectionCard
            title="Wireframe utama"
            description="Satu halaman ini berfungsi sebagai rancangan awal yang merangkum semua layar utama dari PRD."
          >
            <div className="hero-panel">
              <div className="hero-panel__copy">
                <p className="eyebrow">Fase 0 · Desain</p>
                <h1>UI hangat, sederhana, dan nyaman dipakai keluarga lintas usia.</h1>
                <p className="lede">
                  Wireframe ini menyatukan alur login, dashboard, pohon silsilah, profil anggota,
                  form anggota, pencarian, pengaturan, dan bantuan.
                </p>
              </div>
              <div className="hero-panel__rail">
                <div className="hero-stat">
                  <strong>8</strong>
                  <span>layar utama</span>
                </div>
                <div className="hero-stat">
                  <strong>2 level</strong>
                  <span>navigasi maksimum</span>
                </div>
                <div className="hero-stat">
                  <strong>16px+</strong>
                  <span>baseline teks</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {activeSection === 'screens' ? (
            <div className="stack stack--large">
              <SectionCard
                title={activeScreen.title}
                description={activeScreen.purpose}
              >
                <div className="screen-meta">
                  <div>
                    <span className="meta-label">Aksi utama</span>
                    <div className="chip-row">
                      {activeScreen.primaryActions.map((action) => (
                        <span key={action} className="chip">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="meta-label">Elemen kunci</span>
                    <DetailList items={activeScreen.keyElements} />
                  </div>
                </div>
              </SectionCard>

              <WireframePreview screen={activeScreen} />
            </div>
          ) : activeSection === 'accessibility' ? (
            <div className="stack stack--large">
              <SectionCard title="Design tokens awal" description="Warna, tipografi, spacing, dan state dibakukan sejak fase desain.">
                <div className="token-grid">
                  {designTokens.map((group) => (
                    <TokenGroup key={group.group} group={group.group} items={group.items} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Checklist aksesibilitas" description="Semua titik ini dijadikan baseline untuk implementasi berikutnya.">
                <ul className="checklist">
                  {accessibilityChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard title={confirmationPattern.title} description={confirmationPattern.summary}>
                <div className="confirm-pattern">
                  <div className="confirm-pattern__dialog" role="presentation">
                    <p className="confirm-pattern__eyebrow">Contoh dialog</p>
                    <h3>{confirmationPattern.dangerousAction}</h3>
                    <p>
                      Tindakan ini akan menghapus data anggota dari tampilan aktif. Data yang
                      dihapus tidak langsung bisa dikembalikan.
                    </p>
                    <div className="button-row">
                      <button type="button" className="button button--ghost">
                        {confirmationPattern.safeAction}
                      </button>
                      <button type="button" className="button button--danger">
                        {confirmationPattern.confirmAction}
                      </button>
                    </div>
                  </div>
                  <ul className="detail-list">
                    {confirmationPattern.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </SectionCard>
            </div>
          ) : activeSection === 'docs' ? (
            <div className="stack stack--large">
              <SectionCard title="Dokumentasi singkat komponen" description="Struktur ringkas agar anggota tim cepat menemukan pola yang dipakai.">
                <div className="token-grid token-grid--docs">
                  {docsSummary.map((group) => (
                    <article key={group.title} className="token-group">
                      <h3>{group.title}</h3>
                      <DetailList items={group.items} />
                    </article>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Aturan interaksi" description="Fokus pada alur yang familier dan minim lapisan navigasi.">
                <div className="rule-grid">
                  <div className="mini-panel">
                    <strong>Navigasi utama</strong>
                    <p>Gunakan tab area utama di bar atas, lalu daftar layar di sisi kiri saat perlu mendalami satu area.</p>
                  </div>
                  <div className="mini-panel">
                    <strong>Form</strong>
                    <p>Label selalu di atas field, bantuan inline di bawah, dan tombol utama tetap terlihat jelas.</p>
                  </div>
                  <div className="mini-panel">
                    <strong>Aksi berisiko</strong>
                    <p>Semua hapus/nonaktifkan data menampilkan dialog konfirmasi dengan tombol batal yang paling aman.</p>
                  </div>
                </div>
              </SectionCard>
            </div>
          ) : (
            <div className="stack stack--large">
              <SectionCard title="Peta pengalaman" description="Semua layar utama dipetakan sebagai wireframe yang mudah ditinjau sebelum coding lebih jauh.">
                <div className="screen-grid">
                  {screens.map((screen) => (
                    <button
                      type="button"
                      key={screen.id}
                      className={`screen-card ${activeScreenId === screen.id ? 'is-active' : ''}`}
                      onClick={() => {
                        setActiveSection('screens');
                        setActiveScreenId(screen.id);
                      }}
                    >
                      <span className="screen-card__eyebrow">{screen.variant}</span>
                      <strong>{screen.title}</strong>
                      <p>{screen.subtitle}</p>
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Prinsip desain" description="Tiga aturan sederhana yang harus konsisten saat implementasi fitur nanti.">
                <div className="rule-grid">
                  <div className="mini-panel">
                    <strong>Hangat</strong>
                    <p>Gunakan warna lembut, radius besar, dan bahasa yang menenangkan.</p>
                  </div>
                  <div className="mini-panel">
                    <strong>Sederhana</strong>
                    <p>Batasi navigasi pada dua level dan hindari layar yang terlalu penuh.</p>
                  </div>
                  <div className="mini-panel">
                    <strong>Aman</strong>
                    <p>Ukuran teks, kontras, dan konfirmasi dibuat agar mudah dipahami semua usia.</p>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
