import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Gamepad } from 'lucide-react';
import { socket } from '../socket';
import { setMyName, setRoom as setRoomRedux } from '../features/game/gameSlice';
import OutlineButton from './OutlineButton';

const SOFT_RADIUS = 120;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const easeOut = v => Math.sign(v) * Math.pow(Math.abs(v), 0.7);

/* ---------- util: caret in viewport px ---------- */
function getCaretCoords(el) {
  const range = document.createRange();
  const sel   = window.getSelection();

  range.setStart(el, 0);
  range.setEnd(el, 0);        // dummy to init

  const pos = el.selectionEnd;
  range.setEnd(el.firstChild || el, 0);   // ensure node exists
  range.setEnd(el, 0);                    // fallback if empty

  // build hidden span to measure width
  const span = document.createElement('span');
  span.textContent = el.value.slice(0, pos);
  span.style.font = getComputedStyle(el).font;
  span.style.whiteSpace = 'pre';
  span.style.visibility = 'hidden';
  document.body.appendChild(span);

  const { left, top } = el.getBoundingClientRect();
  const caretLeft = left + span.offsetWidth;
  const caretTop  = top  + span.offsetHeight / 2;

  document.body.removeChild(span);
  return { left: caretLeft, top: caretTop };
}

function normalise(dx, dy) {
  const x = clamp(dx / SOFT_RADIUS, -1, 1);
  const y = clamp(dy / SOFT_RADIUS,  0, 1);  // pupils never look up
  return { x, y };
}
/* ---------- component ---------- */
export default function JoinRoomForm({ onNameChange, onRoomJoined, faceRef }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const dispatch = useDispatch();
  const nameRef  = useRef(null);
  const roomRef  = useRef(null);

  /* shared caret tracker for both fields */
  const updateEyesFromCaret = el => {
    if (!el || !faceRef.current) return;

    const caret = getCaretCoords(el);
    const faceEl = faceRef.current.getDOMNode();
    if (!faceEl) return;
    
    const faceRec = faceEl.getBoundingClientRect();
    const faceCx  = faceRec.left + faceRec.width  / 2;
    const faceCy  = faceRec.top  + faceRec.height / 2;

    const { x, y } = normalise(caret.left - faceCx, caret.top - faceCy);
    faceRef.current.updateEyes({ x: easeOut(x), y: easeOut(y) });
  };

  const handleJoin = () => {
    if (!name.trim() || !room.trim()) {
      alert('Name and Room are required');
      return;
    }
    socket.emit('join_room', { name, room });
    dispatch(setMyName(name));
    dispatch(setRoomRedux(room));
    onRoomJoined(room);
  };

  return (
    <div className="space-y-3">
      {/* ----- Row 1  ----- */}
      <div className="flex gap-2">
        <input
          ref={nameRef}
          className="flex-1 px-4 py-2 rounded border bg-neutral text-white"
          placeholder="Your Name"
          value={name}
          maxLength={25}
          onChange={e => {
            setName(e.target.value);
            onNameChange(e.target.value);
          }}
          onInput={() => updateEyesFromCaret(nameRef.current)}
        />

        <input
          ref={roomRef}
          className="flex-1 px-4 py-2 rounded border bg-neutral text-white"
          placeholder="Room Code"
          value={room}
          maxLength={10}
          onChange={e => setRoom(e.target.value)}
          onInput={() => updateEyesFromCaret(roomRef.current)}
        />
      </div>

      {/* ----- Row 2 ----- */}
      <OutlineButton
        className="w-full"
        onClick={handleJoin}
        label="Join Room"
        icon={<Gamepad className="w-5 h-5" />}
      />
    </div>
  );
}
