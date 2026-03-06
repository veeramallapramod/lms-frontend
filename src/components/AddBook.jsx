import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from './Layout';
import useBookStore from '../store/bookStore';

const CATEGORIES = ['Fiction','Non-Fiction','Science','Technology','History','Biography','Philosophy','Arts','Mathematics','Medicine','Law','Business','Other'];
const SHELF_ROWS  = ['A','B','C','D','E','F'];
const SHELF_NUMS  = [1,2,3,4,5,6,7,8,9,10];

// Default shelf per category — matches backend logic
const CATEGORY_SHELF = {
  'Fiction':     'A1', 'Non-Fiction': 'A2', 'Science':    'A3',
  'Technology':  'B1', 'History':     'B2', 'Biography':  'B3',
  'Philosophy':  'C1', 'Arts':        'C2', 'Mathematics':'C3',
  'Medicine':    'D1', 'Law':         'D2', 'Business':   'D3',
};

// Defined OUTSIDE component to prevent remount on every keystroke
function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p style={{ color:'var(--red)', fontSize:'12px', marginTop:'4px' }}>⚠ {error}</p>}
    </div>
  );
}

export default function AddBook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { addBook, updateBook, books } = useBookStore();
  const fileInputRef = useRef();

  const [form, setForm] = useState({ title:'', author:'', isbn:'', edition:'', publishedYear:'', quantity:1, category:'', shelfNumber:'', description:'', available:true, coverImage:'' });
  const [preview, setPreview] = useState('');
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState({ text:'', type:'' });

  useEffect(() => {
    if (isEdit) {
      const book = books.find(b => b.id === Number(id));
      if (book) {
        setForm({ title:book.title||'', author:book.author||'', isbn:book.isbn||'', edition:book.edition||'', publishedYear:book.publishedYear||'', quantity:book.quantity||1, category:book.category||'', shelfNumber:book.shelfNumber||'', description:book.description||'', available:book.available!==false, coverImage:book.coverImage||'' });
        if (book.coverImage) setPreview(book.coverImage);
      }
    }
  }, [id, books]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2*1024*1024) { setMsg({ text:'Image must be under 2MB', type:'error' }); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); setForm(f => ({ ...f, coverImage: ev.target.result })); };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const val = e.target.type==='checkbox' ? e.target.checked : e.target.type==='number' ? Number(e.target.value) : e.target.value;
    // Auto-fill shelf when category selected (only if shelf not manually changed)
    if (e.target.name === 'category' && CATEGORY_SHELF[val]) {
      setForm({ ...form, category: val, shelfNumber: CATEGORY_SHELF[val] });
    } else {
      setForm({ ...form, [e.target.name]: val });
    }
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())      e.title       = 'Book title is required';
    if (!form.author.trim())     e.author      = 'Author name is required';
    if (!form.category)          e.category    = 'Please select a category';
    if (!form.shelfNumber.trim()) e.shelfNumber = 'Shelf number is required';
    if (form.quantity < 1)       e.quantity    = 'Minimum 1 copy required';
    if (form.isbn && !/^[\d\-]{10,17}$/.test(form.isbn.replace(/\s/g,'')))
                                 e.isbn        = 'Invalid ISBN (10–13 digits)';
    if (form.publishedYear && (form.publishedYear < 1000 || form.publishedYear > new Date().getFullYear()))
                                 e.publishedYear = `Year must be between 1000–${new Date().getFullYear()}`;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (isEdit) { await updateBook(Number(id), form); setMsg({ text:'Book updated!', type:'success' }); }
      else        { await addBook(form);               setMsg({ text:'Book added to catalog!', type:'success' }); }
      setTimeout(() => navigate('/books'), 1200);
    } catch (err) {
      setMsg({ text: err.response?.data || 'Operation failed', type:'error' });
    } finally { setLoading(false); }
  };



  return (
    <Layout title={isEdit ? 'Edit Book' : 'Add New Book'} subtitle={isEdit ? 'Update book details' : 'Add a book to the catalog'}>
      <div style={{ maxWidth:'700px' }}>
        <div className="card" style={{ padding:'28px' }}>
          {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom:'16px' }}>{msg.text}</div>}
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>

            {/* Cover image */}
            <div>
              <label className="label">Book Cover Image</label>
              <div style={{ display:'flex', gap:'16px', alignItems:'flex-start' }}>
                <div onClick={() => fileInputRef.current?.click()}
                  style={{ width:'80px', height:'108px', borderRadius:'6px', flexShrink:0, background: preview ? 'transparent' : 'var(--bg-2)', border:`2px dashed ${preview ? 'var(--accent)' : 'var(--border)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', overflow:'hidden' }}>
                  {preview ? <img src={preview} alt="cover" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : (
                    <div style={{ textAlign:'center', color:'var(--text-3)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin:'0 auto 4px', display:'block' }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <p style={{ fontSize:'10px' }}>Upload</p>
                    </div>
                  )}
                </div>
                <div style={{ flex:1 }}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display:'none' }} />
                  <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ marginBottom:'8px' }}>
                    {preview ? 'Change Image' : 'Upload Cover'}
                  </button>
                  {preview && <button type="button" className="btn-danger" onClick={() => { setPreview(''); setForm(f=>({...f,coverImage:''})); }} style={{ marginLeft:'8px' }}>Remove</button>}
                  <p style={{ fontSize:'12px', color:'var(--text-3)', marginTop:'6px' }}>JPG, PNG, WebP · max 2MB</p>
                </div>
              </div>
            </div>

            <Field label="Book Title *" error={errors.title}>
              <input className="input" name="title" placeholder="e.g. The Great Gatsby" value={form.title} onChange={handleChange}
                style={{ borderColor: errors.title ? 'var(--red)' : undefined }} />
            </Field>

            <Field label="Author *" error={errors.author}>
              <input className="input" name="author" placeholder="e.g. F. Scott Fitzgerald" value={form.author} onChange={handleChange}
                style={{ borderColor: errors.author ? 'var(--red)' : undefined }} />
            </Field>

            {/* Category + Shelf Number */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <Field label="Category *" error={errors.category}>
                <select name="category" value={form.category} onChange={handleChange}
                  style={{ width:'100%', background:'var(--bg-input)', border:`1px solid ${errors.category ? 'var(--red)' : 'var(--border)'}`, borderRadius:'8px', padding:'10px 14px', color: form.category ? 'var(--text-1)' : 'var(--text-3)', fontFamily:'Plus Jakarta Sans, sans-serif', fontSize:'14px', outline:'none' }}>
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Shelf Number *" error={errors.shelfNumber}>
                {form.category && CATEGORY_SHELF[form.category] && (
                  <p style={{ fontSize:'11px', color:'var(--accent)', marginBottom:'6px', fontWeight:'600' }}>
                    📚 Default for {form.category}: <strong>{CATEGORY_SHELF[form.category]}</strong> — change below if needed
                  </p>
                )}
                <div style={{ display:'flex', gap:'8px' }}>
                  <select name="shelfNumber" value={form.shelfNumber} onChange={handleChange}
                    style={{ flex:1, background:'var(--bg-input)', border:`1px solid ${errors.shelfNumber ? 'var(--red)' : 'var(--border)'}`, borderRadius:'8px', padding:'10px 14px', color: form.shelfNumber ? 'var(--text-1)' : 'var(--text-3)', fontFamily:'Plus Jakarta Sans, sans-serif', fontSize:'14px', outline:'none' }}>
                    <option value="">Pick shelf...</option>
                    {SHELF_ROWS.map(row =>
                      SHELF_NUMS.map(num => (
                        <option key={`${row}${num}`} value={`${row}${num}`}>Shelf {row}{num} (Row {row}, #{num})</option>
                      ))
                    )}
                  </select>
                </div>
                <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'4px' }}>Row A–F · Position 1–10</p>
              </Field>
            </div>

            {/* ISBN + Edition + Year + Copies */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <Field label="ISBN" error={errors.isbn}>
                <input className="input" name="isbn" placeholder="978-..." value={form.isbn} onChange={handleChange}
                  style={{ borderColor: errors.isbn ? 'var(--red)' : undefined }} />
              </Field>
              <Field label="Edition">
                <input className="input" name="edition" placeholder="e.g. 3rd" value={form.edition} onChange={handleChange} />
              </Field>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <Field label="Published Year" error={errors.publishedYear}>
                <input className="input" name="publishedYear" type="number" placeholder="2020" value={form.publishedYear} onChange={handleChange}
                  style={{ borderColor: errors.publishedYear ? 'var(--red)' : undefined }} />
              </Field>
              <Field label="Copies *" error={errors.quantity}>
                <input className="input" name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange}
                  style={{ borderColor: errors.quantity ? 'var(--red)' : undefined }} />
              </Field>
            </div>

            <Field label="Description">
              <textarea className="input" name="description" placeholder="Brief description..." value={form.description} onChange={handleChange} rows={3} style={{ resize:'vertical', lineHeight:'1.6' }} />
            </Field>

            <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
              <input type="checkbox" name="available" checked={form.available} onChange={handleChange} style={{ width:'16px', height:'16px', accentColor:'var(--accent)', cursor:'pointer' }} />
              <span style={{ fontSize:'14px', color:'var(--text-2)' }}>Available for borrowing</span>
            </label>

            <div style={{ display:'flex', gap:'12px', paddingTop:'4px' }}>
              <button className="btn-primary" type="submit" disabled={loading} style={{ flex:1, justifyContent:'center', padding:'11px' }}>
                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Book' : 'Add Book')}
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/books')} style={{ flex:1, justifyContent:'center' }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
