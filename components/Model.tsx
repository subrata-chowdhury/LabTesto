import Image from "next/image";
import cross from "@/assets/cross.svg"

interface ModelProps {
    children?: React.ReactNode;
    onClose: () => void;
    className?: string;
    heading?: string;
}

function Model({ children, onClose = () => { }, className = '', heading = "" }: ModelProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10" onClick={onClose}>
            <div className={"bg-white rounded-md shadow-md flex flex-col " + className} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between px-6 py-5 border-b-2">
                    <h1 className="text-xl font-semibold">{heading}</h1>
                    <Image src={cross} alt="" width={24} height={24} style={{ width: 24, height: 24 }} className="cursor-pointer" onClick={onClose} />
                </div>
                {children}
            </div>
        </div>
    );
}

export default Model;