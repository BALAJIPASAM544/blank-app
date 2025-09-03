import React, { useEffect, useMemo, useState } from 'react';
import { AnalyticsOverview, EmailDetails, EmailItem, EmailPriority, EmailSentiment } from './types';
import { fetchAnalytics, fetchEmails, updateReply as apiUpdateReply } from './api';

const COLORS = {
  header: '#FABC3C',
  urgent: '#FFB238',
  normal: '#F19143',
  button: '#FF773D',
  hover: '#FF5553'
};

const initialEmails: EmailDetails[] = [
  {
    id: '1',
    sender: 'john.doe@example.com',
    subject: 'Cannot access my account',
    body: "Hi, I am unable to login to my account since yesterday. Please help.",
    dateTime: '2025-09-03 10:15 AM',
    priority: 'Urgent',
    sentiment: 'Negative',
    extracted: {
      phone: '\u202A+91-9876543210\u202C',
      alternateEmail: 'john.alt@example.com',
      productOrderId: 'ORD12345'
    },
    aiReply: "Hi John, sorry to hear you're having trouble accessing your account. Please try resetting your password using the 'Forgot Password' link. If the issue persists, reply to this message and we will assist you immediately."
  },
  {
    id: '2',
    sender: 'sara.lee@example.com',
    subject: 'Feature request: Dark mode improvements',
    body: 'Loving the product! Could you add scheduled dark mode based on local time?',
    dateTime: '2025-09-02 09:05 AM',
    priority: 'Normal',
    sentiment: 'Positive'
  },
  {
    id: '3',
    sender: 'mike.ross@example.com',
    subject: 'Subscription renewal question',
    body: 'I received a renewal notice but already paid. Can you check?',
    dateTime: '2025-09-01 04:20 PM',
    priority: 'Normal',
    sentiment: 'Neutral'
  },
  {
    id: '4',
    sender: 'support@acme-corp.com',
    subject: 'Payment failed for invoice INV-7789',
    body: 'Payment failed due to card expiration. Please update your billing method.',
    dateTime: '2025-09-03 08:47 AM',
    priority: 'Urgent',
    sentiment: 'Negative'
  },
  {
    id: '5',
    sender: 'devrel@example.com',
    subject: 'Thanks for the quick fix!',
    body: 'The issue was resolved. Appreciate the fast turnaround.',
    dateTime: '2025-09-02 01:10 PM',
    priority: 'Normal',
    sentiment: 'Positive'
  }
];

function computeAnalytics(emails: EmailItem[]): AnalyticsOverview {
  const total = emails.length;
  const positives = emails.filter(e => e.sentiment === 'Positive').length;
  const negatives = emails.filter(e => e.sentiment === 'Negative').length;
  const neutrals = emails.filter(e => e.sentiment === 'Neutral').length;
  const urgent = emails.filter(e => e.priority === 'Urgent').length;
  return {
    totalEmails: total,
    positiveEmails: positives,
    negativeEmails: negatives,
    neutralEmails: neutrals,
    urgentEmails: urgent,
    averageResponse: '2h 15m'
  };
}

type Theme = 'light' | 'dark';

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [emails, setEmails] = useState<EmailDetails[]>(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState<EmailDetails | null>(emails[0]);
  const [sentimentFilter, setSentimentFilter] = useState<'All' | EmailSentiment>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | EmailPriority>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [serverAnalytics, setServerAnalytics] = useState<AnalyticsOverview | null>(null);
  const analytics = serverAnalytics ?? useMemo(() => computeAnalytics(emails), [emails]);

  useEffect(() => {
    fetchEmails({ sentiment: sentimentFilter, priority: priorityFilter, q: searchQuery, sort: sortOrder })
      .then(setEmails)
      .catch(() => { /* fallback keeps local data */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentimentFilter, priorityFilter, searchQuery, sortOrder]);

  useEffect(() => {
    fetchAnalytics()
      .then(setServerAnalytics)
      .catch(() => setServerAnalytics(null));
  }, [emails.length]);

  const filtered: EmailDetails[] = useMemo(() => {
    let data = [...emails];
    if (sentimentFilter !== 'All') {
      data = data.filter(e => e.sentiment === sentimentFilter);
    }
    if (priorityFilter !== 'All') {
      data = data.filter(e => e.priority === priorityFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(e =>
        e.sender.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      const aT = new Date(a.dateTime).getTime();
      const bT = new Date(b.dateTime).getTime();
      return sortOrder === 'desc' ? bT - aT : aT - bT;
    });
    return data;
  }, [emails, sentimentFilter, priorityFilter, searchQuery, sortOrder]);

  const selectedId = selectedEmail?.id;

  return (
    <div className={`app theme-${theme}`}>
      <Header theme={theme} onToggleTheme={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))} />
      <div className="layout">
        <Sidebar
          sentimentFilter={sentimentFilter}
          onChangeSentiment={setSentimentFilter}
          priorityFilter={priorityFilter}
          onChangePriority={setPriorityFilter}
        />
        <main className="main">
          <AnalyticsSection analytics={analytics} />
          <SearchSortSection
            searchQuery={searchQuery}
            onSearchQuery={setSearchQuery}
            sortOrder={sortOrder}
            onSortOrder={setSortOrder}
          />
          <div className="content-row">
            <EmailList
              emails={filtered}
              onSelect={setSelectedEmail}
              onFilterSentiment={setSentimentFilter}
              onFilterPriority={setPriorityFilter}
              selectedId={selectedId}
            />
            <EmailDetailsPanel email={selectedEmail} onUpdateReply={async (reply) => {
              if (!selectedEmail) return;
              try {
                const updated = await apiUpdateReply(selectedEmail.id, reply);
                setEmails(prev => prev.map(e => e.id === selectedEmail.id ? updated : e));
                setSelectedEmail(updated);
              } catch (e) {
                setEmails(prev => prev.map(e => e.id === selectedEmail.id ? { ...e, aiReply: reply } : e));
                setSelectedEmail(prev => prev ? { ...prev, aiReply: reply } : prev);
              }
            }} />
          </div>
        </main>
      </div>
    </div>
  );
}

function Header({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1>AI Email Management Dashboard</h1>
        <div className="subheading">Manage, analyze, and respond faster with AI assistance</div>
      </div>
      <div className="header-right">
        <button className="btn" title="Refresh">
          ⟳ Refresh
        </button>
        <button className="btn outline" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </header>
  );
}

function Sidebar({
  sentimentFilter,
  onChangeSentiment,
  priorityFilter,
  onChangePriority
}: {
  sentimentFilter: 'All' | EmailSentiment;
  onChangeSentiment: (s: 'All' | EmailSentiment) => void;
  priorityFilter: 'All' | EmailPriority;
  onChangePriority: (p: 'All' | EmailPriority) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Mail Management</div>
      <div className="filter-group">
        <div className="filter-label">Filter by Sentiment</div>
        <div className="segmented">
          {(['All', 'Positive', 'Neutral', 'Negative'] as const).map(key => (
            <button
              key={key}
              className={`segment ${sentimentFilter === key ? 'active' : ''}`}
              onClick={() => onChangeSentiment(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <div className="filter-label">Filter by Priority</div>
        <div className="segmented priority">
          {(['All', 'Urgent', 'Normal'] as const).map(key => (
            <button
              key={key}
              className={`segment ${priorityFilter === key ? 'active' : ''} ${key === 'Urgent' ? 'urgent' : key === 'Normal' ? 'normal' : ''}`}
              onClick={() => onChangePriority(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function AnalyticsSection({ analytics }: { analytics: AnalyticsOverview }) {
  const cards = [
    { label: 'Total Emails', value: analytics.totalEmails },
    { label: 'Positive Emails', value: analytics.positiveEmails },
    { label: 'Negative Emails', value: analytics.negativeEmails },
    { label: 'Neutral Emails', value: analytics.neutralEmails },
    { label: 'Urgent Emails', value: analytics.urgentEmails },
    { label: 'Average Response', value: analytics.averageResponse }
  ];
  return (
    <section className="section">
      <h2>Analytics Overview</h2>
      <div className="cards">
        {cards.map(c => (
          <div key={c.label} className="card">
            <div className="card-label">{c.label}</div>
            <div className="card-value">{c.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SearchSortSection({
  searchQuery,
  onSearchQuery,
  sortOrder,
  onSortOrder
}: {
  searchQuery: string;
  onSearchQuery: (v: string) => void;
  sortOrder: 'desc' | 'asc';
  onSortOrder: (v: 'desc' | 'asc') => void;
}) {
  return (
    <section className="section search-sort">
      <div className="search-row">
        <div className="sort">
          <label>Sort by date</label>
          <select value={sortOrder} onChange={e => onSortOrder(e.target.value as any)}>
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
        <div className="search">
          <label>Search an Email</label>
          <input
            type="text"
            placeholder="Search by sender, subject, body"
            value={searchQuery}
            onChange={e => onSearchQuery(e.target.value)}
          />
          <div className="filter-icon" title="More filters">⚙︎</div>
        </div>
      </div>
    </section>
  );
}

function EmailList({
  emails,
  onSelect,
  onFilterSentiment,
  onFilterPriority,
  selectedId
}: {
  emails: EmailDetails[];
  onSelect: (e: EmailDetails) => void;
  onFilterSentiment: (s: 'All' | EmailSentiment) => void;
  onFilterPriority: (p: 'All' | EmailPriority) => void;
  selectedId?: string;
}) {
  return (
    <div className="email-list">
      {(emails.length ? emails : []).slice(0, 50).map(e => (
        <div
          key={e.id}
          className={`email-item ${selectedId === e.id ? 'selected' : ''}`}
          onClick={() => onSelect(e)}
        >
          <div className="email-header-row">
            <div className="sender">{e.sender}</div>
            <div className={`priority badge ${e.priority === 'Urgent' ? 'urgent' : 'normal'}`}
                 onClick={(ev) => { ev.stopPropagation(); onFilterPriority(e.priority); }}
            >
              {e.priority}
            </div>
          </div>
          <div className="subject">{e.subject}</div>
          <div className="meta-row">
            <div className="date">{e.dateTime}</div>
            <div className={`sentiment badge ${e.sentiment.toLowerCase()}`}
                 onClick={(ev) => { ev.stopPropagation(); onFilterSentiment(e.sentiment); }}
            >
              {e.sentiment}
            </div>
          </div>
        </div>
      ))}
      {!emails.length && <div className="empty-state">No emails match your filters.</div>}
    </div>
  );
}

function EmailDetailsPanel({ email, onUpdateReply }: { email: EmailDetails | null; onUpdateReply: (v: string) => void; }) {
  if (!email) {
    return (
      <div className="email-details">
        <div className="placeholder">Select an email to view details</div>
      </div>
    );
  }
  return (
    <div className="email-details">
      <div className="details-header">
        <div className="details-title">Email Details</div>
        <div className="details-meta">{email.dateTime}</div>
      </div>
      <div className="kv"><span>Sender</span><div>{email.sender}</div></n>
      <div className="kv"><span>Subject</span><div>{email.subject}</div></div>
      <div className="kv"><span>Priority</span><div className={`badge ${email.priority === 'Urgent' ? 'urgent' : 'normal'}`}>{email.priority}</div></div>
      <div className="kv"><span>Sentiment</span><div className={`badge ${email.sentiment.toLowerCase()}`}>{email.sentiment}</div></div>
      <div className="body-block">
        <div className="label">Body</div>
        <div className="body-text">{email.body}</div>
      </div>
      {email.extracted && (
        <div className="extracted">
          <div className="label">Extracted Info</div>
          <div className="kv"><span>Phone</span><div>{email.extracted.phone}</div></div>
          <div className="kv"><span>Alternate Email</span><div>{email.extracted.alternateEmail}</div></div>
          <div className="kv"><span>Product/Order ID</span><div>{email.extracted.productOrderId}</div></div>
        </div>
      )}
      <div className="reply">
        <div className="label">Editable AI-generated Reply</div>
        <textarea
          value={email.aiReply || ''}
          onChange={(e) => onUpdateReply(e.target.value)}
          placeholder="Type your reply..."
        />
        <div className="reply-actions">
          <button className="btn">Save Draft</button>
          <button className="btn outline">Send</button>
        </div>
      </div>
    </div>
  );
}

