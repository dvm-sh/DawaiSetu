import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200">
          <div className="grid md:grid-cols-2">
            <div className="p-8 sm:p-12 bg-teal-700 text-white">
              <h1 className="text-3xl font-bold mb-6">Get in Touch</h1>
              <p className="text-teal-100 mb-10 leading-relaxed">
                Have questions about DawaiSetu? Whether you're looking to donate surplus medicines or register as a recipient, our team is here to help.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-200">Email Us</p>
                    <p className="font-medium">support@dawaisetu.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-200">Call Us</p>
                    <p className="font-medium">+91 1800-DAWAI-CARE</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-200">HQ Location</p>
                    <p className="font-medium">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={4} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="button" className="w-full bg-teal-600 text-white font-medium py-3 rounded-xl hover:bg-teal-700 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
