/* eslint-disable jsx-a11y/alt-text */
import dayjs from "dayjs";
import parse from "html-react-parser";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import Carousel from "react-grid-carousel";
import toast from "react-hot-toast";
import {
  BsFillStarFill,
  BsHeart,
  BsShare,
  BsGrid1X2,
  BsHeartFill,
} from "react-icons/bs";
import Masonry from "react-masonry-css";
import { useDispatch, useSelector } from "react-redux";
import MediaQuery from "react-responsive";
import { SRLWrapper } from "simple-react-lightbox";

import {
  removeVenueFromWishlist,
  saveVenueToWishlist,
} from "../../actions/auth";
import {
  setLoginModal,
  setReqBookingModal,
  setShareModal,
} from "../../actions/other";
import { client } from "../../axios-config";
import RequestBookingAction from "../../components/mobile-footer-actions/RequestBookingAction";
import ReqBookingModal from "../../components/modals/ReqBookingModal";
import ShareModal from "../../components/modals/ShareModal";
import { URL, path } from "../../config";
import styles from "../../styles/Venue.module.css";

const Venue = ({ venue }) => {
  const router = useRouter();

  const venueId = router.query.id;

  const photos = venue.photos.map((photo) => {
    return (
      <div className="p-1 md:p-2" key={photo.uuid}>
        <Image
          src={path(photo.image)}
          className="cursor-pointer object-cover"
          width={700}
          height={450}
        />
      </div>
    );
  });

  const user = useSelector((state) => state.auth.user);
  const isSaved = user?.wishlist.find(
    (savedVenue) => savedVenue.uuid === venue.uuid
  );

  const dispatch = useDispatch();

  const saveVenue = async () => {
    if (user) {
      const res = await dispatch(saveVenueToWishlist(venueId));
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
      const res = await dispatch(removeVenueFromWishlist(venueId));
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

  const SaveAndShare = ({ className, btnClassName = "btn-ghost" }) => (
    <div className={`flex gap-2 ${className}`}>
      <button className={`btn ${btnClassName}`} onClick={openShareModal}>
        <BsShare className="mr-2 inline" size={20} />
        <span>Share</span>
      </button>
      {isSaved ? (
        <button className={`btn ${btnClassName}`} onClick={removeVenue}>
          <BsHeartFill className="mr-2 inline" size={20} color="red" />
          <span>Saved</span>
        </button>
      ) : (
        <button className={`btn ${btnClassName}`} onClick={saveVenue}>
          <BsHeart className="mr-2 inline" size={20} />
          <span>Save</span>
        </button>
      )}
    </div>
  );

  const openReqBookingModal = () => {
    if (user) {
      dispatch(setReqBookingModal(true));
    } else {
      dispatch(setLoginModal(true));
    }
  };

  const description = venue.description
    .substring(0, 150)
    .replace(/<\/?[^>]+(>|$)/g, "");

  const renderFoodType = () => {
    if (venue?.restaurant) {
      let src = "";
      const food_type = venue.restaurant.food_type;
      switch (food_type) {
        case "Veg":
          src = "/assets/images/veg-icon.svg";
          break;
        case "Non-veg":
          src = "/assets/images/non-veg-icon.svg";
          break;
        case "Both":
          src = "/assets/images/veg-nonveg-icon.png";
          break;
        default:
          break;
      }
      return (
        <div className="flex items-center">
          <div className="mr-1 w-8 pt-1 leading-none sm:w-5 sm:leading-6">
            <Image src={src} width={120} height={120} />
          </div>
          <span className="hidden text-sm text-gray-500 sm:inline">
            {food_type !== "Both" ? food_type + " Only" : "Veg & Non-veg"}
          </span>
        </div>
      );
    } else {
      return null;
    }
  };

  const srloptions = {
    buttons: {
      showDownloadButton: false,
    },
    thumbnails: {
      showThumbnails: false,
    },
    settings: {
      overlayColor: "#000",
      slideAnimationType: "slide",
    },
  };

  return (
    <>
      <NextSeo
        title={`${venue.name} • Partypakki`}
        description={description}
        openGraph={{
          type: "website",
          url: `${URL}/venue/${venue.uuid}/`,
          title: `${venue.name} • Partypakki`,
          description,
          images: [
            {
              url: path(venue.photos[0].image),
            },
            {
              url: path(venue.photos[1].image),
            },
            {
              url: path(venue.photos[2].image),
            },
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <main>
        <div className="custom-container p-5 sm:p-10">
          <div className="flex items-end gap-2">
            <h1 className="text-3xl font-semibold md:text-4xl">{venue.name}</h1>
            {renderFoodType()}
          </div>
          <div className="flex justify-between">
            <div className="mt-2 flex gap-2">
              <BsFillStarFill className="inline" size={21} color="#fbc02d" />
              <span className="text-base">
                {venue.rating ?? ""}{" "}
                {venue.reviews.length > 0
                  ? `• ${venue.reviews.length} ${
                      venue.reviews.length === 1 ? "review" : "reviews"
                    }`
                  : ""}
                {" • "}
                <span>
                  {venue.location.city}, {venue.location.state}
                </span>
              </span>
            </div>
            <MediaQuery minWidth={640}>
              <SaveAndShare className="mt-[-5px]" />
            </MediaQuery>
          </div>
          <MediaQuery maxWidth={640}>
            <span>
              <SaveAndShare
                className="mt-4 justify-end"
                btnClassName="btn-sm btn-outline"
              />
            </span>
          </MediaQuery>
          {/* images grid  */}
          <SRLWrapper options={srloptions}>
            <div
              className={`${styles["venue-images"]} relative mt-5 grid grid-cols-4 grid-rows-2 gap-2`}
            >
              {venue.photos.map((photos, i) => (
                <div
                  key={photos.uuid}
                  className={`${
                    i === 0
                      ? "col-span-4 row-span-4 sm:col-span-2 sm:row-span-2"
                      : "hidden sm:block"
                  } relative cursor-pointer`}
                >
                  <Image src={path(photos.image)} layout="fill" />
                </div>
              ))}
              <label
                htmlFor="photos-modal"
                className="absolute right-4 bottom-4 flex cursor-pointer items-center gap-2 rounded bg-white px-3 py-2"
              >
                <BsGrid1X2 className="inline" />
                <span>Show all photos</span>
              </label>
            </div>
            {/* all photos modal  */}
            <input type="checkbox" id="photos-modal" className="modal-toggle" />
            <div className="fullscreen-modal modal">
              <div className="modal-box relative">
                <label
                  htmlFor="photos-modal"
                  className="btn btn-circle btn-sm absolute right-2 top-2"
                >
                  ✕
                </label>
                <div className="custom-container p-5 md:p-10">
                  <Masonry
                    breakpointCols={{
                      default: 2,
                      576: 1,
                    }}
                    className={styles.masonry}
                    columnClassName={styles.masonryColumn}
                  >
                    {photos}
                  </Masonry>
                </div>
              </div>
            </div>
          </SRLWrapper>

          {/* descrition and booking request  */}
          <section className="mt-10 flex gap-8">
            <div className="flex flex-col">
              <div className="mb-5">{parse(venue.description)}</div>
              {venue?.restaurant?.photos.length > 0 && (
                <div className="border-t-2 py-5">
                  <h3 className="mb-5 text-2xl font-bold">
                    This venue serves...
                  </h3>
                  <Carousel gap={15} cols={4}>
                    {venue.restaurant.photos.map((obj) => (
                      <Carousel.Item key={obj.uuid}>
                        <Image
                          src={path(obj.image)}
                          className="cursor-pointer rounded-md object-cover"
                          width={300}
                          height={200}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
              )}
              {venue.amenities.length > 0 && (
                <div className="border-t-2 py-5">
                  <h3 className="text-2xl font-bold">
                    What this venue offers...
                  </h3>
                  <div className="my-5 grid gap-4 sm:grid-cols-2">
                    {venue.amenities.map((amenity) => (
                      <div
                        className="flex items-center gap-4"
                        key={amenity.slug}
                      >
                        <Image
                          width={32}
                          height={32}
                          className="contain"
                          src={path(amenity.icon)}
                        />
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <MediaQuery minWidth={640}>
              <div className="min-w-[270px] xmd:min-w-[350px]">
                <div className="sticky top-24 border-2 p-5">
                  {venue.rent ? (
                    <>
                      <strong className="text-2xl">₹ {venue.rent} </strong> for{" "}
                      {venue.rent_by} (Approx.)
                    </>
                  ) : (
                    <div className="text-sm">
                      To know about the price, you can request for a booking.
                    </div>
                  )}
                  <div className="mt-2">
                    <button
                      className="btn btn-primary mt-4 w-full"
                      onClick={openReqBookingModal}
                    >
                      Request for booking
                    </button>
                    <div className="mt-3 text-xs">
                      You won&apos;t be charge for requesting booking. once
                      requested you will be contacted by us.
                    </div>
                  </div>
                </div>
              </div>
            </MediaQuery>
          </section>
          {/* comments  */}
          <hr className="my-10" />
          <section>
            {venue.reviews.length ? (
              <>
                <div className="flex gap-2">
                  <BsFillStarFill
                    className="inline"
                    size={24}
                    color="#fbc02d"
                  />
                  <span className="text-base">
                    {venue.rating ?? ""}{" "}
                    {venue.reviews.length > 0
                      ? `• ${venue.reviews.length} ${
                          venue.reviews.length === 1 ? "review" : "reviews"
                        }`
                      : ""}
                  </span>
                </div>
                <div className="mt-8 grid gap-14 sm:grid-cols-2">
                  {venue.reviews.map((review) => (
                    <article key={review.uuid}>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-16">
                            <Image
                              src={path(review.user.photo)}
                              layout="fill"
                              className="rounded-full"
                            />
                          </div>
                        </div>
                        <span>
                          <strong className="text-lg">
                            {review.user.first_name} {review.user.last_name}
                          </strong>
                          <div className="text-sm text-gray-400">
                            {dayjs(review.date).format("MMM DD, YYYY")}
                          </div>
                        </span>
                      </div>
                      <div className="mt-3">{review.comment}</div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-slate-400">
                No one has given reviews yet.
              </div>
            )}
          </section>
        </div>
        <div className="h-40 sm:h-0"></div>
        {/* seo related  */}
        <link itemProp="thumbnailUrl" href={path(venue.photos[0].image)} />
        <span
          itemProp="thumbnail"
          itemScope
          itemType="http://schema.org/ImageObject"
        />
        <link itemProp="url" href={path(venue.photos[0].image)} />
      </main>
      <ReqBookingModal venue={venue} />
      {/* mobile view request booking  */}
      <MediaQuery maxWidth={640}>
        <RequestBookingAction
          venue={venue}
          openReqBookingModal={openReqBookingModal}
        />
      </MediaQuery>
      {/* share modal  */}
      <ShareModal />
    </>
  );
};

export default Venue;

export async function getStaticPaths() {
  const { data } = await client.get("venues/");
  const paths = data.map((venue) => {
    return {
      params: { id: venue.uuid },
    };
  });
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { data } = await client.get(`venues/${params.id}/`);
  return {
    props: { venue: data },
  };
}
