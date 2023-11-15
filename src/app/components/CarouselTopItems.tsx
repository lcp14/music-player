"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, ReactNode } from "react";
import { BaseH2 } from "./Typography";
import { cn } from "@/lib/utils";
import Loading from "../loading";
import { ItemResponseType, getPlaybackState } from "../api/lib/spotify";
import { useSession } from "next-auth/react";
import { isPlaybackStateActive, playerTransferPlayback } from "./Player";
import { usePlayer } from "../context/SpotifyProvider";

function Carousel({
    data,
    renderCard,
}: {
    data: Array<CarouselCardType>;
    renderCard: any;
    children?: ReactNode;
}) {
    const [current, setCurrent] = useState(0);
    const slideSize = 5;
    const nextSlide = () => {
        setCurrent(current === data.length - slideSize ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? data.length - slideSize : current - 1);
    };

    return (
        <div className="flex flex-row gap-2 flex-wrap align-middle items-center content-center transition-all my-6 shadow-inner border rounded-md p-2 h-[300px] max-h-[350px] overflow-y-hidden">
            <Button variant="ghost" onClick={prevSlide}>
                <ChevronLeftIcon />
            </Button>
            <div className="flex flex-row flex-grow gap-2 flex-wrap align-middle justify-center items-center content-center transition-all">
                {data.length !== 0 ?
                data
                    .slice(current, current + slideSize)
                    .map((item: CarouselCardType, index: number) =>
                        renderCard(item, index + current)
                    )
                    :
                    <Loading></Loading>
                }
            </div>
            <Button variant="ghost" onClick={nextSlide}>
                <ChevronRightIcon />
            </Button>
        </div>
    );
}

type CarouselCardProps = {
    img: string;
    title: string;
    description: string;
    data: any;
    children?: ReactNode;
};
const CarouselCard = ({ img, title, description, data }: CarouselCardProps) => {
    const { data: session } = useSession();
    const { currentDevice } = usePlayer();

    if (!session) {
        return <Loading></Loading>;
    }

    const accessToken = session?.accessToken;
    return (
        <div
            onClick={() => handleCardItem({accessToken, currentDevice}, data)}
            className="flex flex-col flex-wrap max-w-[250px] sm:max-w-[150px] items-center self-start m-4 group hover:shadow-sm hover:outline-1 hover:outline p-2 rounded-sm"
        >
            <div className="rounded-sm overflow-hidden flex-grow h-[250px] sm:h-[150px]">
                <Image
                    src={img}
                    width={300}
                    height={300}
                    alt="Album cover"
                    className="group-hover:scale-105 transition"
                ></Image>
            </div>
            <div className="overflow-clip max-w-[inherit] self-start my-2">
                <span
                    className={cn(
                        "text-base",
                        buttonVariants({ variant: "link" }),
                        "px-0 underline-offset-0"
                    )}
                >
                    {" "}
                    {title}{" "}
                </span>
                <br />
                {description ? (
                    <p
                        className={cn(
                            "text-sm h-fit",
                            buttonVariants({ variant: "link" }),
                            "px-0 underline-offset-0"
                        )}
                    >
                        {description}
                    </p>
                ) : null}
            </div>
        </div>
    );
};

let timeoutId: NodeJS.Timeout | null = null;

function handleCardItem({ accessToken, currentDevice }: { [key:string]: string }, item: CarouselCardType) {
    console.log(currentDevice)
    const playCard = fetch(`/api/spotify/player?device_id=${currentDevice}`, {
        method: "PUT",
        body: JSON.stringify({ context_uri: item.uri, position_ms: 0 }),
    });
    isPlaybackStateActive(accessToken).then(async (state) => {
        if (state) {
            await playCard;
            return;
        }
        await playerTransferPlayback(accessToken, currentDevice);
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
            await playCard;
        }, 1000)
    })

}

type CarouselCardType = {
    img: string;
    title: string;
    description: string;
    uri: string;
};

type CarouselWrapperProps = {
    title: string;
    description: string;
    type: ItemResponseType;
};
function CarouselWrapper({ title, description, type }: CarouselWrapperProps) {
    const [data, setData] = useState<{ items: CarouselCardType[] }>({
        items: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const url = `/api/spotify/user/top-items?type=${type}`;

        fetch(url)
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
    }, [type]);

    if (error) console.error("Error: ", error);
    if (loading) return <Loading />;
    return (
        <div className="m-2 w-full">
            <BaseH2> {title} </BaseH2>
            <p className="text-sm text-muted-foreground mt-6">
                {" "}
                {description}{" "}
            </p>
                <Carousel
                    data={data.items}
                    renderCard={(
                        item: {
                            img: string;
                            title: string;
                            description: string;
                        },
                        index: number
                    ) => (
                        <CarouselCard
                            key={index}
                            data={item}
                            img={item.img}
                            title={item.title}
                            description={item.description}
                        >
                            {" "}
                        </CarouselCard>
                    )}
                ></Carousel>
        </div>
    );
}

export function CarouselTopTracks() {
    return (
        <CarouselWrapper
            title="Top Songs"
            description="Listen to your favourite songs"
            type={ItemResponseType.Tracks}
        />
    );
}

export function CarouselTopArtists() {
    return (
        <CarouselWrapper
            title="Top Artists"
            description="Listen to you favourite artist"
            type={ItemResponseType.Artists}
        />
    );
}
