import { useRef, useState } from 'react';
import { COMMANDS } from '../game.js';
export default function TerminalInput({ onCommand }) {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([]);
  const cursor = useRef(-1);
  const draft = useRef('');
  function submit(event) { event.preventDefault(); if (!value.trim()) return; onCommand(value); setHistory(h => [value, ...h].slice(0, 50)); setValue(''); cursor.current = -1; }
  function key(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault(); if (cursor.current === -1) draft.current = value;
      cursor.current = Math.max(-1, Math.min(history.length - 1, cursor.current + (event.key === 'ArrowUp' ? 1 : -1)));
      setValue(cursor.current === -1 ? draft.current : history[cursor.current]);
    }
    if (event.key === 'Tab' && value.trim()) { const found = COMMANDS.filter(c => c.startsWith(value.trim().toUpperCase())); if (found.length === 1) { event.preventDefault(); setValue(found[0]); } }
  }
  return <form className="terminal-form" onSubmit={submit}><label htmlFor="command"><span>operator</span>@sector07:~$</label><input id="command" aria-label="Terminal command" value={value} onChange={e => setValue(e.target.value)} onKeyDown={key} placeholder="Enter a command…" autoComplete="off" autoCapitalize="characters" spellCheck="false" maxLength={80}/><button aria-label="Execute command" type="submit">↵</button></form>;
}
