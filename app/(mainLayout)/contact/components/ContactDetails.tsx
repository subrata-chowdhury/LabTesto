import { PhoneIcon } from '@/assets/reactIcon/contact/Phone'
import { MailIcon } from '@/assets/reactIcon/contact/Mail'
import { LocationIcon } from '@/assets/reactIcon/contact/Location'

export default function ContactDetails({ className = "flex-col", iconClassName = "" }: { className?: string , iconClassName?: string}) {
    return (
        <div className={'flex gap-8 my-auto ' + className}>
            <div className='flex items-center gap-4'>
                <div className={'p-4 bg-white rounded-full shadow text-black ' + iconClassName}>
                    <PhoneIcon />
                </div>
                <div>
                    <div className='font-bold'>Phone</div>
                    +91 82507 11212
                </div>
            </div>
            <div className='flex items-center gap-4'>
                <div className={'p-4 bg-white rounded-full shadow text-black ' + iconClassName}>
                    <MailIcon />
                </div>
                <div>
                    <div className='font-bold'>Email</div>
                    sayan825071das@gmail.com
                </div>
            </div>
            <div className='flex items-center gap-4'>
                <div className={'p-4 bg-white rounded-full shadow text-black ' + iconClassName}>
                    <LocationIcon />
                </div>
                <div>
                    <div className='font-bold'>Location</div>
                    Kadasole more, Bankura, <br />Pin.: 722202 - West Bengal
                </div>
            </div>
        </div>
    )
}