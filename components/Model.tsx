import { CrossIcon } from "@/assets/reactIcon/Cross";

interface ModelProps {
    children?: React.ReactNode;
    onClose: () => void;
    className?: string;
    heading?: string;
}

function Model({ children, onClose = () => { }, className = '', heading = "" }: ModelProps) {
    return (
        <div className="fixed inset-0 flex items-center top-to-bottom justify-center bg-black bg-opacity-50 backdrop-blur-sm z-30" onClick={onClose}>
            <div className={`bg-white dark:bg-[#172A46] rounded-md shadow-md flex flex-col ${className}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center px-6 py-5 border-b-2">
                    <h1 className="text-xl font-semibold">{heading}</h1>
                    <span className="cursor-pointer" onClick={onClose}>
                        <CrossIcon />
                    </span>
                </div>
                {children}
            </div>
        </div>
    );
}

export default Model;