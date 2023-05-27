import React, { useState } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DatePicker, { utils } from "react-modern-calendar-datepicker";
import { useSelector, useDispatch } from "react-redux";
import Popup from "reactjs-popup";

import { requestBooking } from "../../actions/booking";
import { setReqBookingModal } from "../../actions/other";
import Error from "../FormError";

const ReqBookingModal = ({ venue }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  const reqBookingModal = useSelector((state) => state.other.reqBookingModal);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const DateInput = ({ ref }) => (
    <input
      ref={ref}
      type="text"
      className="input input-bordered w-full"
      value={
        selectedDay
          ? `${selectedDay.day}/${selectedDay.month}/${selectedDay.year}`
          : ""
      }
      readOnly
      required
    />
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const clearForm = () => {
    setSelectedDay(null);
    reset({
      no_of_guests: "",
      remarks: "",
    });
    dispatch(setReqBookingModal(false));
  };

  const onSubmit = async (obj) => {
    obj.event_date = selectedDay
      ? `${selectedDay.day}/${selectedDay.month}/${selectedDay.year}`
      : null;
    obj.venue = venue.uuid;
    obj.user = user.user;
    const res = await dispatch(requestBooking(obj));
    if (res.status === 201) {
      toast.success(res.success);
    } else {
      toast.error(res.error);
    }
    clearForm();
  };

  return (
    <Popup
      open={reqBookingModal}
      onClose={() => dispatch(setReqBookingModal(false))}
      closeOnDocumentClick
    >
      <div className="modal-open modal">
        <div className="modal-box relative">
          <h3 className="mb-4 text-center text-lg font-bold">
            Request for booking
          </h3>
          <hr />
          <button className="hidden"></button> {/* for disable auto focus */}
          <form className="mt-3 flex flex-col items-center">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Pick a date</span>
              </label>
              <DatePicker
                value={selectedDay}
                onChange={setSelectedDay}
                shouldHighlightWeekends
                renderInput={DateInput}
                wrapperClassName="booking-date w-full max-w-xs"
                calendarPopperPosition="bottom"
                minimumDate={utils().getToday()}
              />
            </div>
            <div className="form-control mt-3 w-full max-w-xs">
              <label className="label">
                <span className="label-text">No. of guests</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full max-w-xs"
                {...register("no_of_guests", {
                  required: "No. of guests is required",
                })}
              />
              <Error message={errors.no_of_guests?.message} />
            </div>
            <div className="form-control mt-3 w-full max-w-xs">
              <label className="label">
                <span className="label-text">Write any query you have</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="e.g. I need a venue which is suitable for wedding, birthday, etc."
                {...register("remarks")}
              ></textarea>
            </div>
            <div className="form-control mt-5 w-full max-w-xs">
              <button
                className="btn btn-primary w-full"
                onClick={handleSubmit(onSubmit)}
              >
                Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </Popup>
  );
};

export default ReqBookingModal;
