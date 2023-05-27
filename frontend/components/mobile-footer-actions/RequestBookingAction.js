const RequestBookingAction = ({ venue, openReqBookingModal }) => {
  return (
    <section className="fixed bottom-[54px] w-full bg-neutral-content px-4 pt-4 pb-6">
      <div className="flex items-center justify-between">
        {venue.rent && (
          <div>
            <strong className="text-2xl">₹ {venue.rent} </strong>/{" "}
            {venue.rent_by}
          </div>
        )}
        <div className={venue.rent ? "" : "w-full"}>
          <button
            className="btn btn-primary w-full"
            onClick={openReqBookingModal}
          >
            Request booking {venue.rent ? "" : "& know the price"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default RequestBookingAction;
