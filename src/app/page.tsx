import { CarouselTopArtists, CarouselTopTracks } from "./components/CarouselTopItems";
export default function Home() {
    return (
        <div className="px-4">
            <div className="flex align-middle justify-center">
                <CarouselTopTracks/>
            </div>
            <div className="flex align-middle justify-center">
                <CarouselTopArtists/>
            </div>
        </div>
    );
}
