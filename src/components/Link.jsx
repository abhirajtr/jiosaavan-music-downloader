import axios from "axios"
import { useRef, useState } from "react"
import { saveAs } from "file-saver";

const Link = () => {

    const [link, setLink] = useState("");
    const [songData, setSongData] = useState(null);
    const inputRef = useRef();
    const [isLoading, setIsLoading] = useState(false);


    const fetchSongData = async () => {
        const response = await axios.get(`https://saavn.dev/api/songs?link=${link}`);
        setSongData(response.data.data[0])
        setLink("");
    }

    const downloadSong = async (url) => {
        try {
            setIsLoading(true);
            const response = await axios.get(url, { responseType: 'blob' });
            saveAs(response.data, songData.name);
            setIsLoading(false);
            inputRef.current.focus();
        } catch (error) {
            console.error("Error downloading song:", error);
        }
    };
    const enterToSearch = (e) => {
        if(e.code === "Enter") {
            fetchSongData();
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-2">
            <div className="flex flex-col space-y-8 pb-4 pt-4 md:pt-10">
                <p className="text-3xl font-bold text-gray-900 md:text-5xl md:leading-10">
                    Jiosaavan Downloader
                </p>
                <p className="max-w-4xl text-base text-gray-600 md:text-xl">
                    Paste the song link
                </p>
                <div className="flex w-full items-center space-x-2 md:w-1/3">
                    <input
                        ref={inputRef}
                        className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        placeholder="Search song with link"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        onKeyDown={e => enterToSearch(e)}
                    ></input>
                    <button
                        onClick={fetchSongData}
                        type="button"
                        className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        Search
                    </button>
                </div>
            </div>
            <div className="h-1">
                {isLoading && 
                    <div className="font-semibold text-red-500">
                        waiiting for response...
                    </div>
                }
            </div>
            <div className="grid gap-4 gap-y-4 py-6 md:grid-cols-2 lg:grid-cols-5">
                {songData &&


                    songData.downloadUrl.map((song, index) => (
                        <div key={index} className="border">
                            <img src={songData.image[2].url} className="aspect-square w-50 rounded-md" alt="" />
                            <div className="min-h-min p-3">
                                <p className="mt-2 w-full text-xs font-semibold leading-tight text-gray-700">
                                    #{songData.language}
                                </p>
                                <p className="mt-2 flex-1 text-base font-semibold text-gray-900">{songData.name}</p>
                                <p className="mt-2 w-full text-sm leading-normal text-gray-600">
                                    {song.quality}
                                </p>
                                <div className="mt-2 flex space-x-3 ">
                                    {/* {console.log(song.url)} */}
                                    <button className="rounded-md bg-black text-white p-1"
                                        onClick={() => downloadSong(song.url)}
                                    >Download</button>
                                </div>
                            </div>
                        </div>
                    ))

                }
            </div>
        </div>
    )
}

export default Link