import React, { useState, useEffect } from 'react';
import { Mail, Save } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { FormInput, FormTextarea, ToggleSwitch } from '../components/FormControls';
import { facultyData } from '../../data/facultyData';

export const ContactManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [formData, setFormData] = useState({
    email_primary: facultyData.emails[0] || 'swati.shinde@pccoepune.org',
    email_secondary: facultyData.emails[1] || 'swaatii.shinde@gmail.com',
    phone_office: facultyData.phoneOffice,
    phone_mobile: facultyData.phoneMobile,
    address: facultyData.address,
    enable_contact_form: true,
    publish_status: 'published',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    portfolioService.contactInfo.get(true).then((res) => {
      if (res.data) {
        setFormData(res.data);
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await portfolioService.contactInfo.save(formData);
    setSaving(false);
    if (!error) {
      showToast('Contact information saved successfully!');
      triggerRefresh();
    } else {
      showToast('Failed to save contact information: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <div className="w-8 h-8 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs">Loading contact information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-zinc-300" /> Contact Details & Office Communications
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure official email addresses, campus office phone, mobile contact, and mailing address.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2 bg-zinc-100 hover:bg-white text-black text-xs font-black rounded-xl transition-all cursor-pointer shadow-lg active:scale-98"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Contact'}
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Primary Official Email"
            name="email_primary"
            type="email"
            value={formData.email_primary}
            onChange={handleChange}
            placeholder="swati.shinde@pccoepune.org"
            required
          />

          <FormInput
            label="Secondary / Alternate Email"
            name="email_secondary"
            type="email"
            value={formData.email_secondary}
            onChange={handleChange}
            placeholder="swaatii.shinde@gmail.com"
          />

          <FormInput
            label="Office Campus Phone"
            name="phone_office"
            value={formData.phone_office}
            onChange={handleChange}
            placeholder="+91-020-27653166"
          />

          <FormInput
            label="Direct Mobile Contact"
            name="phone_mobile"
            value={formData.phone_mobile}
            onChange={handleChange}
            placeholder="+91 7350318050"
          />

          <div className="md:col-span-2">
            <FormTextarea
              label="Campus & Department Postal Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              placeholder="Sector No. 26, Pradhikaran, Nigdi, Pune – 411044"
              required
            />
          </div>

          <div className="md:col-span-2">
            <ToggleSwitch
              label="Enable Interactive Inquiry Form"
              description="Allow prospective research scholars and conference organizers to send messages directly from the website."
              checked={formData.enable_contact_form}
              onChange={(val) => setFormData((prev) => ({ ...prev, enable_contact_form: val }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
