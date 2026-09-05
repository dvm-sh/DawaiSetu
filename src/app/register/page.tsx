'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/theme-toggle'
import { Recycle, Building2, Heart } from 'lucide-react'
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
    // Document names
    drugLicense: '', orgRegistration: '', authRepDetails: '', requiredAgreement: '', otherDocs: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
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

    const result = await register({ ...formData, role })
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
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Registration Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Your organization has been registered and is pending verification by our admin team. You will be notified once approved.</p>
          <Link href="/login" className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors w-full">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors">
      <div className="p-4 sm:p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Recycle className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">DawaiSetu</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 pb-12">
        <div className="w-full max-w-lg">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 transition-colors">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Register Your Organization</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Join DawaiSetu to donate or receive medicines</p>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>{s}</div>
                  {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-800'}`} />}
                </div>
              ))}
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-sm text-red-700 dark:text-red-300">{error}</div>}

            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">I want to:</p>
                <button
                  onClick={() => { setRole('DONOR'); setStep(2) }}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all hover:border-teal-500 cursor-pointer ${role === 'DONOR' ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/60 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Donate Medicines</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">I have surplus medicines to share</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => { setRole('RECIPIENT'); setStep(2) }}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all hover:border-teal-500 cursor-pointer ${role === 'RECIPIENT' ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center">
                      <Heart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Receive Medicines</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">I need medicines for my patients</p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Step 2: Organization Details */}
            {step === 2 && (
              <div className="space-y-4">
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
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Verification Documents</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please upload the required verification documents (PDF, JPG, PNG). *Simulated for demo*</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Drug License *</label>
                      <input type="file" onChange={(e) => updateField('drugLicense', e.target.files?.[0]?.name || '')} className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 dark:file:bg-teal-950/50 file:text-teal-700 dark:file:text-teal-300 hover:file:bg-teal-100 dark:hover:file:bg-teal-900/60" />
                      {errors.drugLicense && <p className="text-xs text-red-500 mt-1">{errors.drugLicense}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization Registration *</label>
                      <input type="file" onChange={(e) => updateField('orgRegistration', e.target.files?.[0]?.name || '')} className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 dark:file:bg-teal-950/50 file:text-teal-700 dark:file:text-teal-300 hover:file:bg-teal-100 dark:hover:file:bg-teal-900/60" />
                      {errors.orgRegistration && <p className="text-xs text-red-500 mt-1">{errors.orgRegistration}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Authorized Representative Details *</label>
                      <input type="file" onChange={(e) => updateField('authRepDetails', e.target.files?.[0]?.name || '')} className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 dark:file:bg-teal-950/50 file:text-teal-700 dark:file:text-teal-300 hover:file:bg-teal-100 dark:hover:file:bg-teal-900/60" />
                      {errors.authRepDetails && <p className="text-xs text-red-500 mt-1">{errors.authRepDetails}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Required Agreement *</label>
                      <input type="file" onChange={(e) => updateField('requiredAgreement', e.target.files?.[0]?.name || '')} className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 dark:file:bg-teal-950/50 file:text-teal-700 dark:file:text-teal-300 hover:file:bg-teal-100 dark:hover:file:bg-teal-900/60" />
                      {errors.requiredAgreement && <p className="text-xs text-red-500 mt-1">{errors.requiredAgreement}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Verification Documents (Optional)</label>
                      <input type="file" onChange={(e) => updateField('otherDocs', e.target.files?.[0]?.name || '')} className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 dark:file:bg-teal-950/50 file:text-teal-700 dark:file:text-teal-300 hover:file:bg-teal-100 dark:hover:file:bg-teal-900/60" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                  <Button onClick={() => validateStep2() && setStep(3)} className="flex-1">Continue</Button>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Account */}
            {step === 3 && (
              <div className="space-y-4">
                <Input label="Contact Person" value={formData.contactPerson} onChange={e => updateField('contactPerson', e.target.value)} error={errors.contactPerson} required />
                <Input label="Phone Number" type="tel" value={formData.phone} onChange={e => updateField('phone', e.target.value)} error={errors.phone} required />
                <Input label="Email" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} error={errors.email} required />
                <Input label="Password" type="password" value={formData.password} onChange={e => updateField('password', e.target.value)} error={errors.password} hint="Minimum 8 characters" required />
                <Input label="Confirm Password" type="password" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} error={errors.confirmPassword} required />
                
                <div className="flex items-start gap-3 py-2">
                  <div className="flex items-center h-5 mt-1">
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
                      className="w-4 h-4 text-teal-600 border-gray-300 dark:border-gray-700 rounded focus:ring-teal-500"
                    />
                  </div>
                  <label htmlFor="tos" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    I have read and agree to the <Link href="/terms" target="_blank" className="text-teal-600 dark:text-teal-400 hover:underline">Terms of Service</Link>, including my responsibilities regarding medicine quality and proper distribution.
                  </label>
                </div>
                {errors.tos && <p className="text-sm text-red-500 font-medium">{errors.tos}</p>}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                  <Button onClick={handleSubmit} isLoading={isLoading} className="flex-1">Register</Button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-300">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
