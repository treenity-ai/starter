import { type NodeData, register } from '@treenity/core';
import { useChildren, usePath } from '@treenity/react/hooks';
import { Button } from '@treenity/react/ui/button';
import { Input } from '@treenity/react/ui/input';
import { useState } from 'react';
import {
  ExampleCounter, ExampleTodoList, ExampleTodoItem,
  ExamplePoll, ExampleShowcase,
} from './types';

// ── Counter View ──

function CounterView({ value }: { value: NodeData }) {
  const counter = usePath(value.$path, ExampleCounter);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-5xl font-mono font-bold tabular-nums">{counter.count}</div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => counter.decrement()}>−</Button>
        <Button size="sm" variant="outline" onClick={() => counter.reset()}>Reset</Button>
        <Button size="sm" onClick={() => counter.increment()}>+</Button>
      </div>
    </div>
  );
}
register('example.counter', 'react', CounterView as any);

// ── Todo List View ──

function TodoListView({ value }: { value: NodeData }) {
  const list = usePath(value.$path, ExampleTodoList);
  const children = useChildren(value.$path, { watch: true, watchNew: true });
  const [draft, setDraft] = useState('');

  const handleAdd = async () => {
    if (!draft.trim()) return;
    await list.add({ title: draft });
    setDraft('');
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          className="flex-1"
          placeholder="Add a todo..."
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <Button size="sm" onClick={handleAdd}>Add</Button>
      </div>
      <ul className="space-y-1">
        {children.map(child => (
          <TodoItemRow key={child.$path} value={child} />
        ))}
      </ul>
    </div>
  );
}
register('example.todo.list', 'react', TodoListView as any);

function TodoItemRow({ value }: { value: NodeData }) {
  const item = usePath(value.$path, ExampleTodoItem);

  return (
    <li
      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted cursor-pointer"
      onClick={() => item.toggle()}
    >
      <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs
        ${item.done ? 'bg-primary border-primary text-primary-foreground' : 'border-input'}`}>
        {item.done ? '✓' : ''}
      </span>
      <span className={item.done ? 'line-through text-muted-foreground' : ''}>
        {item.title}
      </span>
    </li>
  );
}
register('example.todo.item', 'react', TodoItemRow as any);

// ── Poll View ──

function PollView({ value }: { value: NodeData }) {
  const poll = usePath(value.$path, ExamplePoll);
  const totalVotes = Object.values(poll.votes).reduce((s, n) => s + n, 0);
  const closed = poll.status === 'closed';

  return (
    <div className="space-y-3">
      <div className="font-medium">{poll.question}</div>

      <div className="space-y-2">
        {poll.options.map(opt => {
          const count = poll.votes[opt] || 0;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          return (
            <button
              key={opt}
              disabled={closed}
              onClick={() => poll.vote({ option: opt })}
              className="w-full text-left px-3 py-2 rounded border border-input
                hover:bg-muted disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex justify-between text-sm mb-1">
                <span>{opt}</span>
                <span className="text-muted-foreground">{count} ({pct}%)</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
        {!closed && (
          <Button size="sm" variant="ghost" onClick={() => poll.close()}>
            Close poll
          </Button>
        )}
        {closed && <span>Poll closed</span>}
      </div>
    </div>
  );
}
register('example.poll', 'react', PollView as any);

// ── Ticker View ──

function TickerView({ value }: { value: NodeData }) {
  const children = useChildren(value.$path, { watch: true, watchNew: true });
  const last = children.slice(-8).reverse();

  return (
    <div className="space-y-1 font-mono text-sm">
      {last.map((n, i) => {
        const val = n.value as number;
        const seq = n.seq as number;
        const time = new Date(n.ts as number).toLocaleTimeString();
        const barW = Math.round(((val - 25) / 55) * 100);
        return (
          <div
            key={n.$path}
            className="flex items-center gap-2 px-2 py-1 rounded"
            style={{ opacity: 1 - i * 0.1 }}
          >
            <span className="text-muted-foreground w-8">#{seq}</span>
            <span className="text-muted-foreground w-16">{time}</span>
            <span className="w-10 text-right font-medium">{val}</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/60 transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, barW))}%` }}
              />
            </div>
          </div>
        );
      })}
      {last.length === 0 && (
        <div className="text-muted-foreground text-center py-4">Waiting for data...</div>
      )}
    </div>
  );
}
register('example.ticker', 'react', TickerView as any);

// ── Showcase Root View ──

const DEMOS: Record<string, { label: string; desc: string }> = {
  'example.counter':   { label: 'Counter',   desc: 'Simplest type + actions' },
  'example.todo.list': { label: 'Todo List',  desc: 'Children + useChildren' },
  'example.poll':      { label: 'Poll',       desc: 'State machine + validation' },
  'example.ticker':    { label: 'Ticker',     desc: 'Service + live data' },
};

const VIEW_MAP: Record<string, (props: { value: NodeData }) => JSX.Element> = {
  'example.counter': CounterView,
  'example.todo.list': TodoListView,
  'example.poll': PollView,
  'example.ticker': TickerView,
};

function ShowcaseView({ value }: { value: NodeData }) {
  const showcase = usePath(value.$path, ExampleShowcase);
  const children = useChildren(value.$path, { watch: true });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{showcase.title}</h1>
        <p className="text-muted-foreground">{showcase.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map(child => {
          const demo = DEMOS[child.$type];
          const View = VIEW_MAP[child.$type];
          if (!demo || !View) return null;
          return (
            <div key={child.$path} className="border rounded-lg p-5 space-y-3">
              <div>
                <h2 className="font-semibold">{demo.label}</h2>
                <p className="text-xs text-muted-foreground">{demo.desc}</p>
              </div>
              <View value={child} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
register('example.showcase', 'react', ShowcaseView as any);
