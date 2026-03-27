import { useEffect, useState, useCallback } from 'react';
import Layout from './Layout';
import API from '../api/axiosInstance';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

/* ─── constants ─── */
const COLORS = ['#7c6fe0','#3b82f6','#f97316','#059669','#dc2626','#d97706','#8b5cf6','#0ea5e9','#ec4899','#14b8a6'];
const REPORT_TYPES = [
  { id:'inventory',     label:'📚 Book Inventory',   desc:'Stock & availability' },
  { id:'users',         label:'👤 User Activity',     desc:'Engagement tracking' },
  { id:'transactions',  label:'🔄 Issue & Return',    desc:'All transactions' },
  { id:'overdue',       label:'⏰ Overdue & Fines',    desc:'Penalty tracking' },
  { id:'popular',       label:'📈 Popular Books',     desc:'Trending analytics' },
  { id:'categories',    label:'🏷️ Category-wise',     desc:'Demand by category' },
  { id:'subscriptions', label:'💰 Subscriptions',     desc:'Payment summary' },
];

/* ─── helpers ─── */
const fmt   = (n) => (n == null ? '—' : Number(n).toLocaleString());
const fmtRs = (n) => `₹${fmt(n ?? 0)}`;
const today = () => new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
const isOverdue = (r) => !r.returned && r.dueDate && new Date(r.dueDate) < new Date();
const daysLate  = (d) => Math.max(0, Math.ceil((new Date() - new Date(d)) / 86400000));
const calcFine  = (r) => isOverdue(r) ? daysLate(r.dueDate) * 5 : 0;

/* ─── sub-components ─── */
function Badge({ text, color = '#7c6fe0' }) {
  return (
    <span style={{
      display:'inline-block', padding:'2px 9px', borderRadius:'99px',
      background: color+'22', color, fontSize:'11px', fontWeight:'700', letterSpacing:'0.04em',
    }}>{text}</span>
  );
}

function KpiGrid({ items }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'14px', marginBottom:'24px' }}>
      {items.map(({ label, value, color='#7c6fe0', icon }) => (
        <div key={label} style={{
          background:'var(--bg-card)', border:'1px solid var(--border)',
          borderRadius:'12px', padding:'18px 16px', display:'flex', alignItems:'center', gap:'14px',
        }}>
          <div style={{ width:42, height:42, borderRadius:'10px', background:color+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>{icon}</div>
          <div>
            <div style={{ fontSize:'22px', fontWeight:'800', color:'var(--text-1)', lineHeight:1.1 }}>{value}</div>
            <div style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'3px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'14px', padding:'22px', marginBottom:'20px' }}>
      <h3 style={{ margin:'0 0 16px', fontSize:'15px', fontWeight:'700', color:'var(--text-1)' }}>{title}</h3>
      {children}
    </div>
  );
}

function DataTable({ cols, rows, emptyMsg = 'No data.' }) {
  if (!rows.length) return <p style={{ color:'var(--text-3)', fontSize:'13px', padding:'8px 0' }}>{emptyMsg}</p>;
  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
        <thead>
          <tr style={{ borderBottom:'2px solid var(--border)' }}>
            {cols.map(c => (
              <th key={c.key} style={{ padding:'8px 12px', textAlign:'left', color:'var(--text-3)', fontWeight:'600', textTransform:'uppercase', fontSize:'11px', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}
              style={{ borderBottom:'1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.background='var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background=''}
            >
              {cols.map(c => (
                <td key={c.key} style={{ padding:'10px 12px', color:'var(--text-2)', ...(c.style || {}) }}>
                  {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'10px 14px' }}>
      <p style={{ fontSize:'11px', color:'var(--text-3)', marginBottom:'4px', textTransform:'uppercase' }}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{ fontSize:'15px', fontWeight:'700', color:p.color||'#7c6fe0', margin:'2px 0' }}>{p.name}: {fmt(p.value)}</p>)}
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function Reports() {
  const [books,     setBooks]     = useState([]);
  const [users,     setUsers]     = useState([]);
  const [borrows,   setBorrows]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [active,    setActive]    = useState('inventory');
  const [dateRange, setDateRange] = useState('all');

  const loadAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [booksRes, usersRes, borrowsRes] = await Promise.all([
        API.get('/books').catch(() => ({ data: [] })),
        API.get('/auth/users').catch(() => ({ data: [] })),
        API.get('/borrow/all').catch(() => ({ data: [] })),
      ]);
      setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setBorrows(Array.isArray(borrowsRes.data) ? borrowsRes.data : []);
    } catch { setError('Failed to load data.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ── date-filtered borrows ── */
  const filteredBorrows = dateRange === 'all' ? borrows : borrows.filter(b => {
    const d = b.borrowDate || b.issueDate || b.createdAt;
    if (!d) return false;
    return (Date.now() - new Date(d).getTime()) <= Number(dateRange) * 86400000;
  });

  /* ══════════════ DERIVED DATA ══════════════ */

  // 1. Inventory
  const totalBooks      = books.length;
  const totalCopies     = books.reduce((s,b) => s + (b.totalCopies ?? b.copies ?? 1), 0);
  const availableCopies = books.reduce((s,b) => s + (b.availableCopies ?? b.available ?? 0), 0);
  const issuedCopies    = totalCopies - availableCopies;
  const damagedBooks    = books.filter(b => b.damaged || b.status === 'DAMAGED').length;

  // 2. User activity
  const borrowCountByUser = {};
  filteredBorrows.forEach(b => {
    const uid = b.user?.id ?? b.userId;
    if (uid) borrowCountByUser[uid] = (borrowCountByUser[uid] || 0) + 1;
  });
  const usersWithActivity = users.map(u => ({
    ...u,
    borrowCount: borrowCountByUser[u.id] || 0,
    lastActivity: filteredBorrows
      .filter(b => (b.user?.id ?? b.userId) === u.id)
      .map(b => b.borrowDate || b.issueDate || '')
      .sort().reverse()[0] || null,
  }));

  // 3. Transactions
  const txRows = filteredBorrows.map(b => ({
    id:         b.id,
    book:       b.book?.title ?? '—',
    author:     b.book?.author ?? '—',
    member:     b.user?.name ?? '—',
    email:      b.user?.email ?? '—',
    issueDate:  b.borrowDate ?? b.issueDate ?? '—',
    dueDate:    b.dueDate ?? '—',
    returnDate: b.returnDate ?? (b.returned ? 'Returned' : '—'),
    status:     b.returned ? 'RETURNED' : isOverdue(b) ? 'OVERDUE' : 'ACTIVE',
    fine:       calcFine(b),
  }));

  // 4. Overdue — computed fresh from borrows using isOverdue()
  const overdueRows = filteredBorrows
    .filter(b => isOverdue(b))
    .map(b => ({
      member:   b.user?.name ?? '—',
      email:    b.user?.email ?? '—',
      book:     b.book?.title ?? '—',
      dueDate:  b.dueDate ?? '—',
      daysLate: daysLate(b.dueDate),
      fine:     daysLate(b.dueDate) * 5,
    }))
    .sort((a, b) => b.daysLate - a.daysLate);
  const totalFine = overdueRows.reduce((s, r) => s + r.fine, 0);

  // 5. Popular books
  const popularMap = {};
  filteredBorrows.forEach(b => {
    const t = b.book?.title ?? 'Unknown';
    const c = b.book?.category ?? b.book?.genre ?? 'General';
    if (!popularMap[t]) popularMap[t] = { title: t, category: c, count: 0 };
    popularMap[t].count++;
  });
  const popularRows = Object.values(popularMap).sort((a, b) => b.count - a.count).slice(0, 20);

  // 6. Category-wise
  const catMap = {};
  books.forEach(b => {
    const c = b.category ?? b.genre ?? 'Uncategorized';
    if (!catMap[c]) catMap[c] = { category: c, totalBooks: 0, totalCopies: 0, issuedCount: 0 };
    catMap[c].totalBooks++;
    catMap[c].totalCopies += (b.totalCopies ?? b.copies ?? 1);
  });
  filteredBorrows.forEach(b => {
    const c = b.book?.category ?? b.book?.genre ?? 'Uncategorized';
    if (catMap[c]) catMap[c].issuedCount++;
  });
  const catRows = Object.values(catMap).sort((a, b) => b.issuedCount - a.issuedCount);

  // 7. Subscriptions
  const subRows = users
    .filter(u => u.subscriptionPlan && u.subscriptionPlan !== 'FREE')
    .map(u => ({
      name:   u.name ?? '—',
      email:  u.email ?? '—',
      plan:   u.subscriptionPlan ?? '—',
      status: u.paymentStatus ?? u.subscriptionStatus ?? 'ACTIVE',
      amount: u.amountPaid ?? u.subscriptionAmount ?? '—',
      date:   u.subscriptionDate ?? u.createdAt ?? '—',
    }));

  /* ══════════════ PDF EXPORT ══════════════ */
  const exportPDF = () => {
    const win = window.open('', '_blank');
    if (!win) return;

    const thStyle = `padding:8px 10px;background:#7c6fe0;color:#fff;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em`;
    const tdStyle = `padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#374151;font-size:12px`;
    const trAlt   = `background:#f8f7ff`;

    const tableHtml = (cols, rows) => `
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
        <thead><tr>${cols.map(c => `<th style="${thStyle}">${c.label}</th>`).join('')}</tr></thead>
        <tbody>${rows.map((r, i) => `
          <tr style="${i % 2 === 1 ? trAlt : ''}">
            ${cols.map(c => `<td style="${tdStyle}">${r[c.key] ?? '—'}</td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>`;

    const kpiBox = (items) => `
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px">
        ${items.map(it => `
          <div style="border:2px solid #7c6fe0;border-radius:8px;padding:12px 20px;min-width:130px">
            <div style="font-size:24px;font-weight:800;color:#1e1b4b">${it.value}</div>
            <div style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-top:2px">${it.label}</div>
          </div>`).join('')}
      </div>`;

    const section = (num, title, content) => `
      <div style="page-break-inside:avoid;margin-bottom:36px">
        <h2 style="font-size:17px;font-weight:700;color:#7c6fe0;border-bottom:2px solid #7c6fe0;padding-bottom:6px;margin-bottom:16px">${num}. ${title}</h2>
        ${content}
      </div>`;

    const html = `<!DOCTYPE html><html><head>
      <title>LMS Full Report — ${today()}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Segoe UI',Arial,sans-serif;color:#1f2937;background:#fff;padding:32px;font-size:13px}
        @media print{body{padding:16px}.no-print{display:none} table{page-break-inside:auto} tr{page-break-inside:avoid}}
      </style>
    </head><body>

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #7c6fe0">
        <div>
          <h1 style="font-size:28px;font-weight:800;color:#1e1b4b;margin-bottom:4px">📊 Library Management Full Report</h1>
          <p style="color:#6b7280">Generated: ${today()} &nbsp;|&nbsp; Period: ${dateRange === 'all' ? 'All time' : 'Last ' + dateRange + ' days'}</p>
        </div>
        <div style="background:#7c6fe0;color:#fff;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;text-align:center">
          LIBRARIO LMS<br><span style="font-size:10px;font-weight:400">Library System</span>
        </div>
      </div>

      <!-- Summary row -->
      <div style="background:#f8f7ff;border:1px solid #e0ddff;border-radius:10px;padding:16px 20px;margin-bottom:32px;display:flex;gap:30px;flex-wrap:wrap">
        <div><span style="font-size:11px;color:#6b7280;text-transform:uppercase">Total Books</span><br><strong style="font-size:18px;color:#1e1b4b">${fmt(totalBooks)}</strong></div>
        <div><span style="font-size:11px;color:#6b7280;text-transform:uppercase">Total Users</span><br><strong style="font-size:18px;color:#1e1b4b">${fmt(users.length)}</strong></div>
        <div><span style="font-size:11px;color:#6b7280;text-transform:uppercase">Transactions</span><br><strong style="font-size:18px;color:#1e1b4b">${fmt(filteredBorrows.length)}</strong></div>
        <div><span style="font-size:11px;color:#6b7280;text-transform:uppercase">Overdue</span><br><strong style="font-size:18px;color:#dc2626">${fmt(overdueRows.length)}</strong></div>
        <div><span style="font-size:11px;color:#6b7280;text-transform:uppercase">Total Fine Due</span><br><strong style="font-size:18px;color:#d97706">${fmtRs(totalFine)}</strong></div>
      </div>

      ${section(1, '📚 Book Inventory',
        kpiBox([
          { label:'Total Titles',   value:fmt(totalBooks) },
          { label:'Total Copies',   value:fmt(totalCopies) },
          { label:'Available',      value:fmt(availableCopies) },
          { label:'Issued Out',     value:fmt(issuedCopies) },
          { label:'Damaged/Lost',   value:fmt(damagedBooks) },
        ]) +
        tableHtml([
          { key:'id',              label:'ID' },
          { key:'title',           label:'Title' },
          { key:'author',          label:'Author' },
          { key:'category',        label:'Category' },
          { key:'totalCopies',     label:'Copies' },
          { key:'availableCopies', label:'Available' },
        ], books.map(b => ({
          id: b.id,
          title: b.title ?? '—',
          author: b.author ?? '—',
          category: b.category ?? b.genre ?? '—',
          totalCopies: b.totalCopies ?? b.copies ?? 1,
          availableCopies: b.availableCopies ?? b.available ?? '—',
        })))
      )}

      ${section(2, '👤 User Activity',
        kpiBox([
          { label:'Total Users',      value:fmt(users.length) },
          { label:'Admins',           value:fmt(users.filter(u=>u.role==='ADMIN').length) },
          { label:'Librarians',       value:fmt(users.filter(u=>u.role==='LIBRARIAN').length) },
          { label:'Members',          value:fmt(users.filter(u=>u.role==='MEMBER').length) },
          { label:'Active Borrowers', value:fmt(Object.keys(borrowCountByUser).length) },
        ]) +
        tableHtml([
          { key:'name',             label:'Name' },
          { key:'email',            label:'Email' },
          { key:'role',             label:'Role' },
          { key:'subscriptionPlan', label:'Plan' },
          { key:'borrowCount',      label:'Borrows' },
          { key:'lastActivity',     label:'Last Activity' },
        ], usersWithActivity.map(u => ({
          name: u.name ?? '—',
          email: u.email ?? '—',
          role: u.role ?? '—',
          subscriptionPlan: u.subscriptionPlan ?? 'FREE',
          borrowCount: u.borrowCount,
          lastActivity: u.lastActivity ?? 'No activity',
        })))
      )}

      ${section(3, '🔄 Issue & Return Transactions',
        kpiBox([
          { label:'Total',    value:fmt(txRows.length) },
          { label:'Active',   value:fmt(txRows.filter(r=>r.status==='ACTIVE').length) },
          { label:'Returned', value:fmt(txRows.filter(r=>r.status==='RETURNED').length) },
          { label:'Overdue',  value:fmt(txRows.filter(r=>r.status==='OVERDUE').length) },
        ]) +
        tableHtml([
          { key:'id',         label:'ID' },
          { key:'book',       label:'Book' },
          { key:'member',     label:'Member' },
          { key:'email',      label:'Email' },
          { key:'issueDate',  label:'Issue Date' },
          { key:'dueDate',    label:'Due Date' },
          { key:'returnDate', label:'Return Date' },
          { key:'status',     label:'Status' },
          { key:'fine',       label:'Fine (₹)' },
        ], txRows)
      )}

      ${section(4, '⏰ Overdue & Fines',
        kpiBox([
          { label:'Overdue Records', value:fmt(overdueRows.length) },
          { label:'Total Fine Due',  value:fmtRs(totalFine) },
          { label:'Avg Days Late',   value: overdueRows.length ? Math.round(overdueRows.reduce((s,r)=>s+r.daysLate,0)/overdueRows.length)+'d' : '0d' },
        ]) +
        (overdueRows.length === 0
          ? '<p style="color:#059669;font-weight:600;padding:12px 0">🎉 No overdue records — great job!</p>'
          : tableHtml([
              { key:'member',   label:'Member' },
              { key:'email',    label:'Email' },
              { key:'book',     label:'Book' },
              { key:'dueDate',  label:'Due Date' },
              { key:'daysLate', label:'Days Late' },
              { key:'fine',     label:'Fine (₹)' },
            ], overdueRows))
      )}

      ${section(5, '📈 Popular Books (Top 20)',
        tableHtml([
          { key:'rank',     label:'Rank' },
          { key:'title',    label:'Book Title' },
          { key:'category', label:'Category' },
          { key:'count',    label:'Times Issued' },
        ], popularRows.map((r, i) => ({ rank:`#${i+1}`, ...r })))
      )}

      ${section(6, '🏷️ Category-wise Analysis',
        tableHtml([
          { key:'category',    label:'Category' },
          { key:'totalBooks',  label:'Titles' },
          { key:'totalCopies', label:'Total Copies' },
          { key:'issuedCount', label:'Times Issued' },
        ], catRows)
      )}

      ${subRows.length > 0 ? section(7, '💰 Subscriptions & Payments',
        tableHtml([
          { key:'name',   label:'Member' },
          { key:'email',  label:'Email' },
          { key:'plan',   label:'Plan' },
          { key:'status', label:'Status' },
          { key:'amount', label:'Amount (₹)' },
          { key:'date',   label:'Date' },
        ], subRows)
      ) : ''}

      <!-- Footer -->
      <div style="margin-top:40px;padding-top:16px;border-top:2px solid #e2e8f0;text-align:center;color:#9ca3af;font-size:11px">
        Generated by Librario LMS · ${today()} · All data is confidential
      </div>
    </body></html>`;

    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 700);
  };

  /* ══════════════ CSV EXPORT ══════════════ */
  const exportCSV = () => {
    const configs = {
      inventory:     { cols:['id','title','author','category','totalCopies','availableCopies'],                                       rows: books.map(b => ({ id:b.id, title:b.title??'', author:b.author??'', category:b.category??b.genre??'', totalCopies:b.totalCopies??b.copies??1, availableCopies:b.availableCopies??b.available??0 })) },
      users:         { cols:['name','email','role','subscriptionPlan','borrowCount','lastActivity'],                                   rows: usersWithActivity.map(u => ({ name:u.name??'', email:u.email??'', role:u.role??'', subscriptionPlan:u.subscriptionPlan??'FREE', borrowCount:u.borrowCount, lastActivity:u.lastActivity??'' })) },
      transactions:  { cols:['id','book','author','member','email','issueDate','dueDate','returnDate','status','fine'],               rows: txRows },
      overdue:       { cols:['member','email','book','dueDate','daysLate','fine'],                                                    rows: overdueRows },
      popular:       { cols:['title','category','count'],                                                                             rows: popularRows },
      categories:    { cols:['category','totalBooks','totalCopies','issuedCount'],                                                    rows: catRows },
      subscriptions: { cols:['name','email','plan','status','amount','date'],                                                         rows: subRows },
    };
    const { cols, rows } = configs[active] || configs.transactions;
    const csv = [cols, ...rows.map(r => cols.map(c => `"${String(r[c]??'').replace(/"/g,'""')}"`))].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
    a.download = `lms-${active}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  /* ══════════════ SECTION RENDERERS ══════════════ */

  const renderInventory = () => (
    <>
      <KpiGrid items={[
        { label:'Total Titles',  value:fmt(totalBooks),      icon:'📚', color:'#7c6fe0' },
        { label:'Total Copies',  value:fmt(totalCopies),     icon:'📖', color:'#3b82f6' },
        { label:'Available',     value:fmt(availableCopies), icon:'✅', color:'#059669' },
        { label:'Issued Out',    value:fmt(issuedCopies),    icon:'🔖', color:'#f97316' },
        { label:'Damaged/Lost',  value:fmt(damagedBooks),    icon:'⚠️', color:'#dc2626' },
      ]} />
      <SectionCard title="All Books">
        <DataTable
          cols={[
            { key:'id',              label:'ID' },
            { key:'title',           label:'Title',     style:{ fontWeight:'600', color:'var(--text-1)' } },
            { key:'author',          label:'Author' },
            { key:'category',        label:'Category',  render: v => <Badge text={v||'General'} /> },
            { key:'totalCopies',     label:'Copies' },
            { key:'availableCopies', label:'Available', render: v => <span style={{ fontWeight:'700', color: v>0?'#059669':'#dc2626' }}>{v??'—'}</span> },
          ]}
          rows={books.map(b => ({
            id: b.id, title: b.title??'—', author: b.author??'—',
            category: b.category??b.genre??'General',
            totalCopies: b.totalCopies??b.copies??1,
            availableCopies: b.availableCopies??b.available??'—',
          }))}
          emptyMsg="No books found."
        />
      </SectionCard>
    </>
  );

  const renderUsers = () => (
    <>
      <KpiGrid items={[
        { label:'Total Users',      value:fmt(users.length),                                        icon:'👥', color:'#7c6fe0' },
        { label:'Admins',           value:fmt(users.filter(u=>u.role==='ADMIN').length),             icon:'👑', color:'#dc2626' },
        { label:'Librarians',       value:fmt(users.filter(u=>u.role==='LIBRARIAN').length),         icon:'📋', color:'#3b82f6' },
        { label:'Members',          value:fmt(users.filter(u=>u.role==='MEMBER').length),            icon:'👤', color:'#059669' },
        { label:'Active Borrowers', value:fmt(Object.keys(borrowCountByUser).length),                icon:'🔥', color:'#f97316' },
      ]} />
      <SectionCard title="User Activity Details">
        <DataTable
          cols={[
            { key:'name',             label:'Name',     style:{ fontWeight:'600', color:'var(--text-1)' } },
            { key:'email',            label:'Email' },
            { key:'role',             label:'Role',     render: v => <Badge text={v} color={v==='ADMIN'?'#dc2626':v==='LIBRARIAN'?'#3b82f6':'#059669'} /> },
            { key:'subscriptionPlan', label:'Plan',     render: v => <Badge text={v||'FREE'} color={v==='PREMIUM'?'#7c6fe0':v==='STANDARD'?'#8b5cf6':v==='BASIC'?'#3b82f6':'#94a3b8'} /> },
            { key:'borrowCount',      label:'Borrows',  render: v => <span style={{ fontWeight:'700', color: v>0?'#7c6fe0':'var(--text-3)' }}>{v}</span> },
            { key:'lastActivity',     label:'Last Activity' },
          ]}
          rows={usersWithActivity.map(u => ({
            name: u.name??'—', email: u.email??'—', role: u.role??'MEMBER',
            subscriptionPlan: u.subscriptionPlan??'FREE',
            borrowCount: u.borrowCount,
            lastActivity: u.lastActivity??'No activity',
          }))}
          emptyMsg="No users found."
        />
      </SectionCard>
    </>
  );

  const renderTransactions = () => (
    <>
      <KpiGrid items={[
        { label:'Total',    value:fmt(txRows.length),                                   icon:'🔄', color:'#7c6fe0' },
        { label:'Active',   value:fmt(txRows.filter(r=>r.status==='ACTIVE').length),    icon:'🔖', color:'#3b82f6' },
        { label:'Returned', value:fmt(txRows.filter(r=>r.status==='RETURNED').length),  icon:'✅', color:'#059669' },
        { label:'Overdue',  value:fmt(txRows.filter(r=>r.status==='OVERDUE').length),   icon:'⚠️', color:'#dc2626' },
      ]} />
      <SectionCard title="All Issue & Return Transactions">
        <DataTable
          cols={[
            { key:'id',         label:'ID' },
            { key:'book',       label:'Book',       style:{ fontWeight:'600', color:'var(--text-1)' } },
            { key:'member',     label:'Member' },
            { key:'issueDate',  label:'Issue Date' },
            { key:'dueDate',    label:'Due Date' },
            { key:'returnDate', label:'Returned' },
            { key:'status',     label:'Status', render: v => <Badge text={v} color={v==='RETURNED'?'#059669':v==='OVERDUE'?'#dc2626':'#3b82f6'} /> },
            { key:'fine',       label:'Fine',   render: v => v>0 ? <span style={{color:'#dc2626',fontWeight:'700'}}>{fmtRs(v)}</span> : <span style={{color:'var(--text-3)'}}>—</span> },
          ]}
          rows={txRows}
          emptyMsg="No transactions found."
        />
      </SectionCard>
    </>
  );

  const renderOverdue = () => (
    <>
      <KpiGrid items={[
        { label:'Overdue Records', value:fmt(overdueRows.length),  icon:'⏰', color:'#dc2626' },
        { label:'Total Fine Due',  value:fmtRs(totalFine),         icon:'💰', color:'#d97706' },
        { label:'Avg Days Late',   value: overdueRows.length ? Math.round(overdueRows.reduce((s,r)=>s+r.daysLate,0)/overdueRows.length)+'d' : '0d', icon:'📅', color:'#f97316' },
      ]} />
      <SectionCard title="Overdue Books & Fines">
        {overdueRows.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px', color:'var(--text-3)' }}>
            <div style={{ fontSize:'44px', marginBottom:'10px' }}>🎉</div>
            <p style={{ fontWeight:'600', fontSize:'16px' }}>No overdue records! Great job.</p>
            <p style={{ fontSize:'13px', marginTop:'6px' }}>All borrowed books are within their due dates.</p>
          </div>
        ) : (
          <DataTable
            cols={[
              { key:'member',   label:'Member',    style:{ fontWeight:'600', color:'var(--text-1)' } },
              { key:'email',    label:'Email' },
              { key:'book',     label:'Book' },
              { key:'dueDate',  label:'Due Date',  render: v => <span style={{ color:'#dc2626', fontWeight:'600' }}>{v}</span> },
              { key:'daysLate', label:'Days Late', render: v => <Badge text={v+'d late'} color='#dc2626' /> },
              { key:'fine',     label:'Fine',      render: v => <span style={{ color:'#d97706', fontWeight:'800' }}>{fmtRs(v)}</span> },
            ]}
            rows={overdueRows}
            emptyMsg="No overdue records."
          />
        )}
      </SectionCard>
    </>
  );

  const renderPopular = () => {
    const chartData = popularRows.slice(0,10).map(r => ({
      name: r.title.length > 20 ? r.title.slice(0,20)+'…' : r.title,
      count: r.count,
    }));
    return (
      <>
        <KpiGrid items={[
          { label:'Unique Books Borrowed', value:fmt(Object.keys(popularMap).length), icon:'📚', color:'#7c6fe0' },
          { label:'Total Transactions',    value:fmt(filteredBorrows.length),          icon:'🔄', color:'#3b82f6' },
          { label:'Most Popular',          value: popularRows[0]?.title?.slice(0,18)||'—', icon:'🏆', color:'#d97706' },
        ]} />
        {chartData.length > 0 && (
          <SectionCard title="Top 10 — Chart View">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} layout="vertical" margin={{left:10,right:30,top:5,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" tick={{fontSize:11,fill:'var(--text-3)'}} />
                <YAxis dataKey="name" type="category" tick={{fontSize:11,fill:'var(--text-2)'}} width={155} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Borrows" radius={[0,6,6,0]} maxBarSize={18}>
                  {chartData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        )}
        <SectionCard title="Popular Books — Full List">
          <DataTable
            cols={[
              { key:'rank',     label:'Rank' },
              { key:'title',    label:'Title',     style:{ fontWeight:'600', color:'var(--text-1)' } },
              { key:'category', label:'Category',  render: v => <Badge text={v} /> },
              { key:'count',    label:'Times Issued', render: v => <span style={{fontWeight:'800',color:'#7c6fe0'}}>{v}</span> },
            ]}
            rows={popularRows.map((r,i) => ({ rank:`#${i+1}`, ...r }))}
            emptyMsg="No borrow data yet."
          />
        </SectionCard>
      </>
    );
  };

  const renderCategories = () => {
    const pieData = catRows.slice(0,8).map(c => ({ name:c.category, value:c.totalBooks }));
    return (
      <>
        <KpiGrid items={[
          { label:'Total Categories', value:fmt(catRows.length),                     icon:'🏷️', color:'#7c6fe0' },
          { label:'Total Books',      value:fmt(totalBooks),                         icon:'📚', color:'#3b82f6' },
          { label:'Most Issued',      value: catRows[0]?.category?.slice(0,16)||'—', icon:'🔥', color:'#f97316' },
        ]} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
          {pieData.length > 0 && (
            <SectionCard title="Books by Category (Pie)">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={85} dataKey="value" nameKey="name"
                    label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v,n)=>[fmt(v),n]} />
                </PieChart>
              </ResponsiveContainer>
            </SectionCard>
          )}
          {catRows.length > 0 && (
            <SectionCard title="Issue Count by Category">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={catRows.slice(0,8)} margin={{left:-15,right:10,top:5,bottom:24}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="category" tick={{fontSize:10,fill:'var(--text-3)'}} angle={-30} textAnchor="end" />
                  <YAxis tick={{fontSize:11,fill:'var(--text-3)'}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="issuedCount" name="Issued" radius={[4,4,0,0]}>
                    {catRows.slice(0,8).map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          )}
        </div>
        <SectionCard title="Category Details">
          <DataTable
            cols={[
              { key:'category',    label:'Category',     style:{ fontWeight:'600', color:'var(--text-1)' } },
              { key:'totalBooks',  label:'Titles' },
              { key:'totalCopies', label:'Total Copies' },
              { key:'issuedCount', label:'Times Issued', render: v => <span style={{fontWeight:'700',color:'#7c6fe0'}}>{v}</span> },
            ]}
            rows={catRows}
            emptyMsg="No category data."
          />
        </SectionCard>
      </>
    );
  };

  const renderSubscriptions = () => {
    const planCounts = {};
    users.forEach(u => { const p = u.subscriptionPlan||'FREE'; planCounts[p]=(planCounts[p]||0)+1; });
    return (
      <>
        <KpiGrid items={[
          { label:'FREE',     value:fmt(planCounts['FREE']||0),     icon:'🆓', color:'#94a3b8' },
          { label:'BASIC',    value:fmt(planCounts['BASIC']||0),    icon:'⭐', color:'#3b82f6' },
          { label:'STANDARD', value:fmt(planCounts['STANDARD']||0), icon:'⭐⭐', color:'#8b5cf6' },
          { label:'PREMIUM',  value:fmt(planCounts['PREMIUM']||0),  icon:'👑', color:'#7c6fe0' },
        ]} />
        <SectionCard title="Subscription & Payment Records">
          {subRows.length === 0 ? (
            <p style={{ color:'var(--text-3)', fontSize:'13px', padding:'8px 0' }}>No paid subscription records found.</p>
          ) : (
            <DataTable
              cols={[
                { key:'name',   label:'Member',  style:{ fontWeight:'600', color:'var(--text-1)' } },
                { key:'email',  label:'Email' },
                { key:'plan',   label:'Plan',    render: v => <Badge text={v} color={v==='PREMIUM'?'#7c6fe0':v==='STANDARD'?'#8b5cf6':'#3b82f6'} /> },
                { key:'status', label:'Status',  render: v => <Badge text={v||'ACTIVE'} color={v==='ACTIVE'?'#059669':'#dc2626'} /> },
                { key:'amount', label:'Amount',  render: v => v&&v!=='—' ? <span style={{fontWeight:'700',color:'#059669'}}>{fmtRs(v)}</span> : '—' },
                { key:'date',   label:'Date' },
              ]}
              rows={subRows}
              emptyMsg="No subscription records."
            />
          )}
        </SectionCard>
      </>
    );
  };

  const sectionMap = {
    inventory:     renderInventory,
    users:         renderUsers,
    transactions:  renderTransactions,
    overdue:       renderOverdue,
    popular:       renderPopular,
    categories:    renderCategories,
    subscriptions: renderSubscriptions,
  };

  /* ══════════════ RENDER ══════════════ */
  return (
    <Layout>
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ margin:0, fontSize:'26px', fontWeight:'800', color:'var(--text-1)' }}>📊 Reports</h1>
            <p style={{ margin:'4px 0 0', fontSize:'14px', color:'var(--text-3)' }}>Comprehensive library analytics &amp; exports</p>
          </div>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center' }}>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)}
              style={{ padding:'8px 14px', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg-card)', color:'var(--text-2)', fontSize:'13px', cursor:'pointer' }}>
              <option value="all">📅 All time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button onClick={loadAll} disabled={loading}
              style={{ padding:'8px 16px', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg-card)', color:'var(--text-2)', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>
              🔄 Refresh
            </button>
            <button onClick={exportCSV}
              style={{ padding:'8px 16px', borderRadius:'8px', border:'none', background:'#3b82f6', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>
              ⬇ Export CSV
            </button>
            <button onClick={exportPDF}
              style={{ padding:'8px 18px', borderRadius:'8px', border:'none', background:'#7c6fe0', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'700', boxShadow:'0 4px 12px #7c6fe044' }}>
              🖨 Full PDF Report
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'10px', padding:'12px 16px', marginBottom:'20px', color:'#dc2626', fontSize:'14px' }}>
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-3)' }}>
            <div style={{ fontSize:'44px', marginBottom:'12px' }}>📊</div>
            <p style={{ fontSize:'15px' }}>Loading report data…</p>
          </div>
        ) : (
          <>
            {/* Report type tabs */}
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'24px' }}>
              {REPORT_TYPES.map(rt => (
                <button key={rt.id} onClick={() => setActive(rt.id)}
                  style={{
                    padding:'10px 16px', borderRadius:'10px', cursor:'pointer',
                    fontSize:'13px', fontWeight:'600', transition:'all 0.15s',
                    background: active===rt.id ? '#7c6fe0' : 'var(--bg-card)',
                    color: active===rt.id ? '#fff' : 'var(--text-2)',
                    boxShadow: active===rt.id ? '0 4px 12px #7c6fe044' : 'var(--shadow-sm)',
                    border: active===rt.id ? '1px solid transparent' : '1px solid var(--border)',
                  }}>
                  {rt.label}
                </button>
              ))}
            </div>

            {/* Active section */}
            {(sectionMap[active] || sectionMap.inventory)()}
          </>
        )}
      </div>
    </Layout>
  );
}
