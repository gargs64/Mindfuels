import React from 'react';

/**
 * Mind Fuels Publisher - Legal & Informational Components
 * 
 * Compliance: 
 * - Razorpay 2026 Merchant Onboarding Requirements
 * - Indian Consumer Protection (E-Commerce) Rules
 * 
 * These components use Tailwind CSS for styling.
 */

// 1. ABOUT US COMPONENT
export const AboutUs = () => (
  <section id="about" className="max-w-4xl mx-auto py-12 px-6">
    <div className="relative mb-8">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">About Us</h1>
      <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
    </div>
    <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed space-y-6">
      <p>
        Welcome to <strong>Mind Fuels Publisher and Distributers</strong>, where we believe that every child's mind is a landscape of infinite potential. Founded with a vision to "fuel young minds," we specialize in crafting and curating high-quality educational resources that make learning an adventure.
      </p>
      <div className="grid md:grid-cols-2 gap-8 my-10">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
          <h3 className="text-blue-800 font-bold text-lg mb-2">Our Specialization</h3>
          <p className="text-sm">We are masters of the foundational years. Our expertise spans across meticulously designed nursery rhymes, immersive storybooks, and curriculum-aligned educational texts.</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
          <h3 className="text-indigo-800 font-bold text-lg mb-2">Our Mission</h3>
          <p className="text-sm">To bridge the gap between imagination and education. We aim to provide tools that help children develop critical thinking and a lifelong love for reading.</p>
        </div>
      </div>
      <p>
        With over two decades of experience, we have become a trusted partner for parents and schools across India. At Mind Fuels, we don't just sell books; we plant the seeds of knowledge.
      </p>
    </div>
  </section>
);

// 2. SHIPPING POLICY COMPONENT
export const ShippingPolicy = () => (
  <section id="shipping" className="max-w-4xl mx-auto py-12 px-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mt-12">
    <div className="flex items-center space-x-4 mb-8">
      <div className="p-3 bg-green-100 rounded-xl">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
      </div>
      <h2 className="text-3xl font-bold text-slate-900">Shipping Policy</h2>
    </div>
    <div className="space-y-6 text-slate-600">
      <p className="font-medium text-slate-800 underline decoration-green-200 decoration-4 underline-offset-4">Effective: March 2026</p>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-5 rounded-xl border border-dotted border-slate-300">
          <h4 className="font-bold text-slate-900 mb-2">Processing Time</h4>
          <p className="text-sm">Orders are processed within <strong>48 hours</strong> (excluding Sundays and Public Holidays) of placement.</p>
        </div>
        <div className="bg-slate-50 p-5 rounded-xl border border-dotted border-slate-300">
          <h4 className="font-bold text-slate-900 mb-2">Delivery Timeline</h4>
          <p className="text-sm">Domestic shipping via reputed courier partners typically takes <strong>3-7 business days</strong>.</p>
        </div>
      </div>
      <ul className="list-disc pl-5 space-y-3 text-sm">
        <li>Tracking links are provided via email and SMS once the order is dispatched.</li>
        <li>We partner with leading logistics providers to ensure safe and timely delivery.</li>
      </ul>
    </div>
  </section>
);

// 3. REFUND & CANCELLATION COMPONENT
export const RefundPolicy = () => (
  <section id="refund" className="max-w-4xl mx-auto py-12 px-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mt-12">
    <div className="flex items-center space-x-4 mb-8">
      <div className="p-3 bg-red-100 rounded-xl">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"></path></svg>
      </div>
      <h2 className="text-3xl font-bold text-slate-900">Refund & Cancellation</h2>
    </div>
    <div className="space-y-8">
      <div className="border-l-4 border-red-500 pl-6 space-y-4">
        <h3 className="text-xl font-bold text-slate-900">7-Day Return Window</h3>
        <p className="text-slate-600">Customers can request a return or refund within <strong>7 days</strong> of delivery. Beyond this window, we cannot offer a refund or exchange.</p>
      </div>
      <div className="grid gap-6">
        <div className="bg-slate-50 p-6 rounded-2xl">
          <h4 className="font-bold text-slate-900 mb-3">Cancellation</h4>
          <p className="text-sm text-slate-600">Orders can be cancelled before they are processed for shipping. Email <strong>support@mindfuelspublisher.com</strong> with your Order ID to initiate cancellation.</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl">
          <h4 className="font-bold text-slate-900 mb-3">Refund Process</h4>
          <p className="text-sm text-slate-600">Refunds are processed to the <strong>original payment method</strong> within <strong>10 working days</strong> after the returned product is inspected and approved.</p>
        </div>
      </div>
    </div>
  </section>
);

// 4. PRIVACY POLICY COMPONENT
export const PrivacyPolicy = () => (
  <section id="privacy" className="max-w-4xl mx-auto py-12 px-6 mt-12">
    <div className="bg-indigo-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl space-y-8">
      <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
        <h4 className="text-lg font-bold flex items-center mb-4">
          <svg className="w-5 h-5 mr-2 text-indigo-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 1.154l7.834 3.746v5.203c0 5.091-3.334 9.854-7.834 11.232-4.5-1.378-7.834-6.141-7.834-11.232V4.9zM10 8a1 1 0 00-1 1v3a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
          Security Commitment
        </h4>
        <p className="text-indigo-100 text-sm leading-relaxed">
          Mind Fuels Publisher and Distributers does not store user passwords or sensitive payment information. All transactions are securely processed via <strong>Razorpay</strong>, a PCI-DSS certified provider.
        </p>
      </div>
      <div className="space-y-4 text-sm text-indigo-100">
        <h4 className="font-bold text-white text-base">Information Collection</h4>
        <p>We collect essential data (Name, Address, Email) only to fulfill orders and improve service. We do not sell your personal data to third parties.</p>
      </div>
    </div>
  </section>
);

// 5. TERMS & CONDITIONS COMPONENT
export const TermsAndConditions = () => (
  <section id="terms" className="max-w-4xl mx-auto py-12 px-6 mt-12">
    <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Terms & Conditions</h2>
      <div className="h-64 overflow-y-auto pr-4 text-sm text-slate-600 space-y-6">
        <p>By using our website, you agree to these Terms. All content is the property of Mind Fuels Publisher and Distributers.</p>
        <h4 className="font-bold text-slate-900">Governing Law</h4>
        <p>These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Delhi.</p>
      </div>
    </div>
  </section>
);

// 6. CONTACT US COMPONENT
export const ContactUs = () => (
  <section id="contact" className="max-w-4xl mx-auto py-12 px-6 mt-12 mb-20">
    <div className="grid md:grid-cols-2 gap-12 items-start">
      <div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Contact Us</h2>
        <div className="space-y-8 mt-10">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Address</h4>
              <p className="text-sm text-slate-600">WZ-55 B SRI NAGAR WZ-55 B Gali No 1,<br/>Delhi - 110034, North West Delhi.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Support</h4>
              <p className="text-sm text-blue-600">support@mindfuelspublisher.com</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Hours</h4>
              <p className="text-sm text-slate-600">Mon - Sat: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form Placeholder */}
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
        <h4 className="text-lg font-bold mb-6">Send a Message</h4>
        <div className="space-y-4">
          <div className="h-10 bg-slate-50 border border-slate-200 rounded-xl" />
          <div className="h-10 bg-slate-50 border border-slate-200 rounded-xl" />
          <div className="h-24 bg-slate-50 border border-slate-200 rounded-xl" />
          <div className="h-12 bg-blue-600 rounded-xl" />
        </div>
      </div>
    </div>
  </section>
);
