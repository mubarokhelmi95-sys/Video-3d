import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolateColors, spring} from 'remotion';
import {ThreeCanvas} from '@remotion/three';

// ===== SUBTITLE (awal, akhir, teks) dalam detik, disinkronkan ke narasi =====
const SUBS: [number, number, string][] = [[0.27, 1.62, "Manusia ketelan"], [1.59, 2.7, "paus sperma"], [3.08, 5.22, "terus gimana nasibnya?"], [5.75, 6.53, "Bisa selamat"], [6.5, 7.27, "nggak sih?"], [7.72, 8.89, "Ah paling nginep"], [8.86, 10.08, "doang di dalem!"], [10.44, 11.52, "Bukan!"], [11.77, 13.5, "Ini bukan staycation"], [14.07, 14.8, "Pertama"], [15.03, 16.43, "ini paus sperma"], [16.59, 18.01, "bukan paus bungkuk"], [18.55, 19.57, "Paus bungkuk emang"], [19.54, 20.67, "pernah nggak sengaja"], [20.64, 21.5, "nyaplok orang"], [21.74, 22.68, "tapi langsung"], [22.65, 23.77, "diludahin lagi"], [24.37, 26.18, "Nah"], [26.67, 28.57, "paus sperma beda"], [28.89, 30.48, "Makanan aslinya cumi-cumi"], [30.64, 31.38, "termasuk cumi raksasa"], [31.35, 32.05, "yang panjangnya bisa"], [32.02, 32.61, "belasan meter"], [33.18, 34.74, "Jadi kerongkongannya muat"], [34.71, 35.97, "buat nelen manusia"], [36.72, 37.93, "Terus di dalem"], [37.9, 38.73, "ada apa?"], [39.33, 40.52, "Gelap total"], [41.07, 42.17, "Nggak ada udara"], [42.46, 43.78, "dan lambungnya penuh"], [43.75, 44.87, "asam pencernaan"], [45.46, 46.27, "Jadi di sana"], [46.24, 47.31, "kamu nggak bakal"], [47.28, 48.08, "bisa napas"], [48.79, 49.89, "Ini yang serem"], [50.5, 51.99, "Pausnya bisa nyelam"], [51.96, 53.5, "sampai 2.000 meter"], [53.85, 54.89, "dengan tekanan air"], [54.86, 55.86, "yang super gede"], [56.43, 57.56, "Jadi walaupun kamu"], [57.53, 58.47, "belum dicerna"], [58.73, 59.54, "kamu sudah nggak"], [59.51, 60.64, "bakal selamat duluan"], [61.26, 62.05, "Tapi kalau"], [62.02, 62.92, "dia muntah"], [63.24, 63.95, "barang-barang yang nggak"], [63.92, 64.29, "kecerna bisa"], [64.26, 64.8, "jadi ambergris"], [64.97, 65.6, "bahan parfum yang"], [65.57, 66.33, "harganya selangit"], [66.6, 67.78, "Jadi kalau ketemu"], [67.75, 68.65, "paus sperma"], [69.26, 71.07, "jangan sok"], [71.04, 72.61, "akrab ya"], [72.95, 73.76, "mending nonton"], [73.73, 74.44, "dari kapal"], [75.03, 76.18, "Follow Men's Gibrig"], [76.54, 77.17, "biar hidup"], [77.14, 78.02, "makin ribet!"], [78.5, 79.65, "Kita ngobrol ngaler"], [79.62, 80.84, "ngidul kemana aja!"]];

// ===== JUDUL BESAR: [mulai, selesai, teks, warna, posisi atas %] =====
const W = '#ffffff', Y = '#ffd23f', R = '#ff4d4d', G = '#7dff5a', C = '#5fd6ff';
const TITLES: [number, number, string, string, number][] = [
  [0.3, 5.3, 'KETELAN PAUS SPERMA?', Y, 9],
  [5.8, 7.4, 'BISA SELAMAT?', C, 9],
  [7.7, 10.2, '"NGINEP DOANG"', W, 9],
  [10.4, 11.6, 'BUKAN!!', R, 9],
  [11.8, 13.6, 'BUKAN STAYCATION', Y, 9],
  [15.0, 24.2, 'PAUS SPERMA', Y, 42],
  [16.6, 24.2, 'PAUS BUNGKUK', C, 8],
  [21.8, 24.2, 'DILUDAHIN LAGI!', R, 15],
  [28.9, 33.0, 'MAKANAN: CUMI-CUMI', Y, 9],
  [30.7, 36.3, 'CUMI RAKSASA ± 13 m', C, 16],
  [33.2, 36.3, 'MUAT NELEN MANUSIA', R, 9],
  [36.7, 39.2, 'DI DALEM ADA APA?', Y, 9],
  [39.4, 41.0, 'GELAP TOTAL', W, 9],
  [41.1, 44.8, 'UDARA: 0%', R, 9],
  [42.5, 48.5, 'ASAM PENCERNAAN', G, 16],
  [45.5, 48.5, 'NGGAK BISA NAPAS', R, 23],
  [48.8, 50.4, 'INI YANG SEREM', R, 9],
  [58.7, 63.0, 'NGGAK SELAMAT DULUAN', R, 9],
  [56.4, 58.5, 'TEKANAN SUPER GEDE', Y, 9],
  [63.2, 66.5, 'KALAU DIA MUNTAH...', Y, 9],
  [65.0, 69.0, 'AMBERGRIS', Y, 16],
  [66.6, 69.0, 'HARGANYA SELANGIT', G, 23],
  [69.3, 72.9, 'JANGAN SOK AKRAB', R, 9],
  [72.9, 75.0, 'NONTON DARI KAPAL', Y, 9],
  [75.0, 82.0, 'FOLLOW', W, 12],
  [75.5, 82.0, "Men's Gibrig", Y, 19],
];

// ===== BATAS ADEGAN (detik) =====
const SC = [0, 5.6, 13.8, 24.2, 36.3, 48.5, 63.0, 69.0, 74.6, 999];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ease = (k: number) => k * k * (3 - 2 * k);
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ===== BAHAN DASAR =====
const M: React.FC<{c: string; e?: string; o?: number; r?: number}> = ({c, e, o, r = 0.8}) => (
  <meshStandardMaterial color={c} roughness={r} emissive={e || '#000000'} transparent={o !== undefined} opacity={o === undefined ? 1 : o} />
);
const Sph: React.FC<{p: number[]; s: number[]; c: string; e?: string}> = ({p, s, c, e}) => (
  <mesh position={p as any} scale={s as any}>
    <sphereGeometry args={[1, 20, 14]} />
    <M c={c} e={e} />
  </mesh>
);

const Particles: React.FC<{t: number; n?: number; color?: string}> = ({t, n = 40, color = '#a8dcff'}) => (
  <group>
    {Array.from({length: n}).map((_, i) => {
      const x = (rnd(i) - 0.5) * 7;
      const z = (rnd(i + 50) - 0.5) * 6 - 2;
      const y = ((rnd(i + 100) * 12 + t * (0.4 + rnd(i + 150) * 0.7)) % 12) - 6;
      const s = 0.03 + rnd(i + 200) * 0.06;
      return (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[s, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.55} />
        </mesh>
      );
    })}
  </group>
);

// ===== PAUS =====
const Whale: React.FC<{t: number; kind: 'sperm' | 'hump'; open?: number}> = ({t, kind, open = 0}) => {
  const sp = kind === 'sperm';
  const c = sp ? '#5d6f82' : '#33475f';
  return (
    <group rotation={[0, 0, Math.sin(t * 1.6) * 0.05]}>
      <Sph p={[0, 0, 0]} s={[3, 1, 1]} c={c} />
      {sp ? <Sph p={[2.5, 0.2, 0]} s={[1.5, 1.15, 1.1]} c={c} /> : <Sph p={[2.7, 0, 0]} s={[1.2, 0.8, 0.9]} c={c} />}
      <Sph p={[0.2, -0.45, 0]} s={[2.8, 0.65, 0.9]} c={sp ? '#8896a6' : '#e8eef4'} />
      <Sph p={[-1, 0.95, 0]} s={[0.3, 0.35, 0.1]} c={c} />
      <group position={[2.3, -0.7, 0]} rotation={[0, 0, -0.15 - open * 0.7]}>
        <mesh position={[0.9, -0.05, 0]} scale={[1.9, 0.2, 0.55]}>
          <boxGeometry args={[1, 1, 1]} />
          <M c="#d9dfe5" />
        </mesh>
      </group>
      {open > 0.05 ? <Sph p={[3.1, -0.85 - 0.5 * open, 0]} s={[0.95, 0.1 + 0.6 * open, 0.55]} c="#2a0508" e="#3a0508" /> : null}
      <Sph p={[2.3, 0.2, 0.95]} s={[0.11, 0.11, 0.11]} c="#111111" />
      {!sp ? (
        <group position={[1.2, -0.5, 0.9]} rotation={[0.5, 0, -0.5 + Math.sin(t * 2) * 0.15]}>
          <Sph p={[-0.8, 0, 0]} s={[1.6, 0.12, 0.35]} c="#e8eef4" />
        </group>
      ) : null}
      <group position={[-3, 0, 0]} rotation={[0, 0, Math.sin(t * 2.4) * 0.22]}>
        <Sph p={[-0.8, 0, 0]} s={[1.1, 0.4, 0.4]} c={c} />
        <Sph p={[-1.7, 0, 0.65]} s={[0.45, 0.1, 0.8]} c={c} />
        <Sph p={[-1.7, 0, -0.65]} s={[0.45, 0.1, 0.8]} c={c} />
      </group>
    </group>
  );
};

// ===== MANUSIA =====
const Human: React.FC<{t: number; s?: number; sx?: number; sy?: number}> = ({t, s = 1, sx = 1, sy = 1}) => {
  const k = Math.sin(t * 5);
  return (
    <group scale={[s * sx, s * sy, s]}>
      <Sph p={[0, 0.78, 0]} s={[0.3, 0.3, 0.3]} c="#f1c27d" />
      <Sph p={[0, 0.9, 0]} s={[0.31, 0.2, 0.31]} c="#222222" />
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.28, 0.3, 0.85, 12]} />
        <M c="#ff7a1a" />
      </mesh>
      <mesh position={[-0.42, 0.2, 0]} rotation={[0, 0, 0.7 + k * 0.5]}>
        <cylinderGeometry args={[0.07, 0.07, 0.7, 8]} />
        <M c="#f1c27d" />
      </mesh>
      <mesh position={[0.42, 0.2, 0]} rotation={[0, 0, -0.7 - k * 0.5]}>
        <cylinderGeometry args={[0.07, 0.07, 0.7, 8]} />
        <M c="#f1c27d" />
      </mesh>
      <mesh position={[-0.15, -0.65, 0]} rotation={[0, 0, k * 0.4]}>
        <cylinderGeometry args={[0.1, 0.09, 0.8, 8]} />
        <M c="#2d3e63" />
      </mesh>
      <mesh position={[0.15, -0.65, 0]} rotation={[0, 0, -k * 0.4]}>
        <cylinderGeometry args={[0.1, 0.09, 0.8, 8]} />
        <M c="#2d3e63" />
      </mesh>
    </group>
  );
};

// ===== CUMI RAKSASA =====
const Squid: React.FC<{t: number}> = ({t}) => (
  <group>
    <Sph p={[1.6, 0, 0]} s={[1.9, 0.7, 0.7]} c="#c0392b" />
    <Sph p={[-0.2, 0, 0]} s={[0.65, 0.6, 0.6]} c="#d9534f" />
    <Sph p={[-0.2, 0.25, 0.5]} s={[0.17, 0.17, 0.17]} c="#fff7c2" />
    <Sph p={[-0.2, 0.25, 0.62]} s={[0.08, 0.08, 0.08]} c="#111111" />
    {Array.from({length: 8}).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return (
        <group key={i} position={[-0.7, Math.sin(a) * 0.3, Math.cos(a) * 0.3]} rotation={[Math.sin(t * 3 + i) * 0.3, 0, Math.PI / 2 + Math.sin(t * 2 + i) * 0.25]}>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.07, 0.03, 1.8, 8]} />
            <M c="#d9534f" />
          </mesh>
        </group>
      );
    })}
  </group>
);

// ===== ADEGAN 1: HOOK =====
const S1: React.FC<{t: number; lt: number}> = ({t, lt}) => (
  <group position={[0, 0, lerp(0, 2, prog(lt, 0, 5.3))]}>
    <Particles t={t} />
    <group position={[-1.5, 0.4, 0]} rotation={[0, 0, -0.25]}>
      <Human t={t} s={0.4} />
    </group>
    <group position={[lerp(6.5, 1.7, ease(prog(lt, 0, 5.2))), -0.5, -1]} scale={[-0.5, 0.5, 0.5]}>
      <Whale t={t} kind="sperm" open={prog(lt, 3.2, 5)} />
    </group>
  </group>
);

// ===== ADEGAN 2: NGINEP DOANG? =====
const S2: React.FC<{t: number; lt: number}> = ({t, lt}) => {
  const sh = t > 10.47 && t < 11.6 ? Math.sin(t * 60) * 0.14 * (1 - prog(t, 10.47, 11.6)) : 0;
  return (
    <group position={[sh, sh * 0.6, 0]}>
      <Particles t={t} />
      <group position={[1.2, -0.6, 0]} scale={[-0.75, 0.75, 0.75]}>
        <Whale t={t} kind="sperm" open={0.5 + 0.4 * Math.sin(lt * 1.5)} />
      </group>
      <group position={[-1.7, 1.0 + Math.sin(t * 2) * 0.1, 1]}>
        <Human t={t} s={0.35} />
      </group>
    </group>
  );
};

// ===== ADEGAN 3: BUNGKUK vs SPERMA =====
const S3: React.FC<{t: number; lt: number}> = ({t, lt}) => {
  const inMouth = t >= 18.6 && t < 21.77;
  const spit = prog(t, 21.77, 23.2);
  let hx = 3.3, hy = 3.0;
  if (inMouth) {
    hx = lerp(3.3, 1.9, ease(prog(t, 18.6, 20.0)));
  } else if (t >= 21.77) {
    hx = lerp(1.9, 2.4, spit);
    hy = lerp(3.0, 5.0, ease(spit));
  }
  const show = t >= 18.6;
  return (
    <group>
      <Particles t={t} />
      <group position={[-0.6, 3.0, 0]} scale={0.5}>
        <Whale t={t} kind="hump" open={inMouth ? 0.6 : 0.1} />
      </group>
      <group position={[-0.6, -1.1, 0]} scale={0.5}>
        <Whale t={t} kind="sperm" />
      </group>
      {show ? (
        <group position={[hx, hy, 1.2]} rotation={[0, 0, t >= 21.77 ? spit * 6 : 0]}>
          <Human t={t} s={0.3} />
        </group>
      ) : null}
    </group>
  );
};

// ===== ADEGAN 4: CUMI RAKSASA =====
const S4: React.FC<{t: number; lt: number}> = ({t, lt}) => {
  const pull = ease(prog(t, 33.3, 35.5));
  return (
    <group>
      <Particles t={t} />
      <group position={[-0.8 + Math.sin(t) * 0.15, 1.8, 0]} rotation={[0, 0, Math.PI / 2]} scale={0.55}>
        <Squid t={t} />
      </group>
      <group position={[-0.5, -1.8, 0]} scale={0.45}>
        <Whale t={t} kind="sperm" open={0.2 + 0.7 * pull} />
      </group>
      <group position={[lerp(1.9, 1.3, pull), lerp(-0.2, -2.0, pull), 1]}>
        <Human t={t} s={0.22} />
      </group>
    </group>
  );
};

// ===== ADEGAN 5: DI DALAM PAUS =====
const Inside: React.FC<{t: number}> = ({t}) => {
  const dark = 1 - ease(prog(t, 38.4, 40.0));
  const acid = ease(prog(t, 43.0, 47.0));
  return (
    <group position={[0, 0, 10]}>
      <ambientLight intensity={0.12 + 0.6 * dark} />
      <pointLight position={[0, 1, -3]} intensity={2 + 40 * dark} color="#ffb3c1" />
      {acid > 0 ? <pointLight position={[0, -2, -5]} intensity={40 * acid} color="#7dff5a" /> : null}
      {Array.from({length: 12}).map((_, i) => {
        const z = -((i * 2.4 + t * 4) % 28.8);
        const sc = 1 + 0.08 * Math.sin(t * 3 + i);
        return (
          <mesh key={i} position={[0, 0, z]} scale={[sc, sc, 1]}>
            <torusGeometry args={[2.3, 0.28, 10, 24]} />
            <M c="#b3475d" e="#40101c" />
          </mesh>
        );
      })}
      <group position={[0, 0.2, -5.5]} rotation={[t * 0.6, 0, t * 0.4]}>
        <Human t={t} s={0.7} />
      </group>
      {acid > 0 ? (
        <mesh position={[0, lerp(-4.5, -1.4, acid), -6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 60]} />
          <M c="#6bff3a" e="#2a8a10" o={0.55 * acid} />
        </mesh>
      ) : null}
      {acid > 0 ? <Particles t={t * 2} n={25} color="#9dff6a" /> : null}
    </group>
  );
};

// ===== ADEGAN 6: SELAM 2.000 m =====
const Depth: React.FC<{t: number}> = ({t}) => {
  const crush = ease(prog(t, 61.3, 62.9));
  return (
    <group>
      <Particles t={t * 3} n={50} color="#7fb6dd" />
      <group position={[0, 2.4, 0]} rotation={[0, 0, -Math.PI / 2 + Math.sin(t * 2) * 0.06]} scale={0.5}>
        <Whale t={t} kind="sperm" />
      </group>
      {t >= 56.4 ? (
        <group position={[0, -1.3, 1]}>
          <Human t={t} s={0.45} sx={1 + 0.5 * crush} sy={1 - 0.65 * crush} />
        </group>
      ) : null}
    </group>
  );
};

// ===== ADEGAN 7: AMBERGRIS =====
const S7: React.FC<{t: number; lt: number}> = ({t, lt}) => {
  const bk = ease(prog(t, 66.6, 67.4));
  return (
    <group>
      <Particles t={t} n={30} color="#ffe29a" />
      <mesh position={[0, 1.4, 0]} rotation={[t * 0.5, t * 0.8, 0]} scale={1.1 + 0.05 * Math.sin(t * 3)}>
        <icosahedronGeometry args={[1, 1]} />
        <M c="#d9b25f" e="#4a3510" r={0.95} />
      </mesh>
      <group position={[0, -1.6, 1]} scale={bk}>
        <mesh>
          <boxGeometry args={[1.1, 1.3, 0.5]} />
          <M c="#ffc6de" o={0.85} r={0.2} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.4, 12]} />
          <M c="#e6c15a" r={0.3} />
        </mesh>
        <Sph p={[0, 1.2, 0]} s={[0.28, 0.28, 0.28]} c="#e6c15a" />
      </group>
    </group>
  );
};

// ===== ADEGAN 8: NONTON DARI KAPAL =====
const S8: React.FC<{t: number; lt: number}> = ({t, lt}) => {
  const bob = Math.sin(t * 2) * 0.12;
  return (
    <group rotation={[0, 0, Math.sin(t * 1.3) * 0.03]}>
      <mesh position={[0, -1.2, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <M c="#1c7fb5" o={0.75} r={0.3} />
      </mesh>
      <group position={[-1.2, -1.8 + Math.sin(t * 1.4) * 0.15, -5]} scale={0.5}>
        <Whale t={t} kind="sperm" />
      </group>
      <group position={[1.0, -0.6 + bob, 1]}>
        <mesh scale={[2.4, 0.5, 1]} position={[0, -0.2, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <M c="#c0392b" />
        </mesh>
        <mesh position={[0.3, 0.5, 0]} scale={[0.9, 0.7, 0.8]}>
          <boxGeometry args={[1, 1, 1]} />
          <M c="#f5f5f5" />
        </mesh>
        <group position={[-0.6, 0.45, 0.2]}>
          <Human t={0} s={0.3} />
        </group>
      </group>
    </group>
  );
};

// ===== ADEGAN 9: PENUTUP =====
const S9: React.FC<{t: number; lt: number}> = ({t, lt}) => (
  <group>
    <Particles t={t} n={45} color="#7fb6dd" />
    <group position={[lerp(-3.5, 3.5, prog(lt, 0, 6.5)), -3.3, 0]} scale={0.4}>
      <Whale t={t} kind="hump" />
    </group>
  </group>
);

const World: React.FC<{t: number}> = ({t}) => {
  const si = SC.findIndex((s, i) => i < SC.length - 1 && t >= s && t < SC[i + 1]);
  const lt = t - SC[si];
  const bg = interpolateColors(
    t,
    [0, 13.8, 24.2, 36.3, 36.4, 48.5, 48.6, 60, 63, 63.1, 69, 69.1, 74.6, 74.7, 82],
    ['#0d4f80', '#0f5c8e', '#0a3558', '#08243c', '#2a0610', '#2a0610', '#0b4d80', '#000a1c', '#000a1c', '#1a1226', '#1a1226', '#9ad7f0', '#9ad7f0', '#06182f', '#06182f']
  );
  return (
    <>
      <color attach="background" args={[bg]} />
      {si !== 4 ? <ambientLight intensity={0.8} /> : null}
      {si !== 4 ? <directionalLight position={[4, 6, 8]} intensity={1.5} /> : null}
      {si === 0 ? <S1 t={t} lt={lt} /> : null}
      {si === 1 ? <S2 t={t} lt={lt} /> : null}
      {si === 2 ? <S3 t={t} lt={lt} /> : null}
      {si === 3 ? <S4 t={t} lt={lt} /> : null}
      {si === 4 ? <Inside t={t} /> : null}
      {si === 5 ? <Depth t={t} /> : null}
      {si === 6 ? <S7 t={t} lt={lt} /> : null}
      {si === 7 ? <S8 t={t} lt={lt} /> : null}
      {si === 8 ? <S9 t={t} lt={lt} /> : null}
    </>
  );
};

const FONT = 'Arial Black, Arial, "DejaVu Sans", sans-serif';

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const t = frame / fps;
  const sub = SUBS.find((x) => t >= x[0] && t < x[1]);
  const fade = Math.max(...SC.slice(1, 9).map((b) => 0.85 * (1 - clamp(Math.abs(t - b) / 0.25))), 0);
  const crush = t >= 61.3 && t < 63 ? 0.3 * Math.sin(prog(t, 61.3, 63) * Math.PI) : 0;
  const depthShow = t >= 50.5 && t < 63;
  const depth = Math.round(2000 * ease(prog(t, 50.5, 55.7)));
  const depthTxt = String(depth).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('Narasi.wav')} />
      <ThreeCanvas width={width} height={height} camera={{position: [0, 0, 12], fov: 50}}>
        <World t={t} />
      </ThreeCanvas>
      <AbsoluteFill style={{backgroundColor: 'rgba(255,0,0,' + crush + ')'}} />
      {TITLES.filter((x) => t >= x[0] && t < x[1]).map((x, i) => {
        const k = spring({frame: frame - Math.round(x[0] * fps), fps, config: {damping: 10, stiffness: 140}});
        return (
          <div key={i} style={{position: 'absolute', left: 20, right: 20, top: x[4] + '%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: x[2].length < 11 ? 72 : 54, color: x[3], transform: 'scale(' + (0.5 + 0.5 * k) + ')', WebkitTextStroke: '8px #000', paintOrder: 'stroke fill', textShadow: '0 6px 12px rgba(0,0,0,0.6)'}}>
            {x[2]}
          </div>
        );
      })}
      {depthShow ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: '22%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 84, color: '#fff', WebkitTextStroke: '8px #000', paintOrder: 'stroke fill'}}>
          {depthTxt} m
        </div>
      ) : null}
      {sub ? (
        <div style={{position: 'absolute', left: 24, right: 24, top: '73%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 64, lineHeight: 1.1, color: '#fff', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill', textShadow: '0 6px 14px rgba(0,0,0,0.7)'}}>
          {sub[2]}
        </div>
      ) : null}
      <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,' + fade + ')'}} />
    </AbsoluteFill>
  );
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
