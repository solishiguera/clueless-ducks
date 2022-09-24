import { PencilIcon } from "@heroicons/react/outline";
import {FaMapMarkerAlt, FaClock} from "react-icons/fa";
import { Country, State, City } from 'country-state-city';
import { useState } from 'react';
import Select from 'react-select';
import { updateLocation } from "../../lib/fetching/dashboard";
import tzlookup from 'tz-lookup'
import dynamic from 'next/dynamic'

function Location({userId, viewingUserId, timezone, location, latitude, longitude, onRefresh}){

    const TimerWithNoSSR = dynamic(
        () => import('./Timer'),
        { ssr: false }
    )

    if (userId === viewingUserId) {

        const [showModal, setShowModal] = useState(false);
        const [newCountry, setNewCountry] = useState(null);
        const [newState, setNewState] = useState(null);
        const [newCity, setNewCity] = useState(null);
        
        const handleOnSubmit = async (e) => {
            e.preventDefault()
            setShowModal(false)

            let strLocation, strLatitude, strLongitude, strTimezone
            
            if (newCountry && newState && newCity) {
                strLocation = newCity.label + ", " + newState.label + ", " + newCountry.label
                strLatitude = newCity.value.latitude
                strLongitude = newCity.value.longitude
            } else if (newCountry && newState) {
                strLocation = newState.label + ", " + newCountry.label
                strLatitude = newState.value.latitude
                strLongitude = newState.value.longitude
            } else {
                strLocation = newCountry.label
                strLatitude = newCountry.value.latitude
                strLongitude = newCountry.value.longitude
            }

            strTimezone = tzlookup(parseFloat(strLatitude), parseFloat(strLongitude))

            const res = await updateLocation({user_id: userId, time_zone: strTimezone, location: strLocation, latitude: strLatitude, longitude: strLongitude})

            if (res.ok) {
                onRefresh()
            }
        }

        const handleOnClose = (e) => {
            setShowModal(false)
        }

        const allCountries = Country.getAllCountries().map((country) => ({
            label: country.name,
            value: {
                isoCode: country.isoCode,
                latitude: country.latitude,
                longitude: country.longitude
            }
        }))

        const allStates = (newCountry) => {
            if (newCountry) {
                const states = State.getStatesOfCountry(newCountry.value.isoCode)
                return (
                    states.map((state) => ({
                        label: state.name,
                        value: {
                            isoCode: state.isoCode,
                            latitude: state.latitude,
                            longitude: state.longitude
                        }
                    }))
                )
            }
        }
        
        const allCities = (newCountry, newState) => {
            if (newCountry && newState) {
                const cities = City.getCitiesOfState(newCountry.value.isoCode, newState.value.isoCode)
                return (
                    cities.map((city) => ({
                        label: city.name,
                        value: {
                            isoCode: city.isoCode,
                            latitude: city.latitude,
                            longitude: city.longitude
                        }
                    }))
                )
            }
        }

        return (
            <>
                <div className='h-[12rem] md:h-[15rem] lg:h-[18rem] w-full flex flex-col rounded-xl bg-white shadow-md'>
                    <div className="h-[2.25rem] md:h-[3rem] w-full px-2 md:px-4 flex items-center justify-between border-b-2 border-solid border-gray-200">
                            <h2 className="font-semibold text-xs md:text-base leading-tight">Location</h2>
                            <button className='w-4 md:w-6 h-4 md:h-6 p-[0.15rem] md:p-[0.2rem] text-black rounded-md hover:bg-gray-200' onClick={() => setShowModal(true)} data-bs-target='#modalRedes'>
                                <PencilIcon/>
                            </button>
                    </div>
                    <div className="w-full px-4 md:px-6 grow flex flex-row items-center justify-center">
                        {location ? (
                            <>
                                <div className="h-auto w-1/2 sm:w-5/12 lg:w-1/2 mr-2 md:mr-3 flex items-center rounded-lg shadow-md">
                                    <img className="rounded-lg" src={"https://maps.geoapify.com/v1/staticmap?style=osm-liberty&width=1000&height=600&center=lonlat:"+longitude+","+latitude+"&zoom=11&apiKey=facd74e15656477d9d0c024f869c3814"} alt="Location picture"/>
                                </div>
                                <div className="h-auto w-1/2 sm:w-5/12 lg:w-1/2 flex flex-col">
                                    <div className="h-auto w-full p-2 flex flex-row items-center rounded-full bg-gray-100 shadow-md mb-2 md:mb-3">
                                        <FaMapMarkerAlt className='h-auto w-2/12 md:w-1/12 lg:w-2/12 p-1 mx-2 text-wizeline-red'/>
                                        <p className="h-auto w-10/12 md:w-11/12 lg:w-10/12 leading-none sm:leading-tight md:leading-tight lg:leading-tight text-xs sm:text-sm md:text-base">{location}</p>
                                    </div>
                                    <div className="h-auto w-full p-2 flex flex-row items-center rounded-full bg-gray-100 shadow-md">
                                        <FaClock className='h-auto w-2/12 md:w-1/12 lg:w-2/12 p-1 mx-2 text-wizeline-red'/>
                                        <TimerWithNoSSR timezone={timezone}/>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="font-light text-justify text-xs md:text-sm leading-none sm:leading-tight md:leading-tight lg:leading-tight">Your location is empty! Click on pencil icon to edit.</p>
                        )}
                    </div>
                </div>

                {showModal ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-center p-3 lg:p-4 border-b-2 border-solid border-gray-200 rounded-t">
                                    <h3 className="text-base md:text-lg lg:text-xl text-black font-semibold">
                                        Location 
                                    </h3>
                                </div>
                                {/*body*/}
                                <form onSubmit={handleOnSubmit}>
                                    <div className='grid grid-row w-[20rem] md:w-[26rem] p-4 lg:p-6 items-center my-4 text-black-200 text-lg leading-relaxed space-y-4'>
                                    
                                        <label className='flex row-auto items-center'>
                                            <strong className='mr-4'>Country</strong>
                                            <Select
                                                className='pl-2 font-light w-full'
                                                id="country"
                                                options={allCountries}
                                                value={newCountry}
                                                onChange={(e) => {setNewCountry(e), setNewState(null), setNewCity(null)}}
                                            />
                                        </label>
                                        <label className='flex row-auto items-center'>
                                            <strong className='mr-4'>State</strong>
                                            <Select
                                                className='pl-2 font-light w-full'
                                                id="state"
                                                options={allStates(newCountry)}
                                                value={newState}
                                                onChange={(e) => {setNewState(e), setNewCity(null)}}
                                            />
                                        </label>
                                        <label className='flex row-auto items-center'>
                                            <strong className='mr-4'>City</strong>
                                            <Select
                                                className='pl-2 font-light w-full'
                                                id="country"
                                                options={allCities(newCountry, newState)}
                                                value={newCity}
                                                onChange={(e) => {setNewCity(e)}}
                                            />                        
                                        </label>
                                    </div>

                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-4 lg:p-6 border-t-2 border-solid border-gray-200 rounded-b">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 outline-none focus:outline-none mr-2 lg:mr-3 ease-linear transition-all duration-150 px-5 py-2 disabled:opacity-30 rounded-md text-white font-bold text-sm lg:text-base">
                                            Save
                                        </button>
                                        <button
                                            className="bg-wizeline-red hover:bg-red-600 outline-none focus:outline-none ease-linear transition-all duration-150 px-5 py-2 disabled:opacity-30 rounded-md text-white font-bold text-sm lg:text-base"
                                            onClick={handleOnClose}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
            </>
        )
    } else {
        return (
            <div className='h-[12rem] md:h-[15rem] lg:h-[18rem] w-full flex flex-col rounded-xl bg-white shadow-md'>
                <div className="h-[2.25rem] md:h-[3rem] w-full px-2 md:px-4 flex items-center justify-between border-b-2 border-solid border-gray-200">
                        <h2 className="font-semibold text-xs md:text-base leading-tight">Location</h2>
                </div>
                <div className="w-full px-4 md:px-6 grow flex flex-row items-center justify-center">
                    {location ? (
                        <>
                            <div className="h-auto w-1/2 sm:w-5/12 lg:w-1/2 mr-2 md:mr-3 flex items-center rounded-lg shadow-md">
                                <img className="rounded-lg" src={"https://maps.geoapify.com/v1/staticmap?style=osm-liberty&width=1000&height=600&center=lonlat:"+longitude+","+latitude+"&zoom=11&apiKey=facd74e15656477d9d0c024f869c3814"} alt="Location picture"/>
                            </div>
                            <div className="h-auto w-1/2 sm:w-5/12 lg:w-1/2 flex flex-col">
                                <div className="h-auto w-full p-2 flex flex-row items-center rounded-full bg-gray-100 shadow-md mb-2 md:mb-3">
                                    <FaMapMarkerAlt className='h-auto w-2/12 md:w-1/12 lg:w-2/12 p-1 mx-2 text-wizeline-red'/>
                                    <p className="h-auto w-10/12 md:w-11/12 lg:w-10/12 leading-none sm:leading-tight md:leading-tight lg:leading-tight text-xs sm:text-sm md:text-base">{location}</p>
                                </div>
                                <div className="h-auto w-full p-2 flex flex-row items-center rounded-full bg-gray-100 shadow-md">
                                    <FaClock className='h-auto w-2/12 md:w-1/12 lg:w-2/12 p-1 mx-2 text-wizeline-red'/>
                                    <TimerWithNoSSR timezone={timezone}/>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="font-light text-justify text-xs md:text-sm leading-none sm:leading-tight md:leading-tight lg:leading-tight">The location is empty.</p>
                    )}
                </div>
            </div>
        )
    }
}

export default Location