'use client'
import { useState } from "react";
import star from '@/assets/star.svg';
import filledStar from '@/assets/star-fill.svg';
import Image from "next/image";

export type ReviewType = {
    labRating: number,
    collectorRating: number,
    platformRating: number,
    reviewText: string
}

export default function ReviewForm({ onSave = () => { } }: { onSave: (review: ReviewType) => void }) {
    const [review, setReview] = useState<ReviewType>({
        labRating: 0,
        collectorRating: 0,
        platformRating: 0,
        reviewText: ''
    })

    return (
        <div className="text-sm flex flex-col p-6 pt-5 gap-5">
            <StarReview label='Collector Rating' stars={review.collectorRating} onChange={(val) => setReview({ ...review, collectorRating: val })} />
            <StarReview label='Lab Rating' stars={review.labRating} onChange={(val) => setReview({ ...review, labRating: val })} />
            <StarReview label='Platform Rating' stars={review.platformRating} onChange={(val) => setReview({ ...review, platformRating: val })} />
            <div className='flex flex-col gap-1'>
                <label className='font-medium'>Others</label>
                <textarea className='border-2 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter any other issue or idea that can help you' value={review.reviewText} onChange={(e) => setReview({ ...review, reviewText: e.target.value })}></textarea>
            </div>
            <button className='bg-orange-500 text-white rounded-md py-2' onClick={() => onSave(review)}>Submit</button>
        </div>
    )
}

function StarReview({ label = "", stars = 5, onChange = () => { }, totalStars = 5 }: { label?: string, stars?: number, onChange?: (star: number) => void, totalStars?: number }) {
    return (
        <div className='flex flex-col gap-1'>
            <label className='font-medium'>{label}</label>
            <div className='flex gap-1'>
                {[...Array(totalStars)].map((_, i) => {
                    return (
                        <Image key={i} src={i < stars ? filledStar : star} alt='' className='w-6 h-6 cursor-pointer' onClick={() => onChange(i + 1)} />
                    )
                })}
            </div>
        </div>
    )
}