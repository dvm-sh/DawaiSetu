'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/theme-toggle'
import { Recycle, Building2, Heart, CheckCircle2, ArrowRight } from 'lucide-react'
import { ORG_TYPES } from '@/lib/utils'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'DONOR' | 'RECIPIENT' | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [agreedToTos, setAgreedToTos] = useState(false)
  const { register } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    organizationName: '', organizationType: '', address: '', city: '', state: '', country: 'India', pincode: '',
    contactPerson: '', phone: '', email: '', password: '', confirmPassword: '', website: '', registrationNumber: '',
    drugLicense: '', orgRegistration: '', authRepDetails: '', requiredAgreement: '', otherDocs: ''
  })
  const [files, setFiles] = useState<Record<string, File | null>>({
    drugLicense: null, orgRegistration: null, authRepDetails: null, requiredAgreement: null, otherDocs: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }))
    updateField(field, file ? file.name : '')
  }

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (!formData.organizationName) e.organizationName = 'Required'
    if (!formData.organizationType) e.organizationType = 'Required'
    if (!formData.registrationNumber) e.registrationNumber = 'Required'
    if (!formData.address) e.address = 'Required'
    if (!formData.city) e.city = 'Required'
    if (!formData.state) e.state = 'Required'
    if (!formData.pincode) e.pincode = 'Required'
    if (!formData.drugLicense) e.drugLicense = 'Required'
    if (!formData.orgRegistration) e.orgRegistration = 'Required'
    if (!formData.authRepDetails) e.authRepDetails = 'Required'
    if (!formData.requiredAgreement) e.requiredAgreement = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = () => {
    const e: Record<string, string> = {}
    if (!formData.contactPerson) e.contactPerson = 'Required'
    if (!formData.phone) e.phone = 'Required'
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required'
    if (!formData.password || formData.password.length < 8) e.password = 'Min 8 characters'
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!agreedToTos) e.tos = 'You must agree to the Terms of Service'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validateStep3()) return
    setIsLoading(true)
    setError('')

    const uploadedUrls: Record<string, string> = {}
    
    // Upload files to Supabase
    for (const [key, file] of Object.entries(files)) {
      if (file) {
        try {
          const fd = new FormData()
          fd.append('file', file)
          fd.append('folder', 'organization-docs')
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          const data = await res.json()
          if (data.success) {
            uploadedUrls[key] = data.url
          } else {
            console.warn(`Supabase upload failed for ${key} with error:`, data.error)
          }
        } catch (e) {
          console.warn(`Supabase upload threw an exception for ${key}:`, e)
        }
      }
    }

    const finalData = {
      ...formData,
      role,
      drugLicense: uploadedUrls.drugLicense || formData.drugLicense,
      orgRegistration: uploadedUrls.orgRegistration || formData.orgRegistration,
      authRepDetails: uploadedUrls.authRepDetails || formData.authRepDetails,
      requiredAgreement: uploadedUrls.requiredAgreement || formData.requiredAgreement,
      otherDocs: uploadedUrls.otherDocs || formData.otherDocs
    }

    const result = await register(finalData)
    if (result.success) {
      setSuccess(true)
      addToast({ type: 'success', title: 'Registration successful!', message: 'Your organization is pending verification.' })
    } else {
      setError(result.error || 'Registration failed')
    }
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 transition-colors">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 text-center shadow-2xl border border-gray-200 dark:border-gray-800"
        >
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Registration Submitted!</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
            Your organization details and verification documents have been received. Our admin team will review your application shortly.
          </p>
          <Link href="/login" className="inline-flex items-center justify-center px-6 py-3.5 bg-teal-600 text-white font-semibold rounded-2xl hover:bg-teal-700 transition-all w-full shadow-lg shadow-teal-600/30">
            Go to Login
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors relative overflow-hidden">
      <div className="p-4 sm:p-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-md">
            <Recycle className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">DawaiSetu</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 pb-12 z-10">
        <div className="w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/90 dark:border-gray-800 p-6 sm:p-10 transition-colors"
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Register Your Organization</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Join the verified medicine redistribution network</p>

            {/* Step Progress Bar */}
            <div className="flex items-center gap-3 mb-8">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex-1 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                    {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-1 rounded-full ${step > s ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-800'}`} />}
                </div>
              ))}
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl text-sm text-red-700 dark:text-red-300">{error}</div>}

            <AnimatePresence mode="wait">
              {/* Step 1: Role Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Select your organization role:</p>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setRole('DONOR'); setStep(2) }}
                    className={`w-full p-6 rounded-2xl border-2 text-left transition-all cursor-pointer shadow-sm ${role === 'DONOR' ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/60 hover:border-teal-400'}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-teal-100 dark:bg-teal-950/80 rounded-2xl flex items-center justify-center shrink-0">
                        <Building2 className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-base">Donate Medicine</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">For pharmacies, hospitals, clinics & pharmaceutical distributors with surplus stock</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-teal-500" />
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setRole('RECIPIENT'); setStep(2) }}
                    className={`w-full p-6 rounded-2xl border-2 text-left transition-all cursor-pointer shadow-sm ${role === 'RECIPIENT' ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/60 hover:border-teal-400'}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 rounded-2xl flex items-center justify-center shrink-0">
                        <Heart className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-base">Receive Medicine</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">For registered NGOs, rural health centers, charitable clinics & trust hospitals</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-500" />
                    </div>
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <Input label="Organization Name" value={formData.organizationName} onChange={e => updateField('organizationName', e.target.value)} error={errors.organizationName} required />
                  <Select label="Organization Type" options={ORG_TYPES} value={formData.organizationType} onChange={e => updateField('organizationType', e.target.value)} placeholder="Select type" error={errors.organizationType} required />
                  <Input label="Registration / License Number" value={formData.registrationNumber} onChange={e => updateField('registrationNumber', e.target.value)} error={errors.registrationNumber} required />
                  <Textarea label="Address" value={formData.address} onChange={e => updateField('address', e.target.value)} error={errors.address} required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" value={formData.city} onChange={e => updateField('city', e.target.value)} error={errors.city} required />
                    <Input label="State" value={formData.state} onChange={e => updateField('state', e.target.value)} error={errors.state} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Country" value={formData.country} onChange={e => updateField('country', e.target.value)} required />
                    <Input label="PIN / ZIP Code" value={formData.pincode} onChange={e => updateField('pincode', e.target.value)} error={errors.pincode} required />
                  </div>
                  <Input label="Website (optional)" value={formData.website} onChange={e => updateField('website', e.target.value)} placeholder="https://" />

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Verification Documents</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Upload required verification documents for admin review (PDF, JPG, PNG)</p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Drug License *</label>
                        <input type="file" onChange={(e) => handleFileChange('drugLicense', e.target.files?.[0] || null)} className="text-xs text-gray-500 dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 dark:file:bg-teal-950/50 file:text-teal-700 dark:file:text-teal-300" />
                        {errors.drugLicense && <p className="text-xs text-red-500 mt-1">{errors.drugLicense}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Organization Registration *</label>
                        <input type="file" onChange={(e) => handleFileChange('orgRegistration', e.target.files?.[0] || null)} className="text-xs text-gray-500 dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 dark:file:bg-teal-950/50 file:text-teal-700 dark:file:text-teal-300" />
                        {errors.orgRegistration && <p className="text-xs text-red-500 mt-1">{errors.orgRegistration}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Authorized Representative Details *</label>
                        <input type="file" onChange={(e) => handleFileChange('authRepDetails', e.target.files?.[0] || null)} className="text-xs text-gray-500 dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 dark:file:bg-teal-950/50 file:text-teal-700 dark:file:text-teal-300" />
                        {errors.authRepDetails && <p className="text-xs text-red-500 mt-1">{errors.authRepDetails}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Required Agreement *</label>
                        <input type="file" onChange={(e) => handleFileChange('requiredAgreement', e.target.files?.[0] || null)} className="text-xs text-gray-500 dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 dark:file:bg-teal-950/50 file:text-teal-700 dark:file:text-teal-300" />
                        {errors.requiredAgreement && <p className="text-xs text-red-500 mt-1">{errors.requiredAgreement}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button onClick={() => validateStep2() && setStep(3)} className="flex-1">Continue</Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Account */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <Input label="Contact Person Name" value={formData.contactPerson} onChange={e => updateField('contactPerson', e.target.value)} error={errors.contactPerson} required />
                  <Input label="Phone Number" type="tel" value={formData.phone} onChange={e => updateField('phone', e.target.value)} error={errors.phone} required />
                  <Input label="Account Email" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} error={errors.email} required />
                  <Input label="Password" type="password" value={formData.password} onChange={e => updateField('password', e.target.value)} error={errors.password} hint="Minimum 8 characters" required />
                  <Input label="Confirm Password" type="password" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} error={errors.confirmPassword} required />

                  <div className="flex items-start gap-3 py-2">
                    <input
                      id="tos"
                      type="checkbox"
                      checked={agreedToTos}
                      onChange={(e) => {
                        setAgreedToTos(e.target.checked)
                        if (errors.tos && e.target.checked) {
                          setErrors(prev => { const n = { ...prev }; delete n.tos; return n })
                        }
                      }}
                      className="w-4 h-4 text-teal-600 border-gray-300 dark:border-gray-700 rounded focus:ring-teal-500 mt-1 cursor-pointer"
                    />
                    <label htmlFor="tos" className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer">
                      I have read and agree to the <Link href="/terms" target="_blank" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">Terms of Service</Link>, confirming responsibility for medicine quality and compliant redistribution.
                    </label>
                  </div>
                  {errors.tos && <p className="text-xs text-red-500 font-medium">{errors.tos}</p>}

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                    <Button onClick={handleSubmit} isLoading={isLoading} className="flex-1">Complete Registration</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
