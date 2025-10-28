import { PhoneIcon } from '@/assets/reactIcon/contact/Phone'
import { MailIcon } from '@/assets/reactIcon/contact/Mail'
import { LocationIcon } from '@/assets/reactIcon/contact/Location'

export default function ContactDetails({ className = "", iconClassName = "" }: { className?: string, iconClassName?: string }) {
    return (
        <div className={'grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 my-8 w-full max-w-7xl px-6 mx-auto ' + className}>
            <div className='flex flex-col items-center shadow-md rounded-xs p-4 gap-4 bg-white dark:bg-black border-2 border-gray-300/50 dark:border-white/30'>
                <div className={'p-4 bg-white rounded-full border border-gray-300/50 shadow text-black ' + iconClassName}>
                    <PhoneIcon />
                </div>
                <div className='text-center'>
                    <div className='font-bold text-lg'>Call Us</div>
                    <div className='text-sm text-primary/70 dark:text-white/70'>+91 82507 11212</div>
                </div>
            </div>
            <div className='flex flex-col items-center shadow-md rounded-xs gap-4 p-4 bg-white dark:bg-black border-2 border-gray-300/50 dark:border-white/30'>
                <div className={'p-4 bg-white rounded-full border border-gray-300/50 shadow text-black ' + iconClassName}>
                    <MailIcon />
                </div>
                <div className='text-center'>
                    <div className='font-bold text-lg'>Email Us</div>
                    <div className='text-sm text-primary/70 dark:text-white/70'>sayan825071das@gmail.com</div>
                </div>
            </div>
            <div className='flex flex-col items-center shadow-md rounded-xs gap-4 p-4 bg-white dark:bg-black border-2 border-gray-300/50 dark:border-white/30'>
                <div className={'p-4 bg-white rounded-full border border-gray-300/50 shadow text-black ' + iconClassName}>
                    <LocationIcon />
                </div>
                <div className='text-center'>
                    <div className='font-bold text-lg'>Visit Us</div>
                    <div className='text-sm text-primary/70 dark:text-white/70'>Kadasole more, Bankura, <br />Pin.: 722202 - West Bengal</div>
                </div>
            </div>
        </div>
    )
}