import React, { Fragment } from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import { client } from "../../axios-config";
import ShareModal from "../../components/modals/ShareModal";
import VenueCard from "../../components/VenueCard";

const Search = ({ venues }) => {
  const router = useRouter();
  const query = router.query.q;
  return (
    <>
      <div className="bg-neutral-content p-10 text-center">
        <div className="text-4xl font-semibold">
          Showing results for &quot;{query}&quot;
        </div>
        <div className="mx-auto mt-2 max-w-lg text-slate-500">
          <small>
            Not finding what you&apos;re looking for? Try searching for a city
            or a state or may be a exact keyword you remember.
          </small>
        </div>
      </div>
      <section className="custom-container px-8 py-3 sm:py-14 sm:px-12">
        {venues.length ? (
          <div className="mt-10 grid gap-10 sm:grid-cols-2 xl:gap-12 xmd:grid-cols-3">
            {venues.map((venue) => (
              <Fragment key={venue.uuid}>
                <VenueCard venue={venue} />
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            <div className="w-60">
              <Image
                src="/assets/images/no-results.png"
                alt="no results"
                width={500}
                height={500}
              />
            </div>
            <div className="ml-2 text-gray-500">Oops! No results found.</div>
          </div>
        )}
      </section>
      <div className="mb-20 sm:mb-0"></div>
      <ShareModal />
    </>
  );
};

export default Search;

export async function getServerSideProps({ query }) {
  const { data } = await client.get(`venues/search/?q=${query.q}`);
  return {
    props: { venues: data },
  };
}
