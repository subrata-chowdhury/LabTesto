import fetcher from "@/lib/fetcher";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import eyeIcon from '@/assets/eye.svg';
import deleteIcon from '@/assets/trash-bin.svg';
import attachIcon from '@/assets/attach.svg'

const UploadToCloudinary = ({ imgUrl, apiPath, onUpload }: { imgUrl?: string, apiPath: string, onUpload: (url: string) => void }) => {
    const [loading, setLoading] = useState(false);
    const imageInput = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file.size < 900 * 1024) { // 900 KB
                setLoading(true);
                const form = new FormData();
                form.append('file', file);
                const res = await fetch(apiPath, {
                    method: "POST",
                    body: form, // ✅ Automatically sets Content-Type to "multipart/form-data"
                });
                const url = (await res.json()).url || '';
                onUpload(url);
                setLoading(false);
            } else {
                toast.warning("File size should be less than 900KB");
            }
        }
    }

    async function deleteFile() {
        if (!imgUrl) {
            toast.error("No image to delete");
            return;
        }
        setLoading(true);
        const res = await fetcher.delete(apiPath.replace(/^\/api/, ''), { publicId: imgUrl.split("/").pop()?.split(".")[0] || null });
        if (res.error) {
            toast.error(res.error);
        } else {
            onUpload('');
            toast.success("Image deleted successfully");
        }
        setLoading(false);
    }

    return (
        <div className="flex items-center space-x-3 px-3 py-2 rounded border-2">
            {/* If imageName is null, don't show anything */}
            <div
                className="text-gray-500 flex-1 mr-2 cursor-pointer truncate"
                onClick={() => { }}
            >
                {!loading && (imgUrl && imgUrl.length > 0) && imgUrl.split("/").pop()?.split(".")[0] || null}
            </div>
            <div>
                {!loading && <Image src={attachIcon} alt="" width={20} height={20} className="cursor-pointer" onClick={() => imageInput.current?.click()} />}
                {loading && <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-transparent border-gray-900"></div>
                </div>}
            </div>
            {!loading && (imgUrl && imgUrl.length > 0) && (
                <button
                    onClick={() => window.open(imgUrl, "_blank")}
                >
                    <Image src={eyeIcon} alt="" />
                </button>
            )}
            <input
                key={imgUrl}
                ref={imageInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden w-full"
            />
            {!loading && (imgUrl && imgUrl.length > 0) && (
                <span
                    className="text-red-500 cursor-pointer turncate"
                    onClick={() => deleteFile()}
                >
                    <Image src={deleteIcon} alt="" />
                </span>
            )}
        </div>
    );
};

export default UploadToCloudinary;
