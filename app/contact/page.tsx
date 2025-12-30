// app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: '📞',
      title: 'Téléphone',
      info: '+216 25 123 456',
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0
    },
    {
      icon: '📧',
      title: 'Email',
      info: 'support@agriconnect.tn',
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.2
    },
    {
      icon: '📍',
      title: 'Adresse',
      info: 'Tunis, Tunisie',
      gradient: 'from-orange-500 to-red-500',
      delay: 0.4
    }
  ];

  const faqs = [
    {
      question: 'Comment puis-je créer un compte?',
      answer: 'Cliquez sur le bouton "Inscription" sur la page d\'accueil et remplissez les informations demandées.'
    },
    {
      question: 'Y a-t-il des frais pour l\'utilisation de la plateforme?',
      answer: 'Notre plateforme offre des services gratuits avec des options premium additionnelles. Consultez nos conditions pour plus de détails.'
    },
    {
      question: 'Comment puis-je vendre un produit?',
      answer: 'Une fois connecté, allez à la section "Créer un Produit" et remplissez les détails de votre produit agricole.'
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 pt-20 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(74, 222, 128, 0.4) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Hero Section with 3D Effect */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pb-20">
          <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Animated Text */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-7xl font-extrabold mb-6 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                Contactez-Nous
              </motion.h1>
              <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
                Nous sommes là pour vous aider. N&apos;hésitez pas à nous poser vos questions.
              </p>

              {/* Animated Contact Methods */}
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: method.delay, duration: 0.6 }}
                    onHoverStart={() => setHoveredCard(index)}
                    onHoverEnd={() => setHoveredCard(null)}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${method.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <div className="relative bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all duration-300 flex items-center space-x-4">
                      <motion.div
                        animate={{
                          rotate: hoveredCard === index ? 360 : 0,
                          scale: hoveredCard === index ? 1.2 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl"
                      >
                        {method.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{method.title}</h3>
                        <p className="text-gray-300">{method.info}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - 3D Form */}
            <motion.div
              initial={{ x: 100, opacity: 0, rotateY: -30 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-yellow-500 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative bg-gray-800/90 backdrop-blur-xl p-10 rounded-3xl border border-gray-700 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                  Envoyez-nous un Message
                </h2>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="text-center py-20"
                    >
                      <div className="text-8xl mb-4">✓</div>
                      <h3 className="text-2xl font-bold text-green-400">Message Envoyé!</h3>
                      <p className="text-gray-300 mt-2">Nous vous répondrons bientôt</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[
                        { label: 'Nom', type: 'text', name: 'name', placeholder: 'Votre nom' },
                        { label: 'Email', type: 'email', name: 'email', placeholder: 'votre@email.com' },
                        { label: 'Sujet', type: 'text', name: 'subject', placeholder: 'Sujet de votre message' },
                      ].map((field, index) => (
                        <motion.div
                          key={field.name}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name as keyof typeof formData]}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                            required
                          />
                        </motion.div>
                      ))}

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Votre message..."
                          rows={5}
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                          required
                        ></textarea>
                      </motion.div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Envoyer le Message
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section with Accordion */}
        <section className="relative py-24 px-4 bg-gradient-to-b from-transparent to-black/50">
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-5xl font-extrabold text-white mb-16 text-center"
            >
              Questions Fréquemment Posées
            </motion.h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div
                    className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden cursor-pointer hover:border-green-500 transition-all duration-300"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <div className="p-6 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white pr-4">{faq.question}</h3>
                      <motion.div
                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-green-400 text-2xl flex-shrink-0"
                      >
                        ▼
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Floating Circles Animation */}
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2 border-green-500/20"
                style={{
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                  left: `${10 + i * 20}%`,
                  top: `${20 + i * 15}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 20, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto relative z-10"
          >
            <div className="bg-gradient-to-r from-green-600 to-yellow-600 p-12 rounded-3xl shadow-2xl">
              <h2 className="text-4xl font-extrabold text-white mb-4">
                Besoin d&apos;une Assistance Immédiate?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Notre équipe est disponible 24/7 pour répondre à vos questions
              </p>
              <motion.a
                href="tel:+21625123456"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="inline-block bg-white text-green-700 px-10 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Appelez-nous Maintenant
              </motion.a>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
