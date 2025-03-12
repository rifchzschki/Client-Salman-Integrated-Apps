import Link from 'next/link';

export default function Login() {
  return (
    <main className="w-screen h-screen bg-cream flex items-center justify-center overflow-hidden">
        <div className="relative w-[75vw] h-[80vh] bg-bonewhite rounded-4xl flex items-center justify-end overflow-hidden">
            <img src="/masjid-salman-itb.jpg" alt="" className="absolute min-w-[100%] min-h-[100%] object-cover z-0"/>
            <div className="absolute w-[35%] h-[95%] flex flex-col gap-5 items-center justify-center bg-bonewhite z-10 m-4 rounded-3xl">
                <img src="/logo-salman.svg" className="absolute top-5 left-5 w-17 h-17"/>
                <div>
                    <h1 className="text-3xl text-black mt-17">Sign up</h1>
                </div>
                <form action="" className="flex flex-col gap-5 items-center justify-center w-[70%] mt-3">
                    <div className="w-[100%] h-12 border-3 border-d-brown rounded-lg flex items-center pl-2">
                        {/* <img src="/profile.svg" className="w-[10%] h-[80%]"/> */}
                        <input 
                            type="text" 
                            placeholder="Email Address" 
                            className="w-full h-full bg-transparent outline-none ml-2 placeholder-d-brown font-medium"
                        />
                    </div>
                    <div className="w-[100%] h-12 border-3 border-d-brown rounded-lg flex items-center pl-2">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="w-full h-full bg-transparent outline-none ml-2 placeholder-d-brown font-medium" 
                        />
                    </div>
                    <div className="w-[100%] h-12 border-3 border-d-brown rounded-lg flex items-center pl-2">
                        <input 
                            type="password" 
                            placeholder="Confirm Password" 
                            className="w-full h-full bg-transparent outline-none ml-2 placeholder-d-brown font-medium" 
                        />
                    </div>
                    <button type="submit" className="w-full h-12 bg-l-brown font-medium text-bonewhite rounded-lg mt-4 cursor-pointer hover:bg-l2-brown">Submit</button>
                </form>
                <p className="text-black">Already have an account? <a href="/login" className="text-d-brown">Sign in</a></p>
            </div>
        </div>
    </main>
  );
}