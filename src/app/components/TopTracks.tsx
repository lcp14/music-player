"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BaseH2 } from "./Typography";
import { cn } from "@/lib/utils";
import Loading from "../loading";

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
        <div className="flex flex-row gap-2 flex-wrap align-middle items-center justify-center transition-all my-6 shadow-inner border rounded-md p-2 h-[300px] max-h-[350px] overflow-y-hidden">
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

const CarouselCard = ({
    img,
    title,
    description,
}: {
    [key: string]: string;
}) => {
    return (
        <div className="flex flex-col flex-wrap max-w-[200px] sm:max-w-[150px] items-center self-start m-4 group hover:shadow-md p-2 rounded-sm">
            <div className="rounded-sm overflow-hidden flex-grow h-[200px] sm:h-[150px]">
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
                        buttonVariants({ variant: "link" }), "px-0 underline-offset-0"
                    )}
                >
                    {" "}
                    {title}{" "}
                </span>
                <br/>
                {description ? <p
                    className={cn(
                        "text-sm h-fit",
                        buttonVariants({ variant: "link" }), "px-0 underline-offset-0"
                    )}
                >
                    {description}
                </p> : null}
            </div>
        </div>
    );
};

export function CarouselTopTracks() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch("/api/spotify/user/top-items?type=tracks")
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
    if (loading) return <Loading/>;

    return (
        <CarouselWrapper
            title="Top Songs"
            description="Listen to your favourite songs"
            data={data.items}
        />
    );
}

export function CarouselTopArtists() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch("/api/spotify/user/top-items?type=artists")
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
    if (loading) return <Loading/>;

    return (
        <CarouselWrapper
            title="Top Artists"
            description="Listen to you favourite artist"
            data={data.items}
        />
    );
}

function CarouselWrapper({ title, description, data }) {
    return (
        <div className="m-2">
            <BaseH2> {title} </BaseH2>
            <p className="text-sm text-muted-foreground mt-6">
                {" "}
                {description}{" "}
            </p>
            <Carousel
                data={data}
                renderCard={(data, index) => (
                    <CarouselCard
                        key={index}
                        img={data.img}
                        title={data.title}
                        description={data.description}
                    >
                        {" "}
                    </CarouselCard>
                )}
            >
                {" "}
            </Carousel>
        </div>
    );
}
