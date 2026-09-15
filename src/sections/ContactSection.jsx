import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { facultyData } from '../data/facultyData';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) { setStatus('error'); return; }
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 800);
  };

  return (
    <section id="contact" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="OFFICE & CONTACT" title="Contact Information"
          subtitle="Direct contact channels, department location, and inquiry form." />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Office Info */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-xl overflow-hidden shadow-md">
              <div className="bg-[#1e3a5f] dark:bg-[#162d4a] px-6 py-4">
                <h3 className="text-base font-bold text-white" style={{fontFamily: "'Merriweather', serif"}}>Office Information</h3>
              </div>
              <div className="p-6 space-y-5 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">Department Office</div>
                    <p className="text-xs mt-0.5">{facultyData.department}</p>
                    <p className="text-xs">{facultyData.institution}</p>
                    <p className="text-xs">{facultyData.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">Email</div>
                    <a href={`mailto:${facultyData.emails[0]}`} className="text-xs text-blue-700 dark:text-blue-400 hover:underline">{facultyData.emails[0]}</a>
                    <p className="text-xs text-slate-500">{facultyData.emails[1]}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">Phone</div>
                    <p className="text-xs">Office: {facultyData.phoneOffice}</p>
                    <p className="text-xs">Cell: {facultyData.phoneMobile}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-xl overflow-hidden shadow-md">
              <div className="bg-[#1e3a5f] dark:bg-[#162d4a] px-6 py-4">
                <h3 className="text-base font-bold text-white" style={{fontFamily: "'Merriweather', serif"}}>Send a Professional Message</h3>
              </div>
              <div className="p-6">
                {status === 'success' && (
                  <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Message sent! Dr. Shinde's office will respond shortly.
                  </div>
                )}
                {status === 'error' && (
                  <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Please fill in all required fields.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[['name', 'Full Name *', 'e.g. Dr. Ramesh Kumar', 'text'], ['email', 'Email Address *', 'e.g. ramesh@institution.edu', 'email']].map(([field, label, placeholder, type]) => (
                      <div key={field}>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                        <input type={type} placeholder={placeholder} value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                          className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject / Topic</label>
                    <input type="text" placeholder="e.g. Research Collaboration Inquiry" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message *</label>
                    <textarea rows={4} placeholder="Write your inquiry here..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500" />
                  </div>
                  <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full justify-center">
                    <Send className="w-4 h-4" />
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
