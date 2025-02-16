import { useState } from "react"

export default function ReviewForm() {
    const [review, setReview] = useState<{
        labRating: number,
        collectorRating: number,
        platformRating: number,
        reviewText: string
    }>({
        labRating: 0,
        collectorRating: 0,
        platformRating: 0,
        reviewText: ''
    })

    return (
        <div className="flex flex-col gap-2">
            <div className='text-sm flex flex-col gap-1 pt-4'>
                <label className='font-medium'>Others</label>
                <textarea className='border-2 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Risk Assessment' value={review.reviewText} onChange={(e) => setReview({ ...review, reviewText: e.target.value })}></textarea>
            </div>
        </div>
    )
}