import React from 'react'

type Props = {}

const Footer = (props: Props) => {
    return (
        <footer className="bg-gray-800 text-white py-6 pt-5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-evenly">
                    <div className='inline-flex flex-col'>
                        <h1 className="text-lg font-bold mb-2">Footer</h1>
                        <ul>
                            {['Link 1', 'Link 2', 'Link 3'].map((link, index) => (
                                <li key={index} className="mb-1 text-sm">
                                    <a href="#" className="hover:text-gray-400">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='inline-flex flex-col'>
                        <h1 className="text-lg font-bold mb-2">Group 2</h1>
                        <ul>
                            {['Link 4', 'Link 5', 'Link 6'].map((link, index) => (
                                <li key={index} className="mb-1 text-sm">
                                    <a href="#" className="hover:text-gray-400">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='inline-flex flex-col'>
                        <h1 className="text-lg font-bold mb-2">Group 3</h1>
                        <ul>
                            {['Link 7', 'Link 8', 'Link 9'].map((link, index) => (
                                <li key={index} className="mb-1 text-sm">
                                    <a href="#" className="hover:text-gray-400">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-500 mt-5 pt-4 text-center flex justify-between text-xs">
                    <p>Privacy Policy | Terms of Service</p>
                    <p>&copy; 2023 Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;