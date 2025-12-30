/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useToast } from "../components/ToastProvider";

export default function SettingsPage() {
  const { addToast } = useToast();
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    pushAlerts: true,
    newsletter: false,
    productTips: true,
  });
  const [initialPrefs, setInitialPrefs] = useState({
    emailAlerts: true,
    pushAlerts: true,
    newsletter: false,
    productTips: true,
  });

  // Load saved prefs from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gc_settings_prefs');
      if (raw) {
        const parsed = JSON.parse(raw);
        setPrefs(prev => ({ ...prev, ...parsed }));
        setInitialPrefs(prev => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const dirty = useMemo(() => JSON.stringify(prefs) !== JSON.stringify(initialPrefs), [prefs, initialPrefs]);

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    localStorage.setItem('gc_settings_prefs', JSON.stringify(prefs));
    setInitialPrefs(prefs);
    addToast("Préférences enregistrées", "success");
  };

  const handleCancel = () => {
    setPrefs(initialPrefs);
    addToast("Modifications annulées", "info");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
            <p className="text-sm text-slate-600">Ajustez vos préférences simplement. Tout est sauvegardé sur ce navigateur.</p>
          </div>

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
              <p className="text-sm text-slate-600">Choisissez comment vous souhaitez être averti.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {[{
                label: "Alertes par email",
                desc: "Locations, commandes et notifications administratives.",
                key: 'emailAlerts' as const
              }, {
                label: "Alertes in-app",
                desc: "Toasts et notifications dans l'interface.",
                key: 'pushAlerts' as const
              }].map(item => (
                <div key={item.label} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => togglePref(item.key)}
                    className={`relative h-7 w-12 rounded-full transition ${prefs[item.key] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    aria-pressed={prefs[item.key]}
                  >
                    <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition ${prefs[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">Communication</h2>
              <p className="text-sm text-slate-600">Restez au courant sans surcharger votre boîte mail.</p>
            </div>

            <div className="space-y-3">
              {[{
                label: "Newsletter produits",
                desc: "Jusqu'à 2 emails par mois avec les nouveautés.",
                key: 'newsletter' as const
              }, {
                label: "Guides & astuces",
                desc: "Conseils rapides sur les modules et bonnes pratiques.",
                key: 'productTips' as const
              }].map(item => (
                <label key={item.label} className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={prefs[item.key]}
                    onChange={() => togglePref(item.key)}
                    className="mt-1 h-4 w-4 text-emerald-600 border-slate-300 rounded"
                  />
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <button
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:border-slate-300 transition disabled:opacity-50"
              onClick={handleCancel}
              disabled={!dirty}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!dirty}
              className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
