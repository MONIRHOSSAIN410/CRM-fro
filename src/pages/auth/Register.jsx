import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import AuthShell from '../../components/AuthShell';
import { useAuth } from '../../context/AuthContext';

const copy = {
  investor: {
    eyebrow: 'Investor registration',
    heading: 'Create an investor profile and manage your investments.',
    sub: 'Register to message admins, track payments, and keep your investment preferences organized.',
    title: 'Investor Register',
    cta: 'Create Investor Account',
    orgPlaceholder: 'Investment group',
    focusPlaceholder: 'Agriculture, clean energy, women-led ventures',
  },
  entrepreneur: {
    eyebrow: 'Entrepreneur registration',
    heading: 'Create an entrepreneur profile and prepare your project.',
    sub: 'Register to contact admins, submit payment records, and manage your project information.',
    title: 'Entrepreneur Register',
    cta: 'Create Entrepreneur Account',
    orgPlaceholder: 'Business name',
    focusPlaceholder: 'Project category or business sector',
  },
};

const Field = ({ icon: Icon, label, children }) => (
  <div>
    <label className="label">
      {Icon && <Icon size={14} className="text-ink-soft" />}
      {label}
    </label>
    {children}
  </div>
);

const Register = ({ role = 'investor' }) => {
  const t = copy[role];
  const { register } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    location: 'Dhaka, Bangladesh',
    focusArea: '',
    bio: '',
    password: '123456',
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const res = await register({ ...form, role });
    setBusy(false);
    if (res.ok) navigate('/dashboard');
    else setError(res.message);
  };

  return (
    <AuthShell eyebrow={t.eyebrow} heading={t.heading} sub={t.sub} wide>
      <div className="mx-auto max-w-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-500">
              Create account
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink">{t.title}</h2>
          </div>
          <Link to="/login" className="shrink-0 text-xs font-semibold text-brand-600 hover:underline">
            Admin login
          </Link>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field icon={User} label="Full Name">
            <input required className="input" placeholder="Your full name" value={form.fullName} onChange={set('fullName')} />
          </Field>
          <Field icon={Mail} label="Email">
            <input required type="email" className="input" placeholder="example@gmail.com" value={form.email} onChange={set('email')} />
          </Field>
          <Field icon={Phone} label="Phone">
            <input className="input" placeholder="+880 1627441627" value={form.phone} onChange={set('phone')} />
          </Field>
          <Field icon={Building2} label="Organization">
            <input className="input" placeholder={t.orgPlaceholder} value={form.organization} onChange={set('organization')} />
          </Field>
          <Field icon={MapPin} label="Location">
            <input className="input" placeholder="Dhaka, Bangladesh" value={form.location} onChange={set('location')} />
          </Field>
          <Field label="Focus Area">
            <input className="input" placeholder={t.focusPlaceholder} value={form.focusArea} onChange={set('focusArea')} />
          </Field>

          <div className="sm:col-span-2">
            <label className="label">Short Bio</label>
            <textarea
              rows={4}
              className="input resize-none"
              placeholder="Write a short professional profile"
              value={form.bio}
              onChange={set('bio')}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 sm:col-span-2"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.985 }}
            type="submit"
            disabled={busy}
            className="btn-primary w-full py-3 sm:col-span-2"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : null}
            {t.cta}
            {!busy && <ArrowRight size={16} />}
          </motion.button>
        </form>
      </div>
    </AuthShell>
  );
};

export default Register;
