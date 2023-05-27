import React, { Fragment, useEffect } from "react";

import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { FaHeartBroken } from "react-icons/fa";
import { useSelector } from "react-redux";

import { hasToken } from "../../actions/auth";
import VenueCard from "../../components/VenueCard";

const Wishlist = () => {
  const router = useRouter();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const venues = user?.wishlist;

  useEffect(() => {
    if (!hasToken() && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <NextSeo title="Saved venues • Partypakki" />
      <main>
        <div className="custom-container p-5 sm:p-10">
          <h1 className="text-3xl font-semibold md:text-4xl">Saved Venues</h1>
          <div className="mt-2 text-sm">
            Venues you have look for and find it interesting.
          </div>
          {venues?.length ? (
            <div className="mt-10 grid gap-10 sm:grid-cols-2 xl:gap-12 xmd:grid-cols-3">
              {venues.map((venue) => (
                <Fragment key={venue.uuid}>
                  <VenueCard venue={venue} />
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex h-96 flex-col items-center justify-center border-2 border-dashed">
              <FaHeartBroken size={120} color="red" />
              No saved venues
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Wishlist;
