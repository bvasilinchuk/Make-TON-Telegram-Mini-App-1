// 'use client'

// import WebApp from '@twa-dev/sdk'
// import { useEffect, useState } from 'react'

// // Define the interface for user data
// interface UserData {
//   id: number;
//   first_name: string;
//   last_name?: string;
//   username?: string;
//   language_code: string;
//   is_premium?: boolean;
// }

// export default function Home() {
//   const [userData, setUserData] = useState<UserData | null>(null)

//   useEffect(() => {
//     if (WebApp.initDataUnsafe.user) {
//       setUserData(WebApp.initDataUnsafe.user as UserData)
//     }
//   }, [])

//   return (
//     <main className="p-4">
//       {userData ? (
//         <>
//           <h1 className="text-2xl font-bold mb-4">User Data</h1>
//           <ul>
//             <li>ID: {userData.id}</li>
//             <li>First Name: {userData.first_name}</li>
//             <li>Last Name: {userData.last_name || 'N/A'}</li>
//             <li>Username: {userData.username || 'N/A'}</li>
//             <li>Language Code: {userData.language_code}</li>
//             <li>Is Premium: {userData.is_premium ? 'Yes' : 'No'}</li>
//           </ul>
//         </>
//       ) : (
//         <div>Loading...</div>
//       )}
//     </main>
//   )
// }

'use client'

import WebApp from '@twa-dev/sdk'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Arrow from '../public/icons/Arrow'
import bear from '../public/images/bear.png'
import coin from '../public/images/coin.png'
import highVoltage from '../public/images/highVoltage.png'
import notcoin from '../public/images/notcoin.png'
import rocket from '../public/images/rocket.png'
import trophy from '../public/images/trophy.png'
import './styles.css'

// Define the interface for user data
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [points, setPoints] = useState(29857775);
  const [energy, setEnergy] = useState(2532);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 12;
  const energyToReduce = 12;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 0) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints(points + pointsToAdd);
    setEnergy(energy - energyToReduce < 0 ? 0 : energy - energyToReduce);
    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 6500));
    }, 100); // Restore 10 energy points every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData)
    }
  }, [])

  return (
    <main className="main">
      <div className="fixed-top">
        <div className="cursor-pointer bg-[#1f1f1f] text-center py-2 rounded-xl">
          <p className="text-lg">Join squad <Arrow size={18} className="ml-0 mb-1 inline-block" /></p>
        </div>
        <div className="mt-12 text-5xl font-bold flex items-center justify-center">
          <Image src={coin} width={44} height={44} alt="Coin" />
          <span className="ml-2">{points.toLocaleString()}</span>
        </div>
        <div className="text-base mt-2 flex items-center justify-center">
          <Image src={trophy} width={24} height={24} alt="Trophy" />
          <span className="ml-1">Gold <Arrow size={18} className="ml-0 mb-1 inline-block" /></span>
        </div>
      </div>

      <div className="content" onClick={handleClick}>
        <div className="clickable-area">
          <Image src={notcoin} width={256} height={256} alt="Not Coin" />
          {clicks.map((click) => (
            <div
              key={click.id}
              className="float-animation"
              style={{ top: `${click.y - 42}px`, left: `${click.x - 28}px` }}
              onAnimationEnd={() => handleAnimationEnd(click.id)}
            >
              12
            </div>
          ))}
        </div>
      </div>

      <div className="fixed-bottom">
        <div className="w-full flex justify-between gap-2">
          <div className="w-1/3 flex items-center justify-start max-w-32">
            <div className="flex items-center justify-center">
              <Image src={highVoltage} width={44} height={44} alt="High Voltage" />
              <div className="ml-2 text-left">
                <span className="text-white text-2xl font-bold block">{energy}</span>
                <span className="text-white text-large opacity-75">/ 6500</span>
              </div>
            </div>
          </div>
          <div className="flex-grow flex items-center max-w-60 text-sm">
            <div className="w-full bg-[#fad258] py-4 rounded-2xl flex justify-around">
              <button className="flex flex-col items-center gap-1">
                <Image src={bear} width={24} height={24} alt="Bear" />
                <span>Frens</span>
              </button>
              <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
              <button className="flex flex-col items-center gap-1">
                <Image src={coin} width={24} height={24} alt="Coin" />
                <span>Earn</span>
              </button>
              <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
              <button className="flex flex-col items-center gap-1">
                <Image src={rocket} width={24} height={24} alt="Rocket" />
                <span>Boosts</span>
              </button>
            </div>
          </div>
        </div>
        <div className="energy-bar">
          <div className="energy-bar-inner" style={{ width: `${(energy / 6500) * 100}%` }}></div>
        </div>
      </div>

      <section className="p-4 bg-gradient-main flex flex-col items-center text-white font-medium w-full">
        {userData ? (
          <>
            <h1 className="text-2xl font-bold mb-4">User Data</h1>
            <ul>
              <li>ID: {userData.id}</li>
              <li>First Name: {userData.first_name}</li>
              <li>Last Name: {userData.last_name || 'N/A'}</li>
              <li>Username: {userData.username || 'N/A'}</li>
              <li>Language Code: {userData.language_code}</li>
              <li>Is Premium: {userData.is_premium ? 'Yes' : 'No'}</li>
            </ul>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </section>
    </main>
  )
}

