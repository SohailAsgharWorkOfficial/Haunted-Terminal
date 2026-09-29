const paths = {
  terminal: 'M4 6l5 6-5 6M12 18h8', camera: 'M3 6h12v12H3zM15 10l6-3v10l-6-3',
  sound: 'M3 10h4l5-5v14l-5-5H3zM16 8q5 4 0 8M19 5q7 7 0 14', mute: 'M3 10h4l5-5v14l-5-5H3zM16 9l5 6M21 9l-5 6',
  expand: 'M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5', reset: 'M4 10a8 8 0 1 1 1 8M4 4v6h6',
  door: 'M5 21V3h13v18M2 21h20M14 12h1', bulb: 'M8 16c0-3-3-4-3-7a7 7 0 0 1 14 0c0 3-3 4-3 7zM9 20h6',
  arrow: 'M4 12h16M14 6l6 6-6 6', shield: 'M12 2l8 4v6c0 5-8 10-8 10S4 17 4 12V6zM12 7v6M12 16v1',
  wave: 'M2 12h4l2-8 4 16 3-13 2 5h5', help: 'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 4M12 17v1',
};
export default function Icon({name, size = 18}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.terminal}/></svg>; }
