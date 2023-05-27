import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import MediaQuery from "react-responsive";

import { setFeedbackModal, setQaModal } from "../actions/other";
import { path } from "../config";
import FeedbackModal from "./modals/FeedbackModal";
import QAModal from "./modals/QAModal";

const QueryAndBooking = () => {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const router = useRouter();

  const queries = user?.bookings;

  const showCardDescription = (query) => {
    switch (query.process_stage) {
      case "Requested":
        return (
          <p className="xmd:text-md mt-3 text-sm">
            Your have <span className="badge badge-info">Requested</span> for
            booking of this venue on{" "}
            <strong>
              {dayjs(query.query_date).format("DD/MM/YYYY hh:mm A")}
            </strong>
            . Specified <strong>date for the event</strong> is{" "}
            <strong>{query.event_date}</strong> and approx.{" "}
            <strong>no of guests </strong>
            you have specified is <strong>{query.no_of_guests}</strong>.
          </p>
        );
      case "Confirmed":
        return (
          <p className="xmd:text-md mt-3 text-sm">
            Your booking has been{" "}
            <span className="badge badge-success">Confirmed.</span> Specified{" "}
            <strong>date for the event</strong> is{" "}
            <strong>{query.event_date}</strong> and approx.{" "}
            <strong>no of guests </strong>
            you have specified is <strong>{query.no_of_guests}</strong>.
          </p>
        );
      case "Cancelled":
        return (
          <p className="mt-3">
            Your booking has been{" "}
            <span className="badge badge-error">Cancelled.</span>
          </p>
        );
      case "Completed":
        return (
          <p className="mt-1">
            {" "}
            Event completed on <strong>{query.event_date}</strong>.
            <span className="text-3xl">🎉</span>
          </p>
        );
      default:
        return null;
    }
  };

  const showExtraActions = (query) => {
    switch (query.process_stage) {
      case "Requested":
      case "Confirmed":
        return (
          <button
            className="btn btn-primary"
            onClick={() => openQaModal(query)}
          >
            Q&A
          </button>
        );
      case "Completed":
        const review = !!user.reviews.find(
          (r) => r.venue.uuid == query.venue.uuid
        );
        return (
          <button
            className="btn btn-primary"
            onClick={() => openFeedbackModal(query)}
          >
            {review ? "Edit review" : "Give feedback"}
          </button>
        );
      default:
        return null;
    }
  };

  const openQaModal = (query) => {
    dispatch(
      setQaModal({
        isOpen: true,
        query,
      })
    );
  };

  const openFeedbackModal = (query) => {
    dispatch(
      setFeedbackModal({
        isOpen: true,
        venueId: query.venue.uuid,
      })
    );
  };

  return (
    <>
      {/* Queries and bookings  */}
      <section className="mx-2 mt-7">
        <h3 className="mb-5 text-2xl font-bold">Your bookings</h3>
        {queries?.length ? (
          queries.map((query) => {
            return (
              <>
                <div
                  className="card card-side mb-6 bg-base-100 bg-slate-50 shadow-lg lg:h-64"
                  key={query.venue.uuid}
                >
                  <MediaQuery minWidth={768}>
                    <figure className="pl-7 md:w-[300px] md:min-w-[300px]">
                      <Image
                        src={path(query.venue.photos[0].image)}
                        alt="venue photo"
                        width={350}
                        height={250}
                        className="rounded-lg object-cover"
                      />
                    </figure>
                  </MediaQuery>
                  <div className="card-body">
                    <h2 className="text-2xl font-bold  xmd:text-3xl">
                      {query.venue.name}
                    </h2>
                    <strong>
                      ₹ {query.venue.rent} / {query.venue.rent_by}
                    </strong>
                    {showCardDescription(query)}
                    <div className="card-actions mt-3 justify-end">
                      <button
                        className="btn btn-outline"
                        onClick={() =>
                          router.push(`/venue/${query.venue.uuid}`)
                        }
                      >
                        View venue
                      </button>
                      {showExtraActions(query)}
                    </div>
                  </div>
                </div>
              </>
            );
          })
        ) : (
          <>
            <div className="border-2 border-dashed bg-neutral-content p-10 text-center text-gray-500">
              You have not made any queries/bookings yet.
            </div>
          </>
        )}
      </section>
      <QAModal />
      <FeedbackModal />
    </>
  );
};

export default QueryAndBooking;
