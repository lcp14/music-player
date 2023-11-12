"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BaseH2 } from "./Typography";

function Carousel({ data, renderCard }: { data: any; renderCard: any }) {
    const [current, setCurrent] = useState(0);
    const slideSize = 5;
    const nextSlide = () => {
        setCurrent(current === data.length - slideSize ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? data.length - slideSize : current - 1);
    };

    return (
        <div className="flex flex-row gap-2 flex-wrap align-middle items-center transition-all my-6 drop-shadow-md rounded-md">
            <Button variant="ghost" onClick={prevSlide}>
                {" "}
                <ChevronLeftIcon />{" "}
            </Button>
            {data
                .slice(current, current + slideSize)
                .map((item, index) => renderCard(item, index + current))}
            <Button variant="ghost" onClick={nextSlide}>
                {" "}
                <ChevronRightIcon />{" "}
            </Button>
        </div>
    );
}

const TrackCard = ({ img, title, description }: { [key:string]:string }) => {
    return (
        <div className="flex flex-col flex-wrap max-w-[150px] items-center self-start m-2">
            <div className="rounded-sm overflow-hidden flex-grow h-[150px]">
                <Image
                    src={img}
                    width={300}
                    height={300}
                    alt="Album cover"
                ></Image>
            </div>
            <div className="p-2">
                {title}
                <br/>
                {description}
            </div>
        </div>
    );
};

export function TopArtists() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/spotify/top-artists")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error fetching top tracks");
                }
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (loading) return <div>Loading...</div>;
    return (
        <div className="m-2">
            <BaseH2> Top Artists </BaseH2>
            <p className="text-sm text-muted-foreground mt-6"> Listen to you favourite artist </p>
            <Carousel
                data={data.artists}
                renderCard={(artist, index) => (
                    <TrackCard key={index} img={artist.coverImage} title={artist.name} description="" >
                        {" "}
                    </TrackCard>
                )}
            >
                {" "}
            </Carousel>
        </div>
    );
}

export function TopTracks() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/spotify/top-tracks")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error fetching top tracks");
                }
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (loading) return <div>Loading...</div>;
    return (
        <div className="m-2">
            <BaseH2>Top Tracks</BaseH2>
            <p className="text-sm text-muted-foreground mt-6"> Listen to you favourite songs </p>

            <Carousel
                data={data.tracks}
                renderCard={(track, index) => (
                    <TrackCard key={index} img={track.coverImage} title={track.artist} description={track.title}>
                        {" "}
                    </TrackCard>
                )}
            >
                {" "}
            </Carousel>
        </div>
    );
}
