import Model from '@/components/Model'
import React, { ReactNode } from 'react'

type Props = {
    msg?: ReactNode,
    approveLabel?: string,
    declineLabel?: string,
    onApprove?: () => void,
    onDecline?: () => void
}

const ConfirmationModel = ({ msg = '', approveLabel = 'Yes', declineLabel = 'No', onApprove = () => { }, onDecline = () => { } }: Props) => {
    return (
        <Model heading='Confirm' onClose={onDecline}>
            {msg}
            <div className='flex gap-2 px-6 py-6 ms-auto'>
                <div className='px-3 py-1 rounded cursor-pointer text-primary font-medium border-2 border-primary text-base' onClick={onDecline}>{declineLabel}</div>
                <div className='px-3 py-1 rounded cursor-pointer text-white font-medium border-2 bg-primary border-primary text-base' onClick={() => { onApprove(); onDecline() }}>{approveLabel}</div>
            </div>
        </Model>
    )
}

export default ConfirmationModel