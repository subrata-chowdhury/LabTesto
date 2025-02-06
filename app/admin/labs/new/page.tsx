'use client'
import React from 'react'
import LabForm, { LabDetails } from '../components/LabForm'

const Page = () => {
    const [labDetails, setLabDetails] = React.useState<LabDetails>({
        name: '',
        location: { address: '', location: { lat: 0, lang: 0 } },
        prices: [],
        ranges: [],
    })

    return (
        <div>
            <LabForm
                labDetails={labDetails}
                error={null}
                onChange={{ labDetails: setLabDetails }}
                onSave={() => { }}
            />
        </div>
    )
}

export default Page