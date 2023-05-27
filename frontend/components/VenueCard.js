import React, { useState, useCallback } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import Carousel from "react-grid-carousel";
import toast from "react-hot-toast";
import { BiRupee } from "react-icons/bi";
import {
  BsFillStarFill,
  BsShare,
  BsHeart,
  BsHeartFill,
  BsArrowsAngleExpand,
} from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";

import { removeVenueFromWishlist, saveVenueToWishlist } from "../actions/auth";
import { setShareModal } from "../actions/other";
import { path } from "../config";

const VenueCard = ({ venue }) => {
  const [isHover, setIsHover] = useState(false);
  const handleHover = useCallback(() => {
    setIsHover((state) => !state);
  }, []);

  const router = useRouter();

  const user = useSelector((state) => state.auth.user);

  const isSaved = user?.wishlist.find(
    (savedVenue) => savedVenue.uuid === venue.uuid
  );

  const dispatch = useDispatch();

  const saveVenue = async () => {
    if (user) {
      const res = await dispatch(saveVenueToWishlist(venue.uuid));
      if (res.status === 201) {
        toast.success(res.success);
      } else {
        toast.error(res.error);
      }
    } else {
      toast("Please login to save this venue", { icon: "⚠️" });
    }
  };

  const removeVenue = async () => {
    if (user) {
      const res = await dispatch(removeVenueFromWishlist(venue.uuid));
      if (res.status === 200) {
        toast.success(res.success);
      } else {
        toast.error(res.error);
      }
    } else {
      toast("Please login to save this venue", { icon: "⚠️" });
    }
  };

  const openShareModal = () => {
    dispatch(setShareModal({ isOpen: true, venue }));
  };

  return (
    <figure className="card card-compact bg-base-100 shadow-xl">
      <div onMouseEnter={handleHover} onMouseLeave={handleHover}>
        <Carousel gap={10} hideArrow={!isHover} showDots>
          {venue.photos.slice(0, 5).map((photo) => (
            <Carousel.Item key={photo.uuid}>
              <Image
                src={path(photo.image)}
                width={400}
                height={280}
                className="object-cover"
                alt={venue.name}
                onClick={() => router.push(`/venue/${venue.uuid}`)}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <div className="card-body mt-2">
        <figcaption className="flex justify-between">
          <h2 className="truncate text-lg font-bold" style={{ width: "70%" }}>
            {venue.name}
          </h2>
          <div className="mt-1 flex gap-2">
            <BsFillStarFill className="inline" size={21} color="#fbc02d" />
            <span className="text-base">
              {venue.rating}({venue.reviews.length})
            </span>
          </div>
        </figcaption>
        <div className="mt-2">
          <div>
            <GrLocation className="mr-2 mb-1 inline-block" size={20} />
            {venue.location.city}, {venue.location.state}
          </div>
          {venue.rent ? (
            <div className="mt-1">
              <BiRupee className="mr-2 mb-1 inline-block" size={22} />
              <span style={{ marginLeft: -3 }}>
                {venue.rent} for {venue.rent_by} (Approx.)
              </span>
            </div>
          ) : (
            <div className="h-8"></div>
          )}
        </div>
        <div>
          <hr className="my-1" />
          <div className="flex justify-around">
            <button className="btn btn-ghost" onClick={openShareModal}>
              <BsShare size={20} />
            </button>
            {isSaved ? (
              <button className="btn btn-ghost" onClick={removeVenue}>
                <BsHeartFill size={20} color="red" />
              </button>
            ) : (
              <button className="btn btn-ghost" onClick={saveVenue}>
                <BsHeart size={20} />
              </button>
            )}
            <button
              className="btn btn-ghost"
              onClick={() => router.push(`/venue/${venue.uuid}`)}
            >
              <BsArrowsAngleExpand size={18} />
            </button>
          </div>
        </div>
      </div>
    </figure>
  );
};

export default VenueCard;
