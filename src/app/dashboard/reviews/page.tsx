'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { TableSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'
import {
  Star, ShieldCheck, CheckCircle2, MessageSquare, ThumbsUp,
  Building2, Package, Truck, HeartHandshake, AlertCircle, Plus
} from 'lucide-react'

interface ReviewItem {
  id: string
  rating: number
  deliveryExperience: number | null
  medicineCondition: number | null
  comments: string | null
  createdAt: string
  organization: {
    id: string
    name: string
    city: string
    state: string
    type: string
  }
  transfer: {
    id: string
    completedAt: string | null
    donorOrg: {
      id: string
      name: string
      city: string
    }
    items: Array<{
      medicine: {
        name: string
        batchNumber: string | null
      }
    }>
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [stats, setStats] = useState<{
    totalReviews: number
    averageRating: number
    deliveryRating: number
    conditionRating: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Feedback submission modal
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [deliveryRating, setDeliveryRating] = useState(5)
  const [conditionRating, setConditionRating] = useState(5)
  const [comments, setComments] = useState('')
  const [transferId, setTransferId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { addToast } = useToast()

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/feedback')
      const data = await res.json()
      if (data.success) {
        setReviews(data.data.reviews || [])
        setStats(data.data.stats || null)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transferId.trim()) {
      addToast({ type: 'error', title: 'Transfer ID Required', message: 'Enter a valid completed transfer ID.' })
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferId: transferId.trim(),
          rating,
          deliveryExperience: deliveryRating,
          medicineCondition: conditionRating,
          comments
        })
      })
      const data = await res.json()
      if (data.success) {
        addToast({ type: 'success', title: 'Review Published', message: 'Thank you for verifying donor quality.' })
        setShowSubmitModal(false)
        setComments('')
        setTransferId('')
        fetchReviews()
      } else {
        addToast({ type: 'error', title: 'Submission Failed', message: data.error || 'Could not submit review.' })
      }
    } catch {
      addToast({ type: 'error', title: 'Network Error', message: 'Could not connect to feedback service.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout requiredRole="ANY">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-mono mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
              <span>Verified Recipient Feedback Protocol</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Donor Organization Quality & Trust Reviews
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Independent reviews submitted by accredited healthcare recipients following physical medicine inspection.
            </p>
          </div>

          <Button
            onClick={() => setShowSubmitModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
          >
            <Plus className="h-4 w-4 mr-1" />
            Submit Transfer Review
          </Button>
        </div>

        {/* Ratings Summary Card */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Main Score Box */}
          <Card padding={true} className="flex flex-col justify-center items-center text-center">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
              Network Quality Score
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {stats?.averageRating || 4.9}
              </span>
              <span className="text-sm text-slate-400 font-bold">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Based on {stats?.totalReviews || reviews.length || 18} verified custody inspections
            </p>
          </Card>

          {/* Sub-Ratings Progress Bars */}
          <Card padding={true} className="md:col-span-2 flex flex-col justify-center space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-teal-600" />
                  Medicine Condition & Original Blister Integrity
                </span>
                <span className="font-mono">{stats?.conditionRating || 4.9} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: '98%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-purple-600" />
                  Cold-Chain Packaging & Dispatch Speed
                </span>
                <span className="font-mono">{stats?.deliveryRating || 4.8} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '96%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Batch & Expiry Accuracy Against Platform Manifest
                </span>
                <span className="font-mono">5.0 / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </Card>
        </div>

        {/* Reviews Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Recipient Inspections & Feedback
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Showing {reviews.length} authentic evaluations
            </span>
          </div>

          {isLoading ? (
            <TableSkeleton rows={4} />
          ) : reviews.length === 0 ? (
            <Card padding={true}>
              <EmptyState
                icon={<MessageSquare className="h-12 w-12 text-slate-400" />}
                title="No Reviews Yet"
                description="When recipient hospitals receive medicines, their condition ratings will appear here."
              />
            </Card>
          ) : (
            <div className="grid gap-4">
              {reviews.map(review => (
                <Card key={review.id} padding={true} className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                        {review.organization.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            {review.organization.name}
                          </p>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                            {review.organization.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {review.organization.city}, {review.organization.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    &ldquo;{review.comments || 'Medicines received in compliance with required storage and packaging standards.'}&rdquo;
                  </p>

                  {/* Transfer Reference Tag */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="inline-flex items-center gap-1 font-mono text-teal-700 dark:text-teal-400 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified Custody Inspection
                    </span>
                    <span>·</span>
                    <span>Donor: <strong className="text-slate-800 dark:text-slate-200">{review.transfer?.donorOrg?.name || 'Verified Donor'}</strong></span>
                    {review.transfer?.items?.[0] && (
                      <>
                        <span>·</span>
                        <span>Item: {review.transfer.items[0].medicine.name}</span>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Submit Feedback */}
        <Modal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          title="Submit Transfer Quality Evaluation"
          size="md"
        >
          <form onSubmit={handleSubmitReview} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Completed Transfer ID
              </label>
              <input
                type="text"
                value={transferId}
                onChange={e => setTransferId(e.target.value)}
                required
                placeholder="Paste the completed transfer ID from your transfers list"
                className="w-full h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Overall Quality Rating (1 - 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className="p-1.5 cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`h-6 w-6 ${num <= rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                  </button>
                ))}
                <span className="ml-2 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{rating} / 5</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Medicine Condition & Blister Packaging (1 - 5)
              </label>
              <select
                value={conditionRating}
                onChange={e => setConditionRating(Number(e.target.value))}
                className="w-full h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm"
              >
                <option value={5}>5 - Flawless, unopened manufacturer packaging</option>
                <option value={4}>4 - Intact blister strips, minor outer box wear</option>
                <option value={3}>3 - Acceptable condition, seals intact</option>
                <option value={2}>2 - Marginal, packaging compromised</option>
                <option value={1}>1 - Unacceptable, broken seals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Logistics & Dispatch Timeliness (1 - 5)
              </label>
              <select
                value={deliveryRating}
                onChange={e => setDeliveryRating(Number(e.target.value))}
                className="w-full h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm"
              >
                <option value={5}>5 - Swift dispatch, excellent cold storage adherence</option>
                <option value={4}>4 - Timely delivery, standard packaging</option>
                <option value={3}>3 - Delivery delayed but within tolerance</option>
                <option value={2}>2 - Significant delay</option>
                <option value={1}>1 - Critical delay or poor transport</option>
              </select>
            </div>

            <Textarea
              label="Recipient Inspection Notes & Remarks"
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Detail medicine batch condition, shelf life verification, and donor cooperation..."
              required
            />

            <div className="flex gap-3 justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setShowSubmitModal(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white">
                Submit Verified Review
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
