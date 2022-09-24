import React from 'react'
import { SocialIcon } from 'react-social-icons';
import { useState } from 'react';
import{VscTrash} from "react-icons/vsc"; 
import { PencilIcon } from "@heroicons/react/outline";
import { createLink, deleteLink } from '../../lib/fetching/dashboard'

function SocialMedia({userId, viewingUserId, dashboardId, socialLinks, onRefresh}) {

  if (userId === viewingUserId) {
    const [showModal, setShowModal] = useState(false)
    const [socialLink, setSocialLink] = useState("")

    const handleOnClose = (e) => {
      setShowModal(false)
      setSocialLink("")
    }

    const handleOnCreate = async (e) => {
      e.preventDefault()

      const res = await createLink({user_id: userId, dashboard_id: dashboardId, url: socialLink})
      if (res.ok) {
        onRefresh()
        setSocialLink("")
      }
    }

    const handleOnDelete = async (social_id) => {
      const res = await deleteLink({user_id: userId, social_id: social_id})
      if (res.ok) {
        onRefresh()
      }
    }

    const linkVerification = () => {
      if (socialLinks.length<5 && socialLink.length > 0 && (socialLink.slice(0, 8) == "https://") || (socialLink.slice(0, 7) == "http://")){
        return false
      } else {
        return true
      }
    }
  
    return (
      <>
        <div className='h-full w-full flex flex-col rounded-xl shadow-md bg-white'>
          <div className="h-[2.25rem] md:h-[3rem] w-full px-2 md:px-4 flex items-center justify-between border-b-2 border-solid border-gray-200">
              <h2 className='font-semibold text-xs md:text-base leading-tight'>Social Media</h2>
              <button className='w-4 md:w-6 h-4 md:h-6 p-[0.15rem] md:p-[0.2rem] text-black rounded-md hover:bg-gray-200' onClick={() => setShowModal(true)}>
                <PencilIcon/>
              </button>
          </div>
          <div className='w-full px-4 md:px-6 grow flex flex-row space-x-[1.4rem] sm:space-x-[2.5rem] md:space-x-[3rem] lg:space-x-[1.2rem] items-center justify-center'>
            {socialLinks.length > 0 ? (
              socialLinks.map((sLink) => (
                <SocialIcon url={sLink.url} key={sLink.social_id} className="h-10 md:h-14 lg:h-16 w-10 md:w-14 lg:w-16 text-white" target="_blank" bgColor="white" fgColor="black" style={{ height: "100%", width: "100"}}/>
            ))
            ) : (
              <p className='font-light text-justify text-xs md:text-sm leading-none sm:leading-tight md:leading-tight lg:leading-tight'>Your social media section is empty! Click on pencil icon to edit.</p>
            )}
          </div>
        </div>

        {showModal ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-center p-3 lg:p-4 border-b-2 border-solid border-gray-200 rounded-t">
                      <h3 className="text-base md:text-lg lg:text-xl text-black font-semibold">
                        Social Media
                      </h3>
                    </div>
                    {/*body*/}
                    <div className='relative p-4 lg:p-6 flex-auto'>
                      <div className='flex flex-rows items-center gap-2'>
                          <h1 className='font-semibold text-xs sm:text-sm md:text-base lg:text-lg'>URL:</h1>
                          <input type="text" className="bg-gray-200 px-2 md:px-3 py-1 w-full rounded-md text-justify text-xs sm:text-sm md:text-base outline-gray-400" placeholder="Write your social media URL" onChange={(e) => setSocialLink(e.target.value)} value={socialLink}/>
                          <button className="bg-wizeline-red text-white font-bold text-xs sm:text-sm md:text-base px-2 py-1 rounded-md hover:bg-red-600 disabled:opacity-30" disabled={linkVerification()} onClick={handleOnCreate}>
                            +
                          </button>
                      </div>
                      {socialLinks.length > 0 ? (
                          <div className='mt-5 w-[20rem] sm:w-[22.5rem] md:w-[25rem] lg:w-[27.5rem]'>
                            {socialLinks.map((sLink) => (
                              <div className='flex flex-row items-center w-full gap-2 bg-gray-100 mt-2 px-1 rounded-full shadow-md' key={sLink.social_id}>
                                <SocialIcon className='w-1/12' url={sLink.url} bgColor="none" fgColor ="black" target="_blank" style={{ height: 50, width: 50 }}/>
                                <p className='w-10/12 truncate'>{sLink.url}</p>
                                <VscTrash className='w-1/12 mx-2 text-wizeline-red text-xl hover:text-red-900 hover:cursor-pointer' onClick={() => handleOnDelete(sLink.social_id)}/>
                              </div>
                            ) )}
                          </div>
                        ) : (
                          <></>
                        )
                      }
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-4 lg:p-6 border-t-2 border-solid border-gray-200 rounded-b">
                      <button
                        className="bg-wizeline-red hover:bg-red-600 outline-none focus:outline-none ease-linear transition-all duration-150 px-5 py-2 disabled:opacity-30 rounded-md text-white font-bold text-sm lg:text-base"
                          onClick={handleOnClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
          ) : null}
      </> 
  )} else {
    return (
      <div className='h-full w-full flex flex-col rounded-xl shadow-md bg-white'>
        <div className="h-[2.25rem] md:h-[3rem] w-full px-2 md:px-4 flex items-center justify-between border-b-2 border-solid border-gray-200">
            <h2 className='font-semibold text-xs md:text-base leading-tight'>Social Media</h2>
        </div>
        <div className='w-full px-4 md:px-6 grow flex flex-row space-x-[1.4rem] sm:space-x-[2.5rem] md:space-x-[3rem] lg:space-x-[1.2rem] items-center justify-center'>
          {socialLinks.length > 0 ? (
            socialLinks.map((sLink) => (
              <SocialIcon url={sLink.url} key={sLink.social_id} className="h-10 md:h-14 lg:h-16 w-10 md:w-14 lg:w-16 text-white" target="_blank" bgColor="white" fgColor="black" style={{ height: "100%", width: "100"}}/>
          ))
          ) : (
            <p className='font-light text-justify text-xs md:text-sm leading-none sm:leading-tight md:leading-tight lg:leading-tight'>The social media section is empty.</p>
          )}
        </div>
      </div>
    )
  }
}

export default SocialMedia