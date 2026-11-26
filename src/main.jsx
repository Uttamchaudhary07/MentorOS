import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight, BookOpen, Braces, Check, ChevronLeft, ChevronRight, CircleHelp,
  ClipboardCheck, Code2, ExternalLink, FlaskConical, GraduationCap, House, Layers3,
  Lightbulb, LockKeyhole, Menu, Search, Target, Timer, UserRound, X, RotateCcw,
} from 'lucide-react';
import { tracks, topics, getTrack, getTopic } from './curriculum.js';
import { initialProfile, ready, recordAttempt, trackPassed } from './progress.js';
import { exercises, evaluateExercise } from './code-lab.js';
import './styles.css';

const storage = 'learnos-profile-v1';
const mainNav = [
  ['home', 'Overview', House], ['topics', 'My Topics', BookOpen], ['practice', 'Practice', Code2],
  ['rules', 'Rules & Tricks', Lightbulb], ['tests', 'Tests & Recall', ClipboardCheck],
  ['lab', 'Code & Math Lab', FlaskConical],
];
const pageInfo = {
  topics: ['My Topics', 'Browse each level and pick up where you left off.'],
  practice: ['Practice Library', 'Find exercises and external problems matched to each topic.'],
  rules: ['Rules & Tricks', 'Find the cues, shortcuts, and edge cases you need for a specific topic.'],
  tests: ['Tests & Recall', 'Test what you know and revisit concepts as they come due.'],
  lab: ['Code & Math Lab', 'Try out markup, styles, JavaScript exercises, and function graphs.'],
};

function readProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(storage));
    return saved ? { ...initialProfile, ...saved } : initialProfile;
  } catch {
    return initialProfile;
  }
}

function currentRoute() {
  const [page = 'home', id, mode] = location.hash.slice(1).split('/').filter(Boolean);
  return { page, id, mode };
}

function go(page, id, mode) {
  location.hash = [page, id, mode].filter(Boolean).join('/');
}

function Badge({ track }) {
  return <span className={`track-mark ${track.color}`} aria-hidden="true">{track.mark}</span>;
}

function NavLink({ page, id, children, className, onClick }) {
  return <a href={`#${page}${id ? '/' + id : ''}`} className={className} onClick={onClick}>{children}</a>;
}

function App() {
  const [route, setRoute] = useState(currentRoute);
  const [profile, setProfile] = useState(readProfile);
  const [search, setSearch] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const update = () => {
      setRoute(currentRoute());
      setSearch(null);
      setMobileNav(false);
      window.scrollTo(0, 0);
    };
    const keyboard = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearch('');
      }
      if (event.key === 'Escape') setSearch(null);
    };
    window.addEventListener('hashchange', update);
    window.addEventListener('keydown', keyboard);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('keydown', keyboard);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storage, JSON.stringify(profile));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [profile]);

  const topic = getTopic(route.id);
  const track = getTrack(route.id);
  const openedTopicId = route.page === 'lesson' ? topic?.id : undefined;
  useEffect(() => {
    if (openedTopicId) {
      setProfile(value => value.started[openedTopicId] ? value : {
        ...value, started: { ...value.started, [openedTopicId]: Date.now() },
      });
    }
  }, [openedTopicId]);
  const active = ['lesson', 'track'].includes(route.page) ? 'topics' : route.page === 'quiz' ? 'tests' : route.page;
  const sectionTitle = mainNav.find(([page]) => page === active)?.[1] ?? 'Profile';
  const pending = topics.filter(item => profile.reviews[item.id]?.due <= Date.now());
  const completed = topics.filter(item => profile.passed[item.id]).length;
  const available = topics.filter(item => !profile.passed[item.id] && ready(item, profile));
  const next = available.findLast(item => profile.started[item.id]) ?? available[0];
  const setAttempt = (mode, subject, answers, correct) => {
    setProfile(previous => recordAttempt(previous, mode, subject, answers, correct));
  };

  let view;
  switch (route.page) {
    case 'topics':
      view = <Library page="topics" profile={profile} />;
      break;
    case 'practice':
    case 'rules':
      view = <Library key={route.page + (route.id ?? '')} page={route.page} initialTopic={route.id} profile={profile} />;
      break;
    case 'track':
      if (track) view = <Track track={track} profile={profile} />;
      break;
    case 'lesson':
      if (topic) view = <Lesson topic={topic} profile={profile} />;
      break;
    case 'tests':
      view = <Tests profile={profile} pending={pending} />;
      break;
    case 'quiz':
      view = <Quiz key={`${route.id}-${route.mode}`} topic={topic} track={track} mode={route.mode} profile={profile} save={setAttempt} />;
      break;
    case 'lab':
      view = <Lab key={route.id ?? "default"} exerciseId={route.id} save={setAttempt} />;
      break;
    case 'profile':
      view = <Profile profile={profile} completed={completed} pending={pending} onSave={name => setProfile(value => ({ ...value, name }))} />;
      break;
  }

  return (
    <div className="shell">
      {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <aside className={mobileNav ? 'sidebar sidebar-open' : 'sidebar'}>
        <NavLink page="home" className="brand"><span className="brand-icon"><Braces size={21} /></span><span>LearnOS<span className="brand-point">.</span></span></NavLink>
        <div className="workspace-label">Learning workspace</div>
        <nav aria-label="Workspace" className="side-nav">
          {mainNav.map(([page, label, Icon]) => (
            <NavLink key={page} page={page} className={active === page ? 'nav-item active' : 'nav-item'} onClick={() => setMobileNav(false)}>
              <Icon size={18} /> <span>{label}</span>
              {page === 'tests' && pending.length > 0 && <span className="nav-count">{pending.length}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-progress">
            <div><span>Course progress</span><strong>{completed}/{topics.length}</strong></div>
            <progress value={completed} max={topics.length} aria-label="Course progress" />
          </div>
          <NavLink page="profile" className="student-link" onClick={() => setMobileNav(false)}>
            <span className="avatar">{profile.name.trim()[0]?.toUpperCase() ?? <UserRound size={17} />}</span>
            <span><strong>{profile.name || 'My profile'}</strong><small>Student workspace</small></span>
            <ChevronRight size={15} className="profile-arrow" />
          </NavLink>
        </div>
      </aside>
      <div className="viewport">
        <header className="topbar">
          <button className="icon-button menu-toggle" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={21} /></button>
          <div className="breadcrumbs"><NavLink page="home">Workspace</NavLink><ChevronRight size={14} /><strong>{sectionTitle}</strong></div>
          <button className="search-trigger" aria-label="Search topics" onClick={() => setSearch('')}><Search size={17} /><span>Search topics</span><kbd>⌘ K</kbd></button>
          <NavLink page="profile" className="header-profile"><UserRound size={18} /><span className="sr-only">My profile</span></NavLink>
        </header>
        <main id="main" className="main">
          {storageError && <p className="notice" role="status">This browser blocked progress storage. Changes may be lost when you close the page.</p>}
          {view ?? <Dashboard profile={profile} completed={completed} pending={pending} next={next} />}
        </main>
      </div>
      {search !== null && <SearchDialog value={search} onChange={setSearch} close={() => setSearch(null)} />}
    </div>
  );
}

function SearchDialog({ value, onChange, close }) {
  const search = value.trim().toLowerCase();
  const matches = topics.filter(topic => [topic.title, getTrack(topic.trackId).name, topic.rule, topic.cues].join(' ').toLowerCase().includes(search)).slice(0, 10);
  return <div className="modal-backdrop" onClick={close}>
    <section role="dialog" aria-modal="true" aria-label="Search topics" className="search-dialog" onClick={event => event.stopPropagation()}>
      <div className="dialog-input"><Search size={21} /><input aria-label="Search topic or technique" placeholder="Search topic or technique" value={value} onChange={event => onChange(event.target.value)} autoFocus /><button className="icon-button" aria-label="Close search" onClick={close}><X size={19} /></button></div>
      {matches.length === 0 && <p className="empty">No matching topics.</p>}
      <div className="search-results">
        {matches.map(topic => <NavLink key={topic.id} page="lesson" id={topic.id} onClick={close}><Badge track={getTrack(topic.trackId)} /><span><strong>{topic.title}</strong><small>{getTrack(topic.trackId).name}</small></span><ChevronRight size={16} /></NavLink>)}
      </div>
    </section>
  </div>;
}

function Heading({ title, description, badge }) {
  return <div className="page-heading">{badge}<div><h1>{title}</h1><p>{description}</p></div></div>;
}

function Dashboard({ profile, completed, pending, next }) {
  const nextTrack = next ? getTrack(next.trackId) : null;
  return <>
    <Heading title={profile.name ? `Welcome, ${profile.name}` : 'Learning overview'} description="Pick up a topic, try a problem, or review what you’ve learned." />
    <section className="hero">
      <div className="hero-content"><span className="hero-label"><GraduationCap size={17} /> {next ? 'Next up in ' + nextTrack.name : 'Ready to review'}</span>
        <h2>{next?.title ?? 'Revisit what you know'}</h2>
        <p>{next ? `Level ${next.level} · ${next.minutes} min lesson · Knowledge check` : 'Use your topic library to practise or take a mixed track test.'}</p>
        <NavLink page={next ? 'lesson' : 'tests'} id={next?.id} className="button hero-button">{next ? (completed ? 'Continue learning' : 'Start learning') : 'Open tests & recall'} <ArrowUpRight size={17} /></NavLink>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="art-grid" /><div className="art-window"><div className="art-top"><i /><i /><i /></div><div className="art-code"><span className="art-bracket">&lt;/&gt;</span><span className="art-lines"><i /><i /><i /><i /></span></div></div><span className="art-float"><Check size={20} strokeWidth={2.5} /></span><span className="art-small"><Braces size={19} /></span></div>
    </section>
    <div className="metric-row">
      <Metric icon={BookOpen} color="blue" label="Topics passed" value={`${completed} / ${topics.length}`} />
      <Metric icon={Layers3} color="green" label="Tracks available" value={tracks.length} />
      <Metric icon={RotateCcw} color="violet" label="Reviews due" value={pending.length} />
    </div>
    <div className="overview-grid">
      <section className="section"><div className="section-heading"><h2>Learning tracks</h2><NavLink page="topics" className="plain-link">All topics <ChevronRight size={15} /></NavLink></div>
        <TrackCards profile={profile} />
      </section>
      <section className="section"><div className="section-heading"><h2>Study tools</h2></div>
        <div className="side-card">
          <ToolLink page="practice" icon={Code2} color="blue" title="Practice Library" text="Exercises and LeetCode links by topic" />
          <ToolLink page="rules" icon={Lightbulb} color="orange" title="Rules & Tricks" text="Algorithm cues and edge-case checklists" />
          <ToolLink page="tests" icon={ClipboardCheck} color="green" title="Tests & Recall" text={pending.length ? `${pending.length} reviews ready` : 'Mixed tests and spaced review'} />
          <ToolLink page="lab" icon={FlaskConical} color="violet" title="Code & Math Lab" text="Markup previews and function graphs" />
        </div>
      </section>
    </div>
  </>;
}

function Metric({ icon: Icon, color, label, value }) {
  return <div className="metric"><span className={`soft-icon ${color}`}><Icon size={20} /></span><div><span>{label}</span><strong>{value}</strong></div></div>;
}

function ToolLink({ page, icon: Icon, color, title, text }) {
  return <NavLink page={page} className="tool-link"><span className={`soft-icon ${color}`}><Icon size={19} /></span><span><strong>{title}</strong><small>{text}</small></span><ChevronRight size={16} /></NavLink>;
}

function TrackCards({ profile, items = tracks }) {
  return <div className="track-grid">{items.map(track => {
    const count = track.topics.filter(topic => profile.passed[topic.id]).length;
    return <NavLink key={track.id} page="track" id={track.id} className="track-card">
      <div className="track-main"><Badge track={track} /><div><strong>{track.name}</strong><small>{track.label}</small></div><ChevronRight size={17} /></div>
      <div className="track-progress"><progress value={count} max={track.topics.length} aria-label={`${track.name} progress`} /><span>{count}/{track.topics.length}</span></div>
    </NavLink>;
  })}</div>;
}

function Library({ page, initialTopic, profile }) {
  const [filter, setFilter] = useState(initialTopic ? getTopic(initialTopic)?.trackId ?? 'all' : 'all');
  const [query, setQuery] = useState('');
  const [progressFilter, setProgressFilter] = useState('all');
  const [focused, setFocused] = useState(initialTopic);
  const description = pageInfo[page];
  const matches = topics.filter(topic => (
    (filter === 'all' || topic.trackId === filter) &&
    (progressFilter === 'all' || (progressFilter === 'passed' ? profile.passed[topic.id] : profile.started[topic.id] || profile.passed[topic.id])) &&
    [topic.title, getTrack(topic.trackId).name, topic.rule, topic.cues, ...topic.practice.flat()].join(' ').toLowerCase().includes(query.trim().toLowerCase())
  ));
  const shown = focused && matches.some(topic => topic.id === focused) ? [getTopic(focused)] : matches;

  return <>
    <Heading title={description[0]} description={description[1]} />
    <div className="filter-bar">
      <label className="field-search"><Search size={18} /><input type="search" aria-label="Filter topics" placeholder="Search topics or techniques" value={query} onChange={event => { setQuery(event.target.value); setFocused(null); }} /></label>
      <select aria-label="Language track" value={filter} onChange={event => { setFilter(event.target.value); setFocused(null); }}>
        <option value="all">All tracks</option>{tracks.map(track => <option key={track.id} value={track.id}>{track.name}</option>)}
      </select>
      <select aria-label="Topic progress" value={progressFilter} onChange={event => { setProgressFilter(event.target.value); setFocused(null); }}><option value="all">All progress</option><option value="started">Started topics</option><option value="passed">Passed topics</option></select>
    </div>
    {shown.length === 0 && <p className="empty panel">No topics match these filters.</p>}
    {page === 'topics' && !query && progressFilter === 'all' ? <TrackCards profile={profile} items={tracks.filter(track => filter === 'all' || filter === track.id)} /> :
      <div className="stack">{shown.map(topic => <article key={topic.id} className="panel topic-panel">
        <div className="topic-title"><Badge track={getTrack(topic.trackId)} /><div><h2>{topic.title}</h2><p>{getTrack(topic.trackId).name} · Level {topic.level}</p></div><NavLink page="lesson" id={topic.id} className="plain-link">Open lesson <ChevronRight size={15} /></NavLink></div>
        {page === 'rules' && <Rules topic={topic} />}{page === 'practice' && <Practice topic={topic} />}
      </article>)}</div>}
    {focused && shown.length > 0 && <button className="button secondary space-top" onClick={() => setFocused(null)}>Show all {getTrack(filter)?.name ?? ''} topics</button>}
  </>;
}

function Track({ track, profile }) {
  const count = track.topics.filter(topic => profile.passed[topic.id]).length;
  return <>
    <NavLink page="topics" className="back-link"><ChevronLeft size={17} /> My Topics</NavLink>
    <Heading title={track.name} description={track.label + ` · ${count} of ${track.topics.length} topics passed`} badge={<Badge track={track} />} />
    <div className="stack">
      {track.topics.map(topic => <NavLink key={topic.id} page="lesson" id={topic.id} className="panel level-row">
        <span className={`level-number ${profile.passed[topic.id] ? 'is-passed' : ''}`}>{profile.passed[topic.id] ? <Check size={20} /> : topic.level}</span>
        <span><small>Level {topic.level} · {topic.minutes} min</small><strong>{topic.title}</strong></span>
        <span className="level-status">{profile.passed[topic.id] ? 'Passed' : ready(topic, profile) ? 'Ready to test' : 'Lesson available'}<ChevronRight size={17} /></span>
      </NavLink>)}
      <div className="panel level-row"><span className="level-number"><ClipboardCheck size={21} /></span><span><small>{trackPassed(track, profile) ? 'Track complete' : 'Track assessment'}</small><strong>Mixed test</strong></span>
        {count === track.topics.length ? <a href={`#quiz/${track.id}/mixed`} className="button primary">Start test</a> : <span className="level-status"><LockKeyhole size={15} /> Pass all topic checks</span>}
      </div>
    </div>
  </>;
}

function Rules({ topic }) {
  return <dl className="rules-list">
    <div><dt><Target size={17} /> How to spot it</dt><dd>{topic.cues}</dd></div>
    <div><dt><Lightbulb size={17} /> Rule to remember</dt><dd>{topic.rule}</dd></div>
    <div><dt><CircleHelp size={17} /> Edge cases to try</dt><dd>{topic.edges}</dd></div>
  </dl>;
}

function Practice({ topic }) {
  const [exercise, ...links] = topic.practice;
  return <div className="practice-list">
    <p>{exercise}</p>
    {links.map(([provider, title, url]) => <a key={url} className="external-card" href={url} target="_blank" rel="noreferrer"><span><strong>{title}</strong><small>{provider}{provider.startsWith('LeetCode') ? ' · Easy' : ''}</small></span><ExternalLink size={17} /></a>)}
    {exercises[topic.id] && <NavLink page="lab" id={topic.id} className="plain-link">Run this exercise in LearnOS <ChevronRight size={15} /></NavLink>}
    {['html', 'css'].includes(topic.trackId) && <NavLink page="lab" className="plain-link">Open HTML & CSS preview <ChevronRight size={15} /></NavLink>}
  </div>;
}

function Lesson({ topic, profile }) {
  const track = getTrack(topic.trackId);
  const isReady = ready(topic, profile);
  return <>
    <NavLink page="track" id={track.id} className="back-link"><ChevronLeft size={17} /> {track.name}</NavLink>
    <Heading title={topic.title} description={`Level ${topic.level} · ${topic.minutes} min lesson`} badge={<Badge track={track} />} />
    <div className="lesson-grid">
      <div className="stack">
        <section className="panel content-panel"><h2>Learn the concept</h2><p>{topic.explanation}</p><h3>Worked example</h3><pre><code>{topic.example}</code></pre><a className="plain-link" href={track.reference} target="_blank" rel="noreferrer">Official {track.name} documentation <ExternalLink size={14} /></a></section>
        <section className="panel content-panel"><h2>Rules & Tricks</h2><Rules topic={topic} /></section>
        <section className="panel content-panel"><h2>Practise this topic</h2><Practice topic={topic} /></section>
      </div>
      <aside className="panel content-panel lesson-side"><span className="soft-icon blue"><ClipboardCheck size={21} /></span><h2>Knowledge check</h2>
        {isReady ? <><p>{profile.passed[topic.id] ? 'You’ve passed this topic. You can take the check again at any time.' : 'Answer two questions to pass this topic and schedule your first Recall review.'}</p><a href={`#quiz/${topic.id}/check`} className="button primary">{profile.passed[topic.id] ? 'Retake check' : 'Start check'}</a></> : <><p>Pass the prerequisite check to unlock this topic’s assessment.</p><NavLink page="lesson" id={topic.prerequisite} className="plain-link">{getTopic(topic.prerequisite).title} <ChevronRight size={15} /></NavLink></>}
      </aside>
    </div>
  </>;
}

function Tests({ profile, pending }) {
  const histories = profile.attempts;
  const scheduled = topics.filter(topic => (profile.reviews[topic.id]?.due ?? 0) > Date.now()).sort((a, b) => profile.reviews[a.id].due - profile.reviews[b.id].due);
  return <>
    <Heading title={pageInfo.tests[0]} description={pageInfo.tests[1]} />
    <section className="panel content-panel stack-section"><h2>Recall queue</h2>
      {!pending.length && <p>No reviews are due. Passing a topic check schedules the first review for tomorrow.</p>}
      {pending.map(topic => <div className="small-row" key={topic.id}><span><strong>{topic.title}</strong><small>{getTrack(topic.trackId).name} · Due now</small></span><a href={`#quiz/${topic.id}/review`} className="button primary">Review</a></div>)}
      {scheduled.map(topic => <div className="small-row" key={topic.id}><span><strong>{topic.title}</strong><small>Due {new Date(profile.reviews[topic.id].due).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small></span><a href={`#quiz/${topic.id}/review`} className="button secondary">Review early</a></div>)}
    </section>
    <section className="panel content-panel stack-section"><h2>Mixed track tests</h2><p>Apply several skills in one test. Questions appear without technique labels.</p>
      {tracks.map(track => {
        const available = track.topics.every(topic => profile.passed[topic.id]);
        return <div key={track.id} className="small-row"><span><strong>{track.name}</strong><small>{trackPassed(track, profile) ? 'Passed' : available ? 'Available' : 'Pass every topic check to unlock'}</small></span>{available ? <a href={`#quiz/${track.id}/mixed`} className="button primary">Start test</a> : <LockKeyhole size={17} />}</div>;
      })}
    </section>
    <section className="panel content-panel stack-section"><h2>Attempt history</h2>
      {!histories.length && <p>Your LearnOS test and review results will appear here.</p>}
      {histories.map((attempt, index) => {
        const item = getTopic(attempt.subject) ?? getTrack(attempt.subject);
        const label = attempt.mode === 'mixed' ? 'Mixed test' : attempt.mode === 'review' ? 'Recall' : attempt.mode === 'code' ? 'Coding exercise' : 'Topic check';
        return item && <details className="history-item" key={`${attempt.at}-${index}`}><summary>{item.title ?? item.name} · {label}<span>{attempt.score}/{attempt.total} · {new Date(attempt.at).toLocaleDateString()}</span></summary><div className="history-body">{(attempt.mode === 'code' ? (exercises[attempt.subject]?.cases ?? []).map(item => [item.label, true]) : attemptQuestions(attempt.mode, getTopic(attempt.subject), getTrack(attempt.subject))).map((question, qIndex) => <p key={question[0]}><strong>{question[0]}</strong><br />{attempt.answers[qIndex] === question[1] ? 'Correct' : attempt.mode === 'code' ? 'Case failed' : `Your answer: ${attempt.answers[qIndex]}. Correct answer: ${question[1]}.`}</p>)}</div></details>;
      })}
    </section>
  </>;
}

function attemptQuestions(mode, topic, track) {
  if (mode === 'mixed') return track?.topics.map(item => item.questions[2]) ?? [];
  return mode === 'review' ? topic?.questions.slice(3, 4) ?? [] : topic?.questions.slice(0, 2) ?? [];
}

function Quiz({ topic, track, mode, profile, save }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const available = mode === 'mixed' ? track?.topics.every(item => profile.passed[item.id]) : mode === 'review' ? Boolean(topic && profile.passed[topic.id]) : mode === 'check' && topic && ready(topic, profile);
  if (!available) return <><Heading title="Assessment locked" description="Complete its prerequisite checks to unlock this assessment." /><NavLink page="tests" className="button secondary">Back to tests</NavLink></>;
  const questions = attemptQuestions(mode, topic, track);
  const title = mode === 'mixed' ? `${track.name} mixed test` : mode === 'review' ? `Recall · ${topic.title}` : topic.title;
  const subject = mode === 'mixed' ? track.id : topic.id;
  const correct = questions.map(question => question[1]);

  function submit(event) {
    event.preventDefault();
    if (Object.keys(answers).length < questions.length || result) return;
    const ordered = questions.map((_, index) => answers[index]);
    const score = ordered.filter((answer, index) => answer === correct[index]).length;
    save(mode, subject, ordered, correct);
    setResult({ score, total: questions.length });
  }

  return <>
    <NavLink page="tests" className="back-link"><ChevronLeft size={17} /> Tests & Recall</NavLink>
    <Heading title={title} description={mode === 'check' ? 'Topic check · Answer every question correctly to pass.' : mode === 'mixed' ? 'Choose the approach that fits each scenario.' : 'A short check to see what you still remember.'} />
    <form className="stack quiz" onSubmit={submit}>
      {questions.map(([prompt, ...choices], index) => {
        const rotate = (prompt.length + index) % choices.length;
        const ordered = [...choices.slice(rotate), ...choices.slice(0, rotate)];
        return <fieldset key={prompt} className="panel content-panel" disabled={Boolean(result)}>
          <legend>{prompt}</legend>
          {ordered.map(choice => <label key={choice} className={`answer ${result && choice === correct[index] ? 'correct' : ''} ${result && choice === answers[index] && choice !== correct[index] ? 'incorrect' : ''}`}><input type="radio" required name={`choice-${index}`} value={choice} checked={answers[index] === choice} onChange={() => setAnswers(current => ({ ...current, [index]: choice }))} />{choice}</label>)}
        </fieldset>;
      })}
      {result ? <div className="panel content-panel result" role="status">
        <h2>{result.score === result.total ? 'Passed' : 'Keep practising'} · {result.score}/{result.total}</h2>
        <p>{mode === 'review' ? 'Your next review date has been updated.' : result.score === result.total ? 'Your result is saved in your profile.' : 'Review the correct answers and return when you are ready.'}</p>
        {topic && <NavLink page={mode === 'review' ? 'tests' : 'lesson'} id={mode === 'review' ? undefined : topic.id} className="button secondary">{mode === 'review' ? 'Back to Recall' : 'Review lesson'}</NavLink>}
        {track && <NavLink page="track" id={track.id} className="button secondary">Return to track</NavLink>}
      </div> : <div><button type="submit" className="button primary" disabled={Object.keys(answers).length !== questions.length}>Submit answers</button></div>}
    </form>
  </>;
}

function Profile({ profile, onSave, completed, pending }) {
  const [name, setName] = useState(profile.name);
  const [saved, setSaved] = useState(false);
  return <>
    <Heading title="My profile" description="Your learning progress, practice library, and review history." />
    <div className="metric-row"><Metric icon={BookOpen} color="blue" value={completed} label="Topics passed" /><Metric icon={ClipboardCheck} color="green" value={profile.attempts.length} label="LearnOS attempts" /><Metric icon={RotateCcw} color="violet" value={pending.length} label="Reviews due" /></div>
    <div className="overview-grid profile-grid"><section className="panel content-panel"><h2>Display name</h2><p>Your profile and progress are saved in this browser.</p>
      <form className="name-form" onSubmit={event => { event.preventDefault(); onSave(name.trim()); setSaved(true); }}><label htmlFor="display-name">Name</label><input id="display-name" maxLength={40} value={name} onChange={event => { setName(event.target.value); setSaved(false); }} placeholder="Enter your name" /><button className="button primary">Save profile</button>{saved && <span role="status" className="success-text">Saved</span>}</form>
    </section><div className="side-card"><ToolLink page="topics" icon={BookOpen} color="blue" title="My Topics" text="Open or revisit a lesson" /><ToolLink page="practice" icon={Code2} color="blue" title="Practice Library" text="Find the exercises for any topic" /><ToolLink page="rules" icon={Lightbulb} color="orange" title="Rules & Tricks" text="Look up techniques and boundaries" /><ToolLink page="tests" icon={ClipboardCheck} color="green" title="Tests & Recall" text="See your history and due reviews" /></div></div>
  </>;
}

const starter = '<main>\n  <h1>Campus news</h1>\n  <p>The programming lab opens Friday.</p>\n</main>';
const starterStyle = 'main { font: 1rem system-ui; max-width: 30rem; padding: 1.5rem; }\nh1 { color: #2455cf; }';

function Lab({ exerciseId, save }) {
  const [tab, setTab] = useState(exercises[exerciseId] ? 'javascript' : 'code');
  const [html, setHtml] = useState(starter);
  const [css, setCss] = useState(starterStyle);
  const [preview, setPreview] = useState([starter, starterStyle]);
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);
  const origins = 'default-src \'none\'; style-src \'unsafe-inline\'; img-src data:; form-action \'none\'; base-uri \'none\'';
  return <>
    <Heading title={pageInfo.lab[0]} description={pageInfo.lab[1]} />
    <div className="tabs"><button className={tab === 'code' ? 'selected' : ''} aria-pressed={tab === 'code'} onClick={() => setTab('code')}>HTML & CSS preview</button><button className={tab === 'javascript' ? 'selected' : ''} aria-pressed={tab === 'javascript'} onClick={() => setTab('javascript')}>JavaScript exercises</button><button className={tab === 'math' ? 'selected' : ''} aria-pressed={tab === 'math'} onClick={() => setTab('math')}>Function plotter</button></div>
    {tab === 'code' ? <div className="lesson-grid lab-grid">
      <section className="panel content-panel"><h2>Editor</h2><label htmlFor="html-editor">HTML</label><textarea id="html-editor" spellCheck={false} value={html} maxLength={20000} onChange={event => setHtml(event.target.value)} /><label htmlFor="css-editor">CSS</label><textarea id="css-editor" spellCheck={false} value={css} maxLength={12000} onChange={event => setCss(event.target.value)} /><button className="button primary" onClick={() => setPreview([html, css])}>Update preview</button></section>
      <section className="panel content-panel"><h2>Preview</h2><iframe title="Rendered HTML and CSS" sandbox="" srcDoc={`<!doctype html><meta http-equiv="Content-Security-Policy" content="${origins}"><style>${preview[1]}</style>${preview[0]}`} /></section>
    </div> : tab === 'javascript' ? <JavaScriptLab initialId={exerciseId} save={save} /> : <div className="panel content-panel">
      <h2>Linear function</h2><p>y = {slope}x {intercept < 0 ? '−' : '+'} {Math.abs(intercept)}</p>
      <div className="slider-row"><label>Slope <strong>{slope}</strong><input aria-label="Slope" type="range" min="-3" max="3" step=".5" value={slope} onChange={e => setSlope(Number(e.target.value))} /></label><label>Intercept <strong>{intercept}</strong><input aria-label="Intercept" type="range" min="-5" max="5" step="1" value={intercept} onChange={e => setIntercept(Number(e.target.value))} /></label></div>
      <svg className="plot" viewBox="0 0 600 300" role="img" aria-label={`Line graph with slope ${slope} and intercept ${intercept}`}>
        <defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 H 0 V 30" fill="none" stroke="#e1e8f5" /></pattern></defs>
        <rect width="600" height="300" fill="url(#grid)" /><path d="M0 150H600 M300 0V300" stroke="#95a5c0" /><path d={`M0 ${150 - 30 * (slope * -10 + intercept)}L600 ${150 - 30 * (slope * 10 + intercept)}`} stroke="#3458dc" strokeWidth="4" />
      </svg>
    </div>}
  </>;
}

function JavaScriptLab({ initialId, save }) {
  const [id, setId] = useState(exercises[initialId] ? initialId : 'js-basics');
  const work = exercises[id];
  const [code, setCode] = useState(work.starter);
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  async function run() {
    setRunning(true);
    setError('');
    setResults(null);
    try {
      const outcome = await evaluateExercise(work, code);
      setResults(outcome);
      save('code', id, outcome.map(test => test.passed), outcome.map(() => true));
    } catch {
      setError('The JavaScript runner could not complete this attempt. Try again.');
    } finally {
      setRunning(false);
    }
  }

  return <div className="lesson-grid lab-grid">
    <section className="panel content-panel">
      <h2>JavaScript exercise</h2>
      <label htmlFor="exercise">Exercise</label>
      <select id="exercise" disabled={running} value={id} onChange={event => {
        setId(event.target.value);
        setCode(exercises[event.target.value].starter);
        setResults(null);
        setError('');
      }}>{Object.entries(exercises).map(([key, item]) => <option key={key} value={key}>{item.title}</option>)}</select>
      <p>{work.prompt}</p>
      <label htmlFor="javascript-editor">Code</label>
      <textarea id="javascript-editor" spellCheck={false} maxLength={5000} value={code} onChange={event => setCode(event.target.value)} />
      <button className="button primary" disabled={running} onClick={run}>{running ? 'Running tests…' : 'Run tests'}</button>
    </section>
    <section className="panel content-panel" aria-live="polite">
      <h2>Test results</h2>
      {error ? <p>{error}</p> : results ? results.map(({ label, passed, detail }) => <div className="small-row" key={label}>
        <span><strong>{label}</strong>{detail && <small>{detail}</small>}</span>
        <span className={passed ? 'success-text' : ''}>{passed ? 'Passed' : 'Failed'}</span>
      </div>) : <p>Run your code to see the test results here.</p>}
    </section>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
