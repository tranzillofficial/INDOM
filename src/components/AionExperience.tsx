'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Conversation } from '@elevenlabs/client';
import { AionScene } from './AionScene';

export type AionState = 'happy' | 'listening' | 'thinking' | 'speaking' | 'curious' | 'wink';
const agentId = 'agent_3101m3ykp4tfft0s82w2hc442tfe';
const copy = {
  en: {
    title: 'Meet AION.', intro: 'Your guide to what’s next.', description: 'Explore an idea. Find the right service. Plan your first move.',
    start: 'Talk to AION', chat: 'Start text chat', end: 'End conversation', connecting: 'Connecting…',
    privacy: 'Voice and text are processed by ElevenLabs. Microphone audio is not recorded; transcripts are retained for 7 days. Start only when you’re ready.',
    hint: 'Drag to rotate · Move your cursor to say hello', prototype: 'Interactive character study',
    input: 'What would you like to build?', send: 'Send', error: 'AION couldn’t connect. Check your microphone permission or try text chat. The trial may have reached its limit.',
    closed: 'Conversation ended.', clear: 'Clear conversation', local: 'Explore without a call', wave: 'Say hello',
    states: { happy: 'Ready to help', listening: 'Listening', thinking: 'Thinking', speaking: 'Speaking', curious: 'Curious', wink: 'Hello there' },
    topics: [['Idea', 'A clear first step: define who needs your idea and which problem it solves.'], ['Build', 'INDOM builds websites, SaaS, mobile and desktop applications. Start with the essentials.'], ['Grow', 'Branding, content and campaigns can help shape your digital presence.']],
    mute: 'Mute microphone', unmute: 'Unmute microphone', typing: 'Type your question to AION.', brief: 'Prepare a project brief', session: 'Trial sessions last up to 3 minutes.',
  },
  ar: {
    title: 'اتعرّف على AION.', intro: 'دليلك للخطوة الجاية.', description: 'استكشف فكرتك. اختار الخدمة المناسبة. حدّد أول خطوة.',
    start: 'اتكلم مع AION', chat: 'ابدأ محادثة كتابية', end: 'إنهاء المحادثة', connecting: 'جاري الاتصال…',
    privacy: 'ElevenLabs تعالج الصوت والنص. صوت الميكروفون لا يُسجّل، ونص المحادثة يُحفظ لمدة ٧ أيام. ابدأ عندما تكون جاهزًا.',
    hint: 'اسحب لتدوير الشخصية · حرّك المؤشر للتفاعل', prototype: 'تجربة شخصية تفاعلية',
    input: 'إيه اللي حابب تبنيه؟', send: 'إرسال', error: 'تعذّر الاتصال بـ AION. راجع إذن الميكروفون أو جرّب المحادثة الكتابية. ربما وصل الاستخدام التجريبي لحدّه.',
    closed: 'انتهت المحادثة.', clear: 'مسح المحادثة', local: 'استكشف بدون اتصال', wave: 'قل مرحبًا',
    states: { happy: 'جاهز أساعدك', listening: 'بيسمعك', thinking: 'بيفكر', speaking: 'بيرد عليك', curious: 'فضولي', wink: 'أهلًا بيك' },
    topics: [['فكرة', 'أول خطوة واضحة: حدّد مين محتاج فكرتك وإيه المشكلة اللي بتحلها.'], ['تطوير', 'INDOM تطوّر مواقع ومنصات SaaS وتطبيقات موبايل وديسكتوب. ابدأ بالأساسيات.'], ['نمو', 'الهوية والمحتوى والحملات تساعدك تبني حضورك الرقمي.']],
    mute: 'كتم الميكروفون', unmute: 'تشغيل الميكروفون', typing: 'اكتب سؤالك لـ AION.', brief: 'جهّز ملخص مشروعك', session: 'المحادثة التجريبية تستمر حتى ٣ دقائق.',
  },
};
type Message = { role: 'user' | 'agent'; text: string };

export function AionExperience({ locale }: { locale: 'en' | 'ar' }) {
  const ar = locale === 'ar'; const t = copy[locale];
  const [state, setState] = useState<AionState>('happy');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(''); const [error, setError] = useState(false);
  const [muted, setMuted] = useState(false); const [textOnly, setTextOnly] = useState(false);
  const [localReply, setLocalReply] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const session = useRef<Conversation | null>(null);
  const volume = useRef(0); const sessionVersion = useRef(0); const starting = useRef(false);
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcript = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return () => { sessionVersion.current++; void session.current?.endSession(); if (reset.current) clearTimeout(reset.current); };
  }, []);
  useEffect(() => { transcript.current?.scrollTo({ top: transcript.current.scrollHeight, behavior: 'auto' }); }, [messages]);
  useEffect(() => {
    if (status !== 'connected') { volume.current = 0; return; }
    const timer = setInterval(() => { volume.current = session.current?.getOutputVolume() ?? 0; }, 80);
    return () => clearInterval(timer);
  }, [status]);
  useEffect(() => {
    const end = () => { sessionVersion.current++; void session.current?.endSession(); session.current = null; };
    window.addEventListener('pagehide', end);
    return () => window.removeEventListener('pagehide', end);
  }, []);

  async function start(asText: boolean) {
    if (starting.current || session.current) return;
    starting.current = true; const version = ++sessionVersion.current;
    setStatus('connecting'); setState('thinking'); setError(false); setNotice(''); setTextOnly(asText); setLocalReply(null); setMuted(false);
    if (reset.current) clearTimeout(reset.current);
    try {
      const { Conversation } = await import('@elevenlabs/client');
      const connection = await Conversation.startSession({
        agentId, connectionType: 'websocket', textOnly: asText,
        overrides: { agent: { language: locale, firstMessage: ar ? 'أهلًا، أنا أيون، دليلك في إندوم. إيه اللي حابب تبنيه؟' : "Hi, I'm AION, your guide at INDOM. What would you like to build?" } },
        onConnect: () => { if (version !== sessionVersion.current) return; setStatus('connected'); setState('listening'); },
        onDisconnect: () => { if (version !== sessionVersion.current) return; session.current = null; starting.current = false; setStatus('idle'); setState('happy'); setNotice(t.closed); },
        onError: () => { if (version !== sessionVersion.current) return; setError(true); },
        onModeChange: ({ mode }) => { if (version === sessionVersion.current) setState(mode === 'speaking' ? 'speaking' : 'listening'); },
        onAgentTyping: ({ is_typing }) => { if (version === sessionVersion.current && asText) setState(is_typing ? 'thinking' : 'happy'); },
        onMessage: ({ role, message }) => { if (version !== sessionVersion.current) return; setMessages(previous => [...previous.slice(-39), { role, text: message }]); if (asText) setState(role === 'agent' ? 'happy' : 'thinking'); },
      });
      if (version !== sessionVersion.current) { await connection.endSession(); return; }
      session.current = connection;
    } catch {
      if (version === sessionVersion.current) { setError(true); setStatus('idle'); setState('happy'); }
    } finally { starting.current = false; }
  }
  async function end() {
    sessionVersion.current++; const connection = session.current; session.current = null;
    setStatus('idle'); setState('happy'); setNotice(t.closed); setMuted(false); volume.current = 0;
    await connection?.endSession();
  }
  function send(event: FormEvent) {
    event.preventDefault(); const text = input.trim(); if (!text || !session.current || status !== 'connected') return;
    session.current.sendUserMessage(text); setInput(''); setState('thinking');
  }
  function explore(index: number) {
    if (status !== 'idle') return;
    if (reset.current) clearTimeout(reset.current);
    setLocalReply(t.topics[index][1]); setState(index === 0 ? 'curious' : index === 1 ? 'thinking' : 'happy');
  }
  function wave() { if (status !== 'idle') return; if (reset.current) clearTimeout(reset.current); setState('wink'); reset.current = setTimeout(() => setState('happy'), 2400); }

  return <section className="aion-page">
    <div className="aion-heading"><p className="eyebrow">AION / BY INDOM</p><h1>{t.title}</h1><p>{t.description}</p></div>
    <div className="aion-layout">
      <div className="aion-stage"><div className="aion-stage-label"><span className="status-dot"/>{t.prototype}</div>
        <AionScene state={state} volume={volume} ar={ar}/>
        <div className="aion-stage-footer"><span>{t.hint}</span><button className="aion-wave" disabled={status !== 'idle'} onClick={wave}>{t.wave}<span aria-hidden="true">✦</span></button></div>
      </div>
      <div className="aion-panel"><p className="eyebrow">{t.intro}</p><h2>AION</h2>
        <div className="aion-state" role="status"><span className="status-dot"/>{status === 'connecting' ? t.connecting : t.states[state]}</div>
        <div className="aion-topics"><p>{t.local}</p><div>{t.topics.map(([label], i) => <button disabled={status !== 'idle'} onClick={() => explore(i)} key={label}>{label}<span aria-hidden="true">↗</span></button>)}</div></div>
        {localReply && <p className="aion-local-reply" aria-live="polite">{localReply}</p>}
        <div className="aion-transcript" ref={transcript} role="log" aria-label={ar ? 'نص المحادثة' : 'Conversation transcript'}>{messages.map((message, i) => <div className={`aion-message ${message.role}`} key={i}><span>{message.role === 'agent' ? 'AION' : ar ? 'أنت' : 'You'}</span><p dir="auto">{message.text}</p></div>)}</div>
        {status === 'connected' && <form className="aion-input" onSubmit={send}><label className="sr-only" htmlFor="aion-question">{t.input}</label><input id="aion-question" maxLength={1000} placeholder={t.input} value={input} onChange={e => setInput(e.target.value)} autoComplete="off"/><button disabled={!input.trim()} type="submit">{t.send}</button></form>}
        {error && <p className="aion-error" role="alert">{t.error}</p>}
        {notice && <p className="small" role="status">{notice}</p>}
        <div className="aion-controls">{status === 'idle' ? <><button className="button" onClick={() => void start(false)}>{t.start}<span aria-hidden="true">◉</span></button><button className="textlink" onClick={() => void start(true)}>{t.chat}</button></> : <><button className="button" onClick={() => void end()}>{t.end}<span aria-hidden="true">×</span></button>{status === 'connected' && !textOnly && <button className="textlink" onClick={() => { const next = !muted; session.current?.setMicMuted(next); setMuted(next); }}>{muted ? t.unmute : t.mute}</button>}</>}</div>
        <p className="aion-privacy">{t.privacy}</p><p className="aion-privacy">{t.session}</p>
        <div className="aion-panel-bottom"><Link className="textlink" href={`/${locale}/contact`}>{t.brief}<span aria-hidden="true">↗</span></Link>{messages.length > 0 && <button className="textlink" onClick={() => setMessages([])}>{t.clear}</button>}</div>
      </div>
    </div>
  </section>;
}
