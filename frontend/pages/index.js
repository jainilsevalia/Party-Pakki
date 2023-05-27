import React, { Fragment, useEffect, useState } from "react";

import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";

import { client } from "../axios-config";
import ShareModal from "../components/modals/ShareModal";
import VenueCard from "../components/VenueCard";
import styles from "../styles/Home.module.css";
import { getLocationFromCoords } from "../utils";

const Home = ({ venues }) => {
  const [searchString, setSearchString] = useState("");
  const router = useRouter();

  const [nearByVenues, setNearByVenues] = useState([]);
  const [noOfVenues, setNoOfVenues] = useState(6);

  const user = useSelector((state) => state.auth.user);

  const setNearByVenuesFn = (city, state) => {
    const nearByVenues = venues
      ?.filter(
        (venue) =>
          city.toLowerCase().includes(venue.location.city.toLowerCase()) ||
          state.toLowerCase() === venue.location.state.toLowerCase()
      )
      .slice(0, 6);
    setNearByVenues(nearByVenues);
  };

  useEffect(() => {
    if (user?.city && user?.state) {
      const { city, state } = user;
      setNearByVenuesFn(city, state);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const location = await getLocationFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          setNearByVenuesFn(location?.city, location?.state);
        });
      }
    }
  }, []);

  return (
    <>
      <NextSeo title="Home • Partypakki" />
      <main>
        <section className="relative">
          <h1
            className={`absolute text-2xl font-bold text-white sm:text-3xl lg:text-4xl ${styles["center-item"]} z-10`}
            style={{ maxWidth: "800px" }}
          >
            Check out the best suited Venues for your event. Request a quote
            from us.
            <div className="form-control relative mt-5">
              <input
                type="text"
                placeholder="Search hotels, banquet halls, resorts, etc."
                className="input input-bordered text-black"
                onChange={(e) => setSearchString(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    router.push(`/search?q=${searchString}`);
                  }
                }}
              />
              <div className="absolute right-3 top-3.5 bg-white">
                <FiSearch size={20} color={"grey"} />
              </div>
            </div>
          </h1>
          <div className={`bg-black ${styles["banner-container"]}`}>
            <Image
              src="/assets/images/banner-img.png"
              alt="banner"
              layout="fill"
              className={styles.banner}
            />
          </div>
        </section>
        <section className="custom-container px-8 py-14 sm:px-12">
          {nearByVenues.length > 0 && (
            <>
              <span className="text-xl font-semibold uppercase sm:text-2xl">
                Best venues near you
              </span>
              <div className="mt-10 mb-20 grid gap-10 sm:grid-cols-2 xl:gap-12 xmd:grid-cols-3">
                {nearByVenues.map((venue) => (
                  <Fragment key={venue.uuid}>
                    <VenueCard venue={venue} />
                  </Fragment>
                ))}
              </div>
            </>
          )}
          <span className="text-xl font-semibold uppercase sm:text-2xl">
            All venues
          </span>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 xl:gap-12 xmd:grid-cols-3">
            {venues.slice(0, noOfVenues).map((venue) => (
              <Fragment key={venue.uuid}>
                <VenueCard venue={venue} />
              </Fragment>
            ))}
          </div>
          {venues.length > noOfVenues && (
            <div className="mt-5 flex justify-center">
              <button
                className="btn btn-ghost"
                onClick={() => setNoOfVenues((number) => number * 2)}
              >
                Load more
              </button>
            </div>
          )}
        </section>
        <div className="mb-10 sm:mb-0"></div>
      </main>
      <ShareModal />
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const { data, status } = await client.get("venues/");
  if (status === 200) {
    delete data.description;
    return {
      props: { venues: data },
    };
  } else {
    return {
      props: { venues: [] },
    };
  }
}
