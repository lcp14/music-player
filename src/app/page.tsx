import { TopTracks, TopArtists } from "./components/TopTracks";
export default function Home() {
    return (
        <>
            <div className="flex align-middle justify-center">
                <TopTracks></TopTracks>
            </div>
            <div className="flex align-middle justify-center">
                <TopArtists></TopArtists>
            </div>
        </>
    );
}
