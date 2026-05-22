import { useEffect, useState } from 'react';

const initialState = {
  status: 'checking',
  message: 'Mengecek koneksi ke backend...',
};

export default function App() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let active = true;

    const loadHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();

        if (!active) {
          return;
        }

        setState({
          status: 'online',
          message: `${data.message} • ${data.environment}`,
        });
      } catch {
        if (!active) {
          return;
        }

        setState({
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

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Rumpun</p>
        <h1>Silsilah keluarga digital dimulai dari pondasi yang rapi.</h1>
        <p className="lede">
          Frontend React dan backend Express sudah terhubung, jadi developer baru bisa langsung
          mulai dari sini.
        </p>

        <div className="status-card">
          <span className={`status-dot ${state.status}`} aria-hidden="true" />
          <div>
            <p className="status-label">Status aplikasi</p>
            <p className="status-message">{state.message}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

