import { getTimezoneOffset } from 'date-fns-tz'
import { useState } from 'react';

function Timer({timezone}) {
    const [time, setTime] = useState(setHour());

    function setHour() {

        const timeDate = new Date().getTime()
        const offSet = getTimezoneOffset(timezone)
        const date = new Date(timeDate + offSet)
        
        const hours = date.getUTCHours()
        let minutes = date.getUTCMinutes()
        let hoursStr
        let minutesStr
        
        if (hours < 10){
            hoursStr = "0" + hours.toString()
        } else {
            hoursStr = hours.toString()
        }

        if (minutes < 10){
            minutesStr = "0" + minutes.toString()
        } else {
            minutesStr = minutes.toString()
        }

        return date.toUTCString() + (offSet > 0 ? "+" + (offSet/3600000).toString() : (offSet/3600000).toString())
    }

    setInterval(myTimer, 1000);

    function myTimer() {
        setTime(setHour())
    }

    return (
        <p className="h-auto w-10/12 md:w-11/12 lg:w-10/12 leading-none sm:leading-tight md:leading-tight lg:leading-tight text-xs sm:text-sm md:text-base">{time}</p>
    )
}

export default Timer