import { Separator } from "@/components/ui/separator";
import { CarouselTopArtists, CarouselTopTracks } from "./components/TopTracks";
export default function Home() {
    return (
        <>
            <Separator />
            <div className="flex align-middle justify-center">
                <CarouselTopTracks/>
            </div>
            <div className="flex align-middle justify-center">
                <CarouselTopArtists/>
            </div>
        </>
    );
}
