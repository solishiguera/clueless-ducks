import { PieChart } from 'react-minimal-pie-chart';

function WizelineLevel({userId, viewingUserId, level}){
    const maxLevel = 5
    const dataMock = [
        { title: 'Completed', value: level, color: '#e93d44' },
        { title: 'Left', value: maxLevel-level, color: '#222529' },
    ];

    return (
        <div className='h-full w-5/12 flex flex-col rounded-xl shadow-md bg-white'>
            <div className="h-[2.25rem] md:h-[3rem] w-full px-2 md:px-4 flex items-center border-b-2 border-solid border-gray-200">
                <h2 className="font-semibold text-xs md:text-base leading-tight">Wizeline Level</h2>
            </div>
            <div className='w-full px-4 md:px-6 grow flex flex-col items-center justify-center'>
                {level ? (
                    <>
                        <div className='absolute flex flex-col'>
                            <h2 className='text-xs sm:text-sm font-semibold text-center'>Level</h2>
                            <h1 className='text-2xl sm:text-4xl font-semibold text-center'>{level}</h1>
                        </div>
                        
                        <PieChart
                            className='h-[8rem] md:h-[10rem]'
                            data={dataMock}
                            startAngle={270}
                            lineWidth={20}
                            segmentsStyle={{ transition: 'stroke .3s' }}
                            animate={true}
                        />
                    </>
                ) : (
                    <p className='text-center text-xs md:text-sm font-light leading-snug sm:leading-snug md:leading-snug lg:leading-snug'>
                        {userId == viewingUserId ? "You do not have a Wizeline level." : "User has not a Wizeline level."}
                    </p>
                )}
                
            </div>
        </div>
    )
}

export default WizelineLevel